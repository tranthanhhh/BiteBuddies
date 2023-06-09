import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Rating } from "react-native-ratings";

const AddReviewScreen = () => {
  // Declare state variables for the review's title, body, and rating
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0);
  // Define the handleSubmit function to submit the review data
  const handleSubmit = async () => {
    try {
      // Send a POST request with the review data to the server
      const response = await fetch(
        "https://test-db-1-senior.herokuapp.com/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            body,
            rating,
          }),
        }
      );
      // Check if the response is OK, otherwise throw an error
      if (!response.ok) {
        throw new Error("An error occurred while submitting the review.");
      }
      // Parse the response data and reset the state variables
      const responseData = await response.json();
      console.log(responseData);
      setName("");
      setBody("");
      setRating(0);
    } catch (error) {
      // Log the error and display an alert to the user
      console.log(error);
      alert("An error occurred. Please try again.");
    }
  };
  // Render the AddReviewScreen component
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Write a Review</Text>
        <TextInput
          placeholder="Title"
          value={name}
          onChangeText={setName}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />
        <TextInput
          placeholder="Review"
          value={body}
          onChangeText={setBody}
          multiline={true}
          style={styles.multilineInput}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />
        <Text style={styles.ratingText}>Rating:</Text>
        <View style={styles.ratingContainer}>
          <Rating
            type="star"
            startingValue={rating}
            onFinishRating={setRating}
            imageSize={30}
            ratingCount={5}
            style={styles.rating}
          />
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 48,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 16,
    paddingLeft: 16,
  },
  multilineInput: {
    width: "100%",
    height: 120,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 16,
    paddingLeft: 16,
    paddingTop: 16,
    textAlignVertical: "top",
  },
  rating: {
    marginVertical: 16,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#2f95dc",
    width: "100%",
    height: 48,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  ratingContainer: {
    backgroundColor: "transparent",
    marginBottom: 16,
  },
});

export default AddReviewScreen;
