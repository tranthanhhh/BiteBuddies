import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

const CollectionScreen = ({ userId, navigation }) => {
  console.log("userId:", userId);
  const [savedRestaurants, setSavedRestaurants] = useState([]);
  const updateSavedRestaurants = () => {
    fetchSavedRestaurants();
  };
  // Use the useEffect hook to update saved restaurants when the component is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      updateSavedRestaurants();
    });

    return unsubscribe;
  }, [navigation]);
  // Define the fetchSavedRestaurants function to fetch saved restaurants data from the server
  const fetchSavedRestaurants = async () => {
    try {
      console.log("Fetching saved restaurants for user:", userId);
      const response = await axios.get(
        `https://test-db-1-senior.herokuapp.com/getSavedRestaurants?userId=${userId}`
      );
      console.log("API response:", response.data);
      const uniqueRestaurants = Array.from(
        new Set(response.data.map((restaurant) => restaurant.id))
      ).map((id) => response.data.find((restaurant) => restaurant.id === id));

      setSavedRestaurants(uniqueRestaurants);
    } catch (error) {
      console.error("Error fetching saved restaurants:", error);
    }
  };
  // Define the deleteRestaurant function to delete a restaurant from the user's collection
  const deleteRestaurant = async (restaurantId) => {
    try {
      await axios.delete(
        `https://test-db-1-senior.herokuapp.com/deleteRestaurant?userId=${userId}&restaurantId=${restaurantId}`
      );
      updateSavedRestaurants();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };
  // Define the renderItem function to render a restaurant item in the FlatList
  const renderItem = ({ item }) => {
    return (
      <View style={styles.restaurantContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteRestaurant(item.id)}
        >
          <MaterialIcons name="close" size={20} color="red" />
        </TouchableOpacity>
        <Image
          source={{ uri: item.image_url }}
          style={styles.restaurantImage}
          resizeMode="cover"
        />
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantRating}>Rating: {item.rating}</Text>
        <Text style={styles.restaurantPhone}>Phone: {item.phone}</Text>
        <Text style={styles.restaurantAddress}>
          {item.location.address1}, {item.location.city}, {item.location.state}
        </Text>
      </View>
    );
  };
  // Render the CollectionScreen component
  return (
    <View style={styles.container}>
      {savedRestaurants.length > 0 ? (
        <FlatList
          data={savedRestaurants}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>No saved restaurants.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  restaurantContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 20,
    width: 320,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 14,
    marginBottom: 5,
  },
  restaurantImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  restaurantRating: {
    fontSize: 16,
    marginBottom: 5,
  },
  restaurantPhone: {
    fontSize: 14,
    marginBottom: 5,
  },
  deleteButton: {
    position: "absolute",
    zIndex: 1,
    borderRadius: 12,
    padding: 2,
    elevation: 5,
  },
});

export default CollectionScreen;
