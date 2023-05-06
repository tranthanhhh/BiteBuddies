import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "react-native-elements";
import axios from "axios";
// RestaurantDetails component displays restaurant information
const RestaurantDetails = ({ restaurant }) => (
  <View style={styles.detailsContainer}>
    <Image style={styles.image} source={{ uri: restaurant.image_url }} />
    <Text style={styles.name}>{restaurant.name}</Text>
    <Text style={styles.address}>{restaurant.location.address1}</Text>
    <Text style={styles.phone}>{restaurant.phone}</Text>
  </View>
);
// Main component
export default function App() {
  // Declare state variables for location, error message, nearby restaurants,
  //selected restaurant, search term, suggestions, and selected suggestion
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  // Request user's location permission and get the current position
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  // Fetch nearby restaurants based on the user's location and search term
  useEffect(() => {
    if (location) {
      const fetchNearbyRestaurants = async () => {
        const apiKey =
          "VG_bLcTp3Xv8e-KEH6ad2mkmhh5ytkNy4wrdxhJGhsLOOXCD2QwjyOuKYYH9wH8NMsloWYzIsVRWWSimv9Hz_xgw0-ZgpgvbB3z9pvyOZIFtwFPIzVjzIpB09efiY3Yx";
        const response = await axios.get(
          `https://api.yelp.com/v3/businesses/search?term=${searchTerm}&latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        setNearbyRestaurants(response.data.businesses);
      };
      fetchNearbyRestaurants();
    }
  }, [location, searchTerm]);
  // Handle search input changes and fetch suggestions
  const handleSearchChange = async (text) => {
    setSearchTerm(text);
    if (text.length > 0) {
      const apiKey =
        "VG_bLcTp3Xv8e-KEH6ad2mkmhh5ytkNy4wrdxhJGhsLOOXCD2QwjyOuKYYH9wH8NMsloWYzIsVRWWSimv9Hz_xgw0-ZgpgvbB3z9pvyOZIFtwFPIzVjzIpB09efiY3Yx";
      const url = `https://api.yelp.com/v3/autocomplete?text=${encodeURIComponent(
        text
      )}&categories=restaurants&locale=en_US`;
      const headers = {
        Authorization: `Bearer ${apiKey}`,
      };
      const response = await axios.get(url, { headers });
      setSuggestions(response.data.terms);
    } else {
      setSuggestions([]);
    }
  };
  // Handle selection of a suggestion
  const handleSuggestionSelect = (suggestion) => {
    setSelectedRestaurant(null);
    setSuggestions([]);
    const selected = nearbyRestaurants.find(
      (restaurant) => restaurant.name === suggestion.text
    );
    if (selected) {
      setSelectedRestaurant(selected);
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{errorMsg}</Text>
      </View>
    );
  }
  // Render the main App component
  return (
    <View style={styles.container}>
      <SearchBar
        // Search bar for searching restaurants
        // Display suggestions if any
        // MapView to display user's location and nearby restaurants
        // Modal to display selected restaurant details
        placeholder="Search for a restaurant"
        onChangeText={handleSearchChange}
        value={searchTerm}
      />
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((term) => (
            <TouchableOpacity
              key={term.text}
              onPress={() => setSearchTerm(term.text)}
            >
              <Text style={styles.suggestionText}>{term.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <MapView
        // Get the coordinate of the restaurant for markers on map
        style={styles.map}
        initialRegion={{
          latitude: location ? location.coords.latitude : 34.366667,
          longitude: location ? location.coords.longitude : -89.516667,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {location ? (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="My Location"
            anchor={{ x: 0.5, y: 0.5 }}
            flat={true}
            rotation={location.coords.heading}
          >
            <Ionicons name="ellipse" size={24} color="#00ABF0" />
          </Marker>
        ) : null}
        {nearbyRestaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.coordinates.latitude,
              longitude: restaurant.coordinates.longitude,
            }}
            title={restaurant.name}
            onPress={() => setSelectedRestaurant(restaurant)}
          >
            <Ionicons name="location" size={24} color="red" />
          </Marker>
        ))}
      </MapView>

      <Modal
        // Modal pop up when users click on the marker
        visible={selectedRestaurant !== null}
        onRequestClose={() => setSelectedRestaurant(null)}
        animationType="slide"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity onPress={() => setSelectedRestaurant(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <RestaurantDetails restaurant={selectedRestaurant} />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  address: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
  },
  phone: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  closeButtonContainer: {
    padding: 16,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    elevation: 10,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  searchIcon: {
    marginLeft: 10,
  },
  suggestionsContainer: {
    position: "relative",
    left: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 999,
    elevation: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    maxHeight: 200,
  },
  suggestionText: {
    fontSize: 16,
    paddingVertical: 5,
  },
  selectedSuggestion: {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  },
  suggestion: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});
