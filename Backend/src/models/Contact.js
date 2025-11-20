import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100, // Increased max length for names
    },
    email: {
      type: String,
      required: true,
      trim: true,

      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 2000,
    },
    read: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional reference to User
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
