import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
// Main SettingsScreen component
const SettingsScreen = ({
  userId,
  handleSignOut,
  navigation,
  onNameUpdate,
}) => {
  console.log("SettingsScreen userId:", userId);
  // Declare state variable for the user object
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "https://via.placeholder.com/150",
  });
  // Function to update the user's name
  const handleNameUpdate = (newName) => {
    setUser((prevUser) => ({ ...prevUser, name: newName }));
  };
  // Fetch user data when the component is in focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `https://test-db-1-senior.herokuapp.com/users/${userId}`
          );
          const userData = await response.json();

          setUser({
            _id: userData._id.$oid,
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar || "https://via.placeholder.com/150",
          });
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      };

      if (userId) {
        fetchUserData();
      }
    }, [userId])
  );
  // Render the main SettingsScreen component

  return (
    <View style={styles.container}>
      <Image style={styles.profileImage} source={{ uri: user.avatar }} />
      <Text style={styles.profileName}>{user.name}</Text>
      <Text style={styles.profileEmail}>{user.email}</Text>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.navigate("AccountSettings", {
            userId: userId,
            onNameUpdate: handleNameUpdate,
          })
        }
        style={styles.settingsButton}
      >
        Account Settings
      </Button>

      <Button
        // Sign out button, the handleSignOut function is defined in App.js
        mode="outlined"
        onPress={handleSignOut}
        style={styles.signOutButton}
      >
        Sign out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileEmail: {
    fontSize: 16,
    color: "#444",
  },
  signOutButton: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  settingsButton: {
    marginTop: 20,
  },
});

export default SettingsScreen;
