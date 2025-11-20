import Blog from "../models/Blog.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// ✅ Create a new blog post
export const createBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user.id; // Assuming user info is added to req by auth middleware
    const newBlogPost = new Blog({ title, content, author });
    const savedBlogPost = await newBlogPost.save();

    const user = await User.find({ role: "user" });
    const notifications = user.map((u) => ({
      user: u._id,
      role: "user",
      title: "New  Blog Post",
      message: `New blog post: ${savedBlogPost.title}`,
    }));
    const not = await Notification.insertMany(notifications);
    res.status(200).json({
      message: `Notification sent to ${notifications.length}  users`,
    });

    res.status(201).json({
      message: "Blog post created successfully",
      blogPost: savedBlogPost,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get all blog posts
export const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get a single blog post by ID
export const getBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const blogPost = await Blog.findById(id).populate("author", "name email");
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// ✅ Delete a blog post by ID
export const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const blogPost = await Blog.findByIdAndDelete(id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update a blog post by ID
export const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedBlogPost = await Blog.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    if (!updatedBlogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(200).json({
      message: "Blog post updated successfully",
      blogPost: updatedBlogPost,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
