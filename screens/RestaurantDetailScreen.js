import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Image,
  TouchableHighlight,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

export default function RestaurantDetailScreen({ userId, navigation }) {
  // Declare state variables for restaurants,
  // current restaurant index, position, location, error message, loading status, and selected restaurant
  const [restaurants, setRestaurants] = useState([]);
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState(0);
  const [position, setPosition] = useState(new Animated.ValueXY());
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  // Fetch user's location on component mount
  useEffect(() => {
    fetchLocation();
  }, []);
  // Function to request location permission and get the current position
  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    fetchRestaurants(location.coords.latitude, location.coords.longitude);
  };
  // Function to fetch nearby restaurants based on user's location
  const fetchRestaurants = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.yelp.com/v3/businesses/search",
        {
          headers: {
            Authorization:
              "Bearer VG_bLcTp3Xv8e-KEH6ad2mkmhh5ytkNy4wrdxhJGhsLOOXCD2QwjyOuKYYH9wH8NMsloWYzIsVRWWSimv9Hz_xgw0-ZgpgvbB3z9pvyOZIFtwFPIzVjzIpB09efiY3Yx",
          },
          params: {
            latitude,
            longitude,
            term: "restaurants",
            limit: 30,
          },
        }
      );

      const restaurantData = response.data.businesses.map((restaurant) => {
        return {
          id: restaurant.id,
          name: restaurant.name,
          rating: restaurant.rating,
          review_count: restaurant.review_count,
          location: restaurant.location,
          phone: restaurant.phone,
          image_url: restaurant.image_url,
        };
      });

      setRestaurants((restaurants) => [...restaurants, ...restaurantData]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // Function to handle the press event on a restaurant card
  const handleCardPress = (restaurant) => {
    navigation.navigate("RestaurantReview", {
      restaurantId: restaurant.id,
      userId: userId,
    });
  };
  // Function to render a restaurant card
  const renderCard = (restaurant) => {
    return (
      <TouchableHighlight
        key={restaurant.id}
        onPress={() => handleCardPress(restaurant)}
        underlayColor="rgba(0, 0, 0, 0)"
      >
        <View style={styles.card}>
          <Image source={{ uri: restaurant.image_url }} style={styles.image} />
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text
            style={styles.rating}
          >{`Rating: ${restaurant.rating} (${restaurant.review_count} reviews)`}</Text>
          <Text
            style={styles.address}
          >{`${restaurant.location.address1}, ${restaurant.location.city}, ${restaurant.location.state}`}</Text>
          <Text style={styles.phone}>{`Phone: ${restaurant.phone}`}</Text>
        </View>
      </TouchableHighlight>
    );
  };
  // Render the main RestaurantDetailScreen component
  return (
    <View style={styles.container}>
      {loading && <Text>Loading...</Text>}
      {errorMsg && <Text>{errorMsg}</Text>}
      {location && (
        <>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            {restaurants.map((restaurant) => renderCard(restaurant))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  scrollContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    width: 320,
    height: 220,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    marginBottom: 5,
  },
  phone: {
    fontSize: 14,
    marginBottom: 5,
  },
  image: {
    width: 280,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  modalContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 20,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  modalImage: {
    width: 300,
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
  },
  modalName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalRating: {
    fontSize: 18,
    color: "#888",
    marginBottom: 5,
  },
  modalAddress: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalPhone: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "#ff4757",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 2,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  saveButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 2,
  },
});
