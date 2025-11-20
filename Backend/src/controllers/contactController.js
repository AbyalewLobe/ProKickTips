import Contact from "../models/Contact.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// ✅ Get all contact messages
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().populate("user", "name email");
    res.status(200).json({
      message: "Contacts fetched successfully",
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// ✅ Create a new contact message
export const createContact = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;
    const userId = req.user ? req.user.id : null;
    const newContact = new Contact({
      fullName,
      email,
      message,
      user: userId,
    });
    await newContact.save();

    const admins = await User.find({ role: "admin" });
    const notifications = admins.map((u) => ({
      user: u._id,
      role: "admin",
      title: "New contact message",
      message: ` ${newContact.fullName} has sent a message.`,
    }));
    const not = await Notification.insertMany(notifications);
    res.status(200).json({
      message: `Notification sent to ${notifications.length} admins`,
    });
    res.status(201).json({
      message: "Contact message created successfully",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Delete a contact message
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }
    res.status(200).json({ message: "Contact message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// ✅ Get contact message by ID
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }
    res.status(200).json({
      message: "Contact message fetched successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Mark contact message as read
export const markContactAsRead = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }
    contact.read = true;
    await contact.save();
    res.status(200).json({
      message: "Contact message marked as read",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
