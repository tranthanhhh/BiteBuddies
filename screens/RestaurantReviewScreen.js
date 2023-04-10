import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function RestaurantReviewScreen({ route, userId }) {
  const { restaurantId, updateSavedRestaurants } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [commentInput, setCommentInput] = useState("");

  const fetchRestaurantDetails = async (restaurantId) => {
    try {
      const response = await axios.get(
        `https://api.yelp.com/v3/businesses/${restaurantId}`,
        {
          headers: {
            Authorization:
              "Bearer VG_bLcTp3Xv8e-KEH6ad2mkmhh5ytkNy4wrdxhJGhsLOOXCD2QwjyOuKYYH9wH8NMsloWYzIsVRWWSimv9Hz_xgw0-ZgpgvbB3z9pvyOZIFtwFPIzVjzIpB09efiY3Yx",
          },
        }
      );
      setRestaurant(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantDetails(restaurantId);
      fetchComments(restaurantId);
    }
  }, [restaurantId]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `https://test-db-1-senior.herokuapp.com/users/${userId}`
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [userId]);

  const fetchComments = async (restaurantId) => {
    try {
      const response = await axios.get(
        `https://test-db-1-senior.herokuapp.com/restaurants/${restaurantId}/comments`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handlePostComment = async () => {
    if (commentInput.trim() !== "" && user) {
      const userName = user.name || user.email;
      try {
        const response = await axios.post(
          `https://test-db-1-senior.herokuapp.com/restaurants/${restaurantId}/comments`,
          {
            name: userName,
            text: commentInput.trim(),
          }
        );

        setComments([...comments, response.data]);
        setCommentInput("");
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    }
  };

  const handleSavePress = async () => {
    try {
      const response = await axios.post(
        "https://test-db-1-senior.herokuapp.com/saveRestaurant",
        { ...restaurant, userId }
      );
      console.log("Restaurant saved:", response.data);

      if (updateSavedRestaurants) {
        updateSavedRestaurants();
      }
    } catch (error) {
      console.error("Error saving restaurant:", error);
    }
  };

  const renderComments = () => {
    return comments.slice(0, 5).map((comment) => (
      <View key={comment._id} style={styles.commentContainer}>
        <Text style={styles.commentAuthor}>{comment.name}</Text>
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>
    ));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={Platform.OS === "ios" ? 50 : 0}
      >
        <ScrollView>
          {restaurant && (
            <View>
              <View style={styles.restaurantInfoContainer}>
                <Image
                  source={{ uri: restaurant.image_url }}
                  style={styles.restaurantImage}
                />
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantRating}>
                  {restaurant.rating} stars, {restaurant.review_count} reviews
                </Text>
                <Text style={styles.restaurantAddress}>
                  {restaurant.location.address1}
                </Text>
                <Text style={styles.restaurantAddress}>
                  {restaurant.location.city}, {restaurant.location.zip_code}
                </Text>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSavePress}
                >
                  <MaterialIcons name="bookmark" size={30} color="#2f95dc" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View>
            <Text style={styles.commentsHeader}>Comments</Text>
            {renderComments()}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={commentInput}
                onChangeText={setCommentInput}
              />
              <TouchableOpacity
                style={styles.postButton}
                onPress={handlePostComment}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  commentsHeader: {
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
    marginLeft: 10,
  },
  commentContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  commentText: {
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  commentInput: {
    flex: 1,
    borderColor: "#999",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  postButton: {
    backgroundColor: "#0099ff",
    borderRadius: 5,
    padding: 10,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  restaurantInfoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  restaurantRating: {
    fontSize: 16,
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 16,
    marginBottom: 5,
  },
  restaurantImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButton: {
    position: "absolute",
    right: 15,
    bottom: 15,
  },
  commentAuthor: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 3,
  },
});