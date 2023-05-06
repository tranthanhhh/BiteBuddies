// import necessary screens and components
import "react-native-gesture-handler";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import CollectionScreen from "./screens/CollectionScreen";
import SettingsScreen from "./screens/SettingsScreen";
import RestaurantDetailScreen from "./screens/RestaurantDetailScreen";
import AddReviewScreen from "./screens/AddReviewScreen";
import ReviewDetailScreen from "./screens/ReviewDetailScreen";
import LoginScreen from "./screens/LoginScreen";
import AccountSettingsScreen from "./screens/AccountSettingsScreen";
import SignupScreen from "./screens/SignupScreen";
import RestaurantReviewScreen from "./screens/RestaurantReviewScreen";
import AllReviewsScreen from "./screens/AllReviewScreen";
import ChooseAvatar from "./screens/ChooseAvatar";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
// create stack, tab navigation
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator();
// style the tab
const TabBarIcon = (props) => {
  return (
    <Ionicons
      name={props.name}
      size={26}
      color={props.focused ? "#2f95dc" : "gray"}
    />
  );
};
// Rendering the login screen and sign up screen. handleLogin, handleSignUp are passed as props
const AuthStack = ({ handleLogin, handleSignup }) => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Login" options={{ headerShown: false }}>
        {(props) => <LoginScreen {...props} handleLogin={handleLogin} />}
      </MainStack.Screen>
      <MainStack.Screen name="Signup" options={{ headerShown: false }}>
        {(props) => <SignupScreen {...props} handleSignup={handleSignup} />}
      </MainStack.Screen>
    </MainStack.Navigator>
  );
};
// efine the AccountSettingsStack component, responsible for rendering the SettingsScreen,
//AccountSettingsScreen, and ChooseAvatar screens. The userId, handleSignOut, and onNameUpdate functions are passed as props.
const AccountSettingsStack = ({ userId, handleSignOut, onNameUpdate }) => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" options={{ headerShown: false }}>
        {(props) => (
          <SettingsScreen
            {...props}
            userId={userId}
            handleSignOut={handleSignOut}
            onNameUpdate={onNameUpdate}
          />
        )}
      </SettingsStack.Screen>
      <SettingsStack.Screen
        name="AccountSettings"
        options={{ headerTitle: "Account Settings" }}
      >
        {(props) => (
          <AccountSettingsScreen
            {...props}
            userId={userId}
            onNameUpdate={onNameUpdate}
          />
        )}
      </SettingsStack.Screen>
      <SettingsStack.Screen
        name="ChooseAvatar"
        component={ChooseAvatar}
        options={{ headerTitle: "Choose Avatar" }}
      />
    </SettingsStack.Navigator>
  );
};
// Define the App component that manages the state of user authentication and user data.
export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({});
  // Define the handleLogin, handleSignup, handleSignOut, and handleNameUpdate functions for managing user state and actions.
  const handleLogin = (userId) => {
    setAuthenticated(true);
    setUserId(userId);
  };

  const handleSignup = (userId) => {
    setUserId(userId);
    setAuthenticated(true);
  };

  const handleSignOut = () => {
    setAuthenticated(false);
    setUserId(null);
  };

  const handleNameUpdate = (newName) => {
    setUser((prevUser) => ({ ...prevUser, name: newName }));
  };
  //Define the HomeStack component, responsible for rendering the HomeScreen, RestaurantDetailScreen,
  //RestaurantReviewScreen, ReviewDetailScreen, AccountSettingsScreen, and AllReviewsScreen.
  //The userId prop is passed to the screens.
  const HomeStack = () => {
    return (
      <MainStack.Navigator>
        <MainStack.Screen name="Home" options={{ headerShown: true }}>
          {(props) => <HomeScreen {...props} userId={userId} />}
        </MainStack.Screen>
        <MainStack.Screen
          name="RestaurantDetail"
          options={{ headerTitle: "Restaurant Details" }}
        >
          {(props) => <RestaurantDetailScreen {...props} userId={userId} />}
        </MainStack.Screen>
        <MainStack.Screen
          name="RestaurantReview"
          options={{ headerTitle: "Restaurant Review" }}
        >
          {(props) => <RestaurantReviewScreen {...props} userId={userId} />}
        </MainStack.Screen>
        <MainStack.Screen
          name="ReviewDetail"
          options={{ headerTitle: "Review Detail" }}
        >
          {(props) => <ReviewDetailScreen {...props} userId={userId} />}
        </MainStack.Screen>
        <MainStack.Screen
          name="AccountSettings"
          options={{ headerTitle: "Account Settings" }}
        >
          {(props) => <AccountSettingsScreen {...props} userId={userId} />}
        </MainStack.Screen>
        <MainStack.Screen
          name="AllReviews"
          options={{ headerTitle: "All Reviews" }}
        >
          {(props) => <AllReviewsScreen {...props} userId={userId} />}
        </MainStack.Screen>
      </MainStack.Navigator>
    );
  };

  return (
    // If the user is authenticated, render the Tab.Navigator with the following tab screens.
    // Otherwise, render the MainStack.Navigator with the AuthStack.
    <NavigationContainer>
      {authenticated ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="home-outline" />
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="map-outline" />
              ),
            }}
          />
          <Tab.Screen
            name="Review"
            component={AddReviewScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="add-outline" />
              ),
            }}
          />
          <Tab.Screen
            name="Collection"
            options={{
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="bookmark-outline" />
              ),
            }}
          >
            {(props) => <CollectionScreen {...props} userId={userId} />}
          </Tab.Screen>

          <Tab.Screen
            name="Account"
            options={{
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} name="person-circle-outline" />
              ),
              headerShown: false,
            }}
          >
            {(props) => (
              <AccountSettingsStack
                {...props}
                userId={userId}
                handleSignOut={handleSignOut}
                onNameUpdate={handleNameUpdate}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        // If the user is not authenticated, the MainStack.Navigator renders the AuthStack
        <MainStack.Navigator>
          <MainStack.Screen name="Auth" options={{ headerShown: false }}>
            {(props) => (
              <AuthStack
                {...props}
                handleLogin={handleLogin}
                handleSignup={handleSignup}
              />
            )}
          </MainStack.Screen>
        </MainStack.Navigator>
      )}
    </NavigationContainer>
  );
}
