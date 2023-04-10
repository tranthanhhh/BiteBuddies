import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const AllReviewsScreen = ({ navigation }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const response = await axios.get(
      "https://test-db-1-senior.herokuapp.com/reviews"
    );
    setReviews(response.data);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ReviewDetail", { review: item })}
      >
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewName}>{item.name}</Text>
          <Text style={styles.reviewBody}>{item.body}</Text>
          <Text style={styles.reviewRating}>Rating: {item.rating}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  reviewContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
});

export default AllReviewsScreen;
