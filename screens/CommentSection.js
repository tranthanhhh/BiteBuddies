import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const CommentsList = ({ reviewId }) => {
  const [comments, setComments] = useState([]);
  // Use the useEffect hook to fetch comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Fetch comments from the server for a specific review// Fetch comments from the server for a specific review
        const response = await fetch(
          `https://test-db-1-senior.herokuapp.com/reviews/${reviewId}/comments`
        );

        if (!response.ok) {
          throw new Error("Something went wrong while fetching the comments");
        }
        // Get the fetched comments data and update the state
        const fetchedComments = await response.json();
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    // Call the fetchComments function
    fetchComments();
  }, [reviewId]);
  // Render the CommentsList component
  return (
    <View style={styles.container}>
      {comments.map((comment) => (
        <View key={comment._id} style={styles.comment}>
          <Text style={styles.commentName}>{comment.name}</Text>
          <Text style={styles.commentText}>{comment.text}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  comment: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f8f8f8",
  },
  commentName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
  },
});

export default CommentsList;
