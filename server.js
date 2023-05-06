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

// Create a user schema
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
  avatar: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
// Create a review schema
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

// Old saved restaurant schema- don't use it anymore
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

// Create a saved restaurant schema for user's collection
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

// Create a comment schema, and replies
const CommentSchema = new mongoose.Schema({
  name: String,
  text: String,
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  createdAt: { type: Date, default: Date.now },
  replies: [
    {
      name: String,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Comment = mongoose.model("Comment", CommentSchema);
// Create restaurant's comment schema
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

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    // hash user's password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();
    // new user is saved to the database, a JSON Web Token is created for the users.
    const token = jwt.sign({ userId: newUser._id }, "mysecretkey");

    res.status(201).json({ token, userId: newUser._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login route. The route receives email and password from the body.
// Cjecks if a user exists in the database, and returns an error if not.
// If the email is found, the provided password is compared to the stored hashed password using bcrypt.
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "mysecretkey");

    res.status(200).json({ token, userId: user._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users. Retrieves all user documents from the database
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get a specific user.
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
// Create a new review, it receives name, body, rating from the requested body.
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
// Get all reviews.
app.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Old saved restaurant - Don't use anymore
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
// Save a specific restaurant to user's colection
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
// Create a new comment for review.
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
// Get all comments for a specific review.
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
// Update user name
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
// Get all the comment for a specific restaurant
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
// Post a new comment for a specific restaurant
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
// Delete the saved restaurant from user's collection
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
// Update user's avatar. It can save the url of the avatar in the database but cannot display on the setting screen.
app.put("/users/:userId/avatar", async (req, res) => {
  try {
    const { userId } = req.params;
    const { avatar } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.avatar = avatar;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
  // Create a reply for the comment of a restaurant
  app.post("/comments/:commentId/replies", async (req, res) => {
    try {
      const { name, text } = req.body;
      const commentId = req.params.commentId;
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      const reply = { name, text };
      comment.replies.push(reply);
      await comment.save();
      res.status(201).json(comment);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  // Get all replies for a restaurant
  app.get("/comments/:commentId/replies", async (req, res) => {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      const replies = comment.replies;
      res.status(200).json(replies);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  mongoose.connect(process.env.MONGODB_URI);
});
