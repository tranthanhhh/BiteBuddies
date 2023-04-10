const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
require("dotenv").config();

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Create a schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);

const savedRestaurantSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: Number,
  review_count: Number,
  location: {
    address1: String,
    city: String,
    state: String,
  },
  phone: String,
  image_url: String,
});

const SavedRestaurant = mongoose.model(
  "SavedRestaurant",
  savedRestaurantSchema
);

const RestaurantSchema = new mongoose.Schema({
  id: String,
  name: String,
  rating: Number,
  review_count: Number,
  location: {
    address1: String,
    city: String,
    state: String,
  },
  phone: String,
  image_url: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

const CommentSchema = new mongoose.Schema({
  name: String,
  text: String,
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", CommentSchema);

const RestaurantCommentSchema = new mongoose.Schema({
  restaurantId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RestaurantComment = mongoose.model(
  "RestaurantComment",
  RestaurantCommentSchema
);

app.use(bodyParser.json());

// Define signup route
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with this email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, "mysecretkey");

    // Send the token to the client
    res.status(201).json({ token, userId: newUser._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with this email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, "mysecretkey");

    // Send the token to the client
    res.status(200).json({ token, userId: user._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId, { password: 0 });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/reviews", async (req, res) => {
  try {
    const { name, body, rating } = req.body;
    const newReview = new Review({ name, body, rating });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/saveRestaurant", async (req, res) => {
  try {
    const { userId, ...restaurantData } = req.body;
    const savedRestaurant = new Restaurant({ ...restaurantData, userId });
    await savedRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getSavedRestaurants", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    console.log("Fetching saved restaurants for user:", userId);
    const restaurants = await Restaurant.find({ userId });
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching saved restaurants:", error);
    res.status(500).json({ message: "Error fetching saved restaurants" });
  }
});

app.post("/reviews/:reviewId/comments", async (req, res) => {
  try {
    const { name, text } = req.body;
    const reviewId = req.params.reviewId;
    const comment = new Comment({ name, text, reviewId });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/reviews/:reviewId/comments", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const comments = await Comment.find({ reviewId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
});

app.get("/restaurants/:restaurantId/comments", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    console.log("Fetching comments for restaurantId:", restaurantId);
    const comments = await RestaurantComment.find({ restaurantId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (err) {
    console.log("Error fetching comments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/restaurants/:restaurantId/comments", async (req, res) => {
  try {
    const { name, text } = req.body;
    const restaurantId = req.params.restaurantId;
    console.log("Posting comment for restaurantId:", restaurantId);
    const comment = new RestaurantComment({ name, text, restaurantId });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.log("Error posting comment:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/deleteRestaurant", async (req, res) => {
  try {
    const { userId, restaurantId } = req.query;

    if (!userId || !restaurantId) {
      return res
        .status(400)
        .json({ error: "userId and restaurantId are required" });
    }

    console.log("Deleting restaurant for user:", userId);
    await Restaurant.deleteOne({ userId, id: restaurantId });
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ message: "Error deleting restaurant" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  mongoose.connect(process.env.MONGODB_URI);
});
