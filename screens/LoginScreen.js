import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import axios from "axios";

const Login = ({ navigation, handleLogin }) => {
  // Declare state variables for email, password, and error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // Function to log in the user
  const login = async () => {
    try {
      // Send a POST request to the login API with email and password
      const response = await axios.post(
        "https://test-db-1-senior.herokuapp.com/login",
        {
          email,
          password,
        }
      );
      // Extract token and userId from the response
      const { token, userId } = response.data;
      console.log("Login successful, token:", token);
      setError("");
      handleLogin(userId);
    } catch (err) {
      setError("Invalid credentials");
    }
  };
  // Render the login component
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
        <Button mode="contained" onPress={login}>
          Login
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("Signup")}
          style={styles.signupButton}
        >
          Signup
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

export default Login;
