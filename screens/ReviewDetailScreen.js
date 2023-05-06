import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import CommentForm from "../components/CommentForm";
import CommentsList from "../components/CommentList";

export default function ReviewDetailScreen({ route, userId }) {
  // Declare state variables for comments and user's name
  const { review } = route.params;
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState("");
  // Fetch user data on component mount
  useEffect(() => {
    console.log("User ID:", userId);

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://test-db-1-senior.herokuapp.com/users/${userId}`
        );

        if (!response.ok) {
          throw new Error("Something went wrong while fetching the user data");
        }

        const user = await response.json();
        console.log("User data fetched:", user);
        setUserName(user.name || user.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);
  // Log the updated userName
  useEffect(() => {
    console.log("userName state updated:", userName);
  }, [userName]);
  // Function to handle comment submission

  const handleCommentSubmit = async (reviewId, name, comment) => {
    console.log("Handling comment submit...");

    try {
      console.log("Submitting comment to the API...");
      const response = await fetch(
        `https://test-db-1-senior.herokuapp.com/reviews/${reviewId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, text: comment }),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong while submitting the comment");
      }

      console.log("Fetching updated comments...");
      const updatedComments = await fetch(
        `https://test-db-1-senior.herokuapp.com/reviews/${reviewId}/comments`
      );
      const updatedCommentsData = await updatedComments.json();
      setComments(updatedCommentsData);
    } catch (error) {
      console.error("Error submitting the comment:", error);
    }
  };
  // Render the main ReviewDetailScreen component
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.reviewName}>{review.name}</Text>
          <Text style={styles.reviewBody}>{review.body}</Text>
          <Text style={styles.reviewRating}>Rating: {review.rating}</Text>
          <CommentForm
            reviewId={review._id}
            onSubmit={handleCommentSubmit}
            userId={userId}
            userName={userName}
          />
          <CommentsList
            reviewId={review._id}
            comments={comments}
            setComments={setComments}
            userId={userId}
            userName={userName}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  reviewName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewBody: {
    fontSize: 16,
    marginBottom: 10,
  },
  reviewRating: {
    fontSize: 14,
    color: "#444",
  },
});
