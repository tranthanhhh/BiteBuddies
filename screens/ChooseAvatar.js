// Allows users to choose an avatar from a predefined list.
// Not working, only display the avatars.

import axios from "axios";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";

const avatars = [
  "https://via.placeholder.com/150/1",
  "https://via.placeholder.com/150/2",
  "https://via.placeholder.com/150/3",
  "https://via.placeholder.com/150/4",
];

const ChooseAvatar = ({ navigation, route }) => {
  const handleAvatarSelection = async (selectedAvatar) => {
    if (route.params && route.params.setAvatar) {
      route.params.setAvatar(selectedAvatar);
    }
    if (route.params && route.params.userId) {
      // if route.params.userId is provided, sends PUT request to update user's avatar in the backend.
      // if route.params.setAvatar is provided, calls the function with the selected avatar.
      try {
        await axios.put(
          `https://test-db-1-senior.herokuapp.com/users/${route.params.userId}/avatar`,
          {
            avatar: selectedAvatar,
          }
        );
      } catch (error) {
        console.error("Error updating avatar:", error);
      }
    }
    // navigate back to the previous screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose an Avatar</Text>
      <FlatList
        data={avatars}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleAvatarSelection(item)}>
            <Image source={{ uri: item }} style={styles.avatar} />
          </TouchableOpacity>
        )}
        numColumns={2}
        keyExtractor={(item) => item}
      />
    </View>
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
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    margin: 10,
  },
});

export default ChooseAvatar;
