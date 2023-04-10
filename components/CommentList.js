import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const CommentsList = ({ reviewId, comments, setComments }) => {
  const [noComments, setNoComments] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `https://test-db-1-senior.herokuapp.com/reviews/${reviewId}/comments`
        );

        if (!response.ok) {
          throw new Error("Something went wrong while fetching the comments");
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid JSON response from the server");
        }

        const fetchedComments = await response.json();
        if (fetchedComments && fetchedComments.length > 0) {
          setComments(fetchedComments);
        } else {
          setNoComments(true);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (!comments.length) {
      fetchComments();
    }
  }, [reviewId, setComments]);

  useEffect(() => {
    setNoComments(comments.length === 0);
  }, [comments]);

  const renderItem = ({ item }) => (
    <View key={item._id} style={styles.comment}>
      <Text style={styles.commentName}>{item.name}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Comments</Text>
      {noComments ? (
        <Text style={styles.noCommentsText}>
          No comments found for this review
        </Text>
      ) : (
        <FlatList
          data={comments.slice(0, 5)}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
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
  noCommentsText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
  },
});

export default CommentsList;
