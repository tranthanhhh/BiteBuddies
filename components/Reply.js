import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";

function Reply({ userName, commentId, onUpdateReplies }) {
  // Set up state to keep track of the reply text
  const [text, setText] = useState("");
  // Define a function to handle the submission of the reply
  const handleSubmit = async () => {
    try {
      // Use Axios to make a POST request to the server with the reply data
      const response = await axios.post(
        `https://test-db-1-senior.herokuapp.com/comments/${commentId}/replies`,
        {
          name: userName,
          text,
        }
      );
      console.log(response.data);
      setText("");

      // Call the onUpdateReplies prop function to update the replies for this comment
      onUpdateReplies();
    } catch (error) {
      console.error(error);
    }
  };
  // Render a form for entering the reply text and a button to submit the reply
  return (
    <View>
      <TextInput
        multiline
        value={text}
        onChangeText={(text) => setText(text)}
        style={styles.replyInput}
      />

      <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.replyButtonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  replyLabel: {
    color: "blue",
  },
  replyInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  replyButtonText: {
    color: "blue",
  },
});

export default Reply;
