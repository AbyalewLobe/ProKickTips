import { sendNotification } from "../../utils/sendNotification.js";
import Notification from "../models/Notification.js";
import Prediction from "../models/Prediction.js";
import User from "../models/User.js";

// ✅ Get all predictions
export const getAllPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find().populate("user", "name email");
    res.status(200).json({
      message: "Predictions fetched successfully",
      data: predictions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get prediction by ID
export const getPredictionById = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }

    res.status(200).json({
      message: "Prediction fetched successfully",
      data: prediction,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Delete prediction
export const deletePrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findByIdAndDelete(req.params.id);
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }
    res.status(200).json({ message: "Prediction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update prediction status
export const updatePredictionStatus = async (req, res) => {
  // Accept a few common status variants from clients and canonicalize them
  // Store canonical values matching the Mongoose model enum: 'pending' | 'won' | 'lost'
  const allowedStatuses = ["pending", "won", "lost"];
  const canonicalMap = {
    pending: "pending",
    pending: "pending",
    won: "won",
    win: "won",
    lost: "lost",
    lose: "lost",
  };

  try {
    let { status } = req.body;

    if (typeof status === "string") {
      const key = status.trim().toLowerCase();
      status = canonicalMap[key] || status.trim().toLowerCase();
    }

    // Validate status after canonicalization
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }

    prediction.status = status;
    await prediction.save();

    res.status(200).json({
      message: "Prediction status updated successfully",
      prediction,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Create Prediction
export const createPrediction = async (req, res) => {
  try {
    const { match, bet, odds, type, user } = req.body;

    if (!user) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newPrediction = new Prediction({
      user,
      match,
      bet,
      odds,
      type,
      status: "pending",
    });

    const savedPrediction = await newPrediction.save();

    if (savedPrediction.type === "free") {
      const user = await User.find();
      const notifications = user.map((u) => ({
        user: u._id,
        role: "user",
        title: "New Free Prediction",
        message: `New prediction: ${savedPrediction.match}`,
      }));
      const not = await Notification.insertMany(notifications);
      res.status(200).json({
        message: `Notification sent to ${notifications.length} free users`,
      });
    }
    if (savedPrediction.type === "premium") {
      const users = await User.find({ access: "Premium" });

      for (const u of users) {
        await sendNotification({
          user: u._id,
          role: "user",
          title: "New Premium Prediction",
          message: `Premium prediction available: ${savedPrediction.match}`,
        });
      }
    }

    res.status(201).json({
      message: "Prediction created successfully",
      prediction: savedPrediction,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get predictions for logged-in user
export const getPredictionsHistory = async (req, res) => {
  try {
    // Get the date from query (e.g. /prediction/history?date=2025-11-10)
    const { date } = req.query;

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    let dateFilter = {};

    if (date) {
      // If user selected a specific day
      const selectedDate = new Date(date);
      const startOfSelected = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfSelected = new Date(selectedDate.setHours(23, 59, 59, 999));

      dateFilter = {
        createdAt: { $gte: startOfSelected, $lte: endOfSelected },
      };
    } else {
      // If no date provided → get all predictions except today's
      dateFilter = { createdAt: { $lt: startOfToday } };
    }

    const predictions = await Prediction.find(dateFilter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: date
        ? `Predictions fetched for ${new Date(date).toDateString()}`
        : "All previous predictions (excluding today) fetched successfully",
      data: predictions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getTodayFreePredictions = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    const predictions = await Prediction.find({
      type: "free",
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    }).populate("user", "name email");
    res.status(200).json({
      message: "Today's free predictions fetched successfully",
      data: predictions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
