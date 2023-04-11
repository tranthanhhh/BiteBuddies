import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import fetch from "cross-fetch";
import { useNavigation } from "@react-navigation/native";

const AccountSettingsScreen = ({ userId, onNameUpdate, navigation }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState("https://via.placeholder.com/150");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://test-db-1-senior.herokuapp.com/users/${userId}`
        );
        const data = await response.json();
        console.log("Updated user data:", data);
        setName(data.name);
        setAvatar(data.avatar || "https://via.placeholder.com/150");
        onNameUpdate(data.name);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleSave = async () => {
    console.log("Name:", name);

    try {
      const response = await fetch(
        `https://test-db-1-senior.herokuapp.com/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, avatar }),
        }
      );

      const data = await response.json();
      console.log("Updated user data:", data);
      setName(data.name);
    } catch (error) {
      console.log("Error updating user data:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() =>
            navigation.navigate("ChooseAvatar", { setAvatar, userId })
          }
        >
          <Image style={styles.avatar} source={{ uri: avatar }} />
          <Text style={styles.changeAvatarText}>Change Avatar</Text>
        </TouchableOpacity>
        <View style={styles.form}>
          <TextInput
            mode="outlined"
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={handleNameChange}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleSave} style={styles.button}>
            Save
          </Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changeAvatarText: {
    fontSize: 16,
    color: "#2f95dc",
  },
  form: {
    width: "80%",
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default AccountSettingsScreen;
