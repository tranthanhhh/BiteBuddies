// This component is responsible for rendering a form for submitting comments.
// It receives props for the review ID, the onSubmit function, the user ID, and the user name.
// It uses state hooks to manage the values of the name and comment inputs.
// It also includes an effect hook to update the name input if the userName prop changes.
// The handleSubmit function is triggered when the user submits the form, and it calls the onSubmit prop function with the review ID, name, and comment values.
// If the name and comment are both non-empty, the comment input is cleared.
// The styles define the appearance of the container, input field, button, and button text.

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
