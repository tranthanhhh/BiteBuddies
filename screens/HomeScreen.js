import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation, userId }) {
  const [restaurants, setRestaurants] = useState([]);
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState(0);
  const [position, setPosition] = useState(new Animated.ValueXY());
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const response = await axios.get(
      "https://test-db-1-senior.herokuapp.com/reviews"
    );
    setReviews(response.data);
  };

  useEffect(() => {
    fetchLocation();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      fetchReviews();
    }, [])
  );

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
            limit: 5,
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

  const renderReviewItem = ({ item }, navigation) => {
    return (
      <TouchableOpacity
        style={styles.reviewContainer}
        onPress={() => navigation.navigate("ReviewDetail", { review: item })}
      >
        <Text style={styles.reviewName}>{item.name}</Text>
        <Text style={styles.reviewBody}>{item.body}</Text>
        <Text style={styles.reviewRating}>Rating: {item.rating}</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("RestaurantReview", { restaurantId: item.id })
        }
      >
        <View style={[styles.cardContainer, { width: width * 0.8 }]}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>
            {item.location.address1}, {item.location.city}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Top Restaurants</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("RestaurantDetail")}
        >
          <Text style={styles.buttonText}>View All</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDaytalksHeader = () => {
    return (
      <View style={styles.daytalksHeaderContainer}>
        <Text style={styles.daytalksHeaderText}>Daytalks</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AllReviews")}
        >
          <Text style={styles.buttonText}>View All</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={restaurants}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width - 20}
        snapToAlignment={"center"}
        contentContainerStyle={[
          styles.flatlistContentContainer,
          { marginBottom: 100 },
        ]}
      />
      {renderDaytalksHeader()}
      <FlatList
        data={reviews.slice(0, 5)}
        renderItem={(item) => renderReviewItem(item, navigation)}
        keyExtractor={(item) => item._id}
        style={styles.reviewList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "white",
  },
  flatlistContentContainer: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    width: width - 20,
    height: Dimensions.get("window").height / 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 5,
    marginBottom: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    alignItems: "flex-start",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    width: "100%",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 24,
    alignItems: "flex-start",
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: "#6200ee",
    borderRadius: 4,
    padding: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#6200ee",
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: 118,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  location: {
    fontSize: 12,
    color: "#444",
    marginBottom: 5,
  },
  reviewContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    flexDirection: "column",
  },
  reviewName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  reviewBody: {
    fontSize: 14,
    marginBottom: 5,
  },
  reviewRating: {
    fontSize: 12,
    color: "#444",
  },
  reviewList: {
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  daytalksHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    width: "100%",
    alignSelf: "flex-start",
  },
  daytalksHeaderText: {
    fontWeight: "bold",
    fontSize: 24,
    alignItems: "flex-start",
    paddingTop: 5,
    paddingLeft: 10,
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
