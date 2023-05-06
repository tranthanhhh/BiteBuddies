//The code defines a component called CommentsList that takes in reviewId, comments, setComments, and userName as props.
//It fetches comments from a remote server and displays them in a flat list.
//It also allows users to reply to comments and updates the comments with the replies.
//The component uses several hooks such as useState and useEffect.
//The code defines a component called CommentsList that takes in reviewId, comments, setComments, and userName as props.
//It fetches comments from a remote server and displays them in a flat list.
//It also allows users to reply to comments and updates the comments with the replies.
//The component uses several hooks such as useState and useEffect.

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Reply from "./Reply";

const CommentsList = ({ reviewId, comments, setComments, userName }) => {
  const [noComments, setNoComments] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(null);

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

  const updateRepliesForComment = async (commentId) => {
    try {
      const response = await fetch(
        `https://test-db-1-senior.herokuapp.com/comments/${commentId}/replies`
      );
      if (!response.ok) {
        throw new Error("Something went wrong while fetching the replies");
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid JSON response from the server");
      }
      const fetchedReplies = await response.json();

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: fetchedReplies }
            : comment
        )
      );
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View key={item._id} style={styles.comment}>
      <Text style={styles.commentName}>{item.name}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
      {item.replies &&
        item.replies.map((reply) => (
          <View key={reply._id} style={styles.reply}>
            <Text style={styles.replyName}>{reply.name}</Text>
            <Text style={styles.replyText}>{reply.text}</Text>
          </View>
        ))}
      <TouchableOpacity
        onPress={() => {
          setShowReplyInput((prev) => (prev === item._id ? null : item._id));
        }}
      >
        <Text style={styles.replyButton}>Reply</Text>
      </TouchableOpacity>
      {showReplyInput === item._id && (
        <Reply
          userName={userName}
          commentId={item._id}
          onUpdateReplies={() => updateRepliesForComment(item._id)}
        />
      )}
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
  reply: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
    backgroundColor: "#f1f1f1",
  },
  replyName: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  replyText: {
    fontSize: 12,
  },
  replyButton: {
    color: "blue",
  },
});

export default CommentsList;
