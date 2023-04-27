// CommentForm.js
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

const CommentForm = ({ reviewId, onSubmit, userId, userName }) => {
  const [name, setName] = useState(userName || "");
  const [comment, setComment] = useState("");

  useEffect(() => {
    setName(userName);
  }, [userName]);

  const handleSubmit = async () => {
    console.log("Executing handleSubmit...");
    console.log("Name:", name, "Comment:", comment);
    if (name && comment) {
      console.log("Submitting comment...");
      await onSubmit(reviewId, name, comment);
      setComment("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Your Comment"
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#2f95dc",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CommentForm;
