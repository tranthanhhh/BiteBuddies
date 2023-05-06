import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import axios from "axios";

const Signup = ({ navigation }) => {
  // Declare state variables for email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // Function to handle successful signup and navigate to Login screen
  const handleSignup = (userId) => {
    console.log("User ID:", userId);
    navigation.navigate("Login");
  };
  // Functions to validate email and password formats
  const isValidEmail = (email) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };
  // Main signup function to create a new user
  const signup = async () => {
    // Validate email and password
    // Make API request to create a new user
    // Handle success and error cases
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 8 characters, with one uppercase letter, one lowercase letter, and one number"
      );
      return;
    }

    try {
      const response = await axios.post(
        "https://test-db-1-senior.herokuapp.com/signup",
        {
          email,
          password,
        }
      );
      const { token, userId } = response.data;
      console.log("Signup successful, token:", token);
      setError("");
      handleSignup(userId);
    } catch (err) {
      setError("User with this email already exists");
    }
  };
  // Render the main Signup component
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          source={require("../assets/login.jpeg")}
          style={styles.image}
          resizeMode="contain"
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry
        />
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
        <Button mode="contained" onPress={signup}>
          Signup
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("Login")}
          style={styles.signupButton}
        >
          Login
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  input: {
    marginBottom: 10,
  },
  signupButton: {
    marginTop: 10,
  },
  image: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 150,
  },
});

export default Signup;
