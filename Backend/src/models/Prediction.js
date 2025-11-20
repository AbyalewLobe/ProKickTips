import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    match: { type: String, required: true },
    bet: { type: String, required: true },
    odds: { type: Number, required: true },
    type: { type: String, enum: ["free", "premium"], required: true },
    status: {
      type: String,
      enum: ["pending", "won", "lost"],
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Prediction = mongoose.model("Prediction", predictionSchema);

export default Prediction;
