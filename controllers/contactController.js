const Contact = require('../models/Contact');
const createError = require('../utils/appError');

// POST a new contact
exports.createContact = async (req, res) => {
  const { name, phone, email, message } = req.body;
  
  // Kiểm tra các trường bắt buộc
  if (!name || !phone || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    let newContact = new Contact({
      name,
      phone,
      email,
      message,
      sentDate: new Date() // Sử dụng ngày hiện tại làm ngày gửi
    });
    await newContact.save(); // Lưu thông tin liên hệ mới vào database
    res.status(201).json({ success: true, message: "Send successfully.", data: newContact });
  } catch (error) {
    console.error("Error sending message:", error); // Ghi log lỗi ra console
    res.status(500).json({ success: false, message: error.message });
  }
};
// UPDATE a single contact by ID
exports.updateContact = async (req, res) => {
  const { responseDate, status } = req.body;

  // Optional: Check if the status or date are actually provided
  if (!responseDate || !status) {
    return res.status(400).json({ success: false, message: "Missing fields for update." });
  }

  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: { responseDate: responseDate, status: status } },
      { new: true }  // Return the updated document
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({ success: true, message: "Contact updated successfully.", data: contact });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all contacts
exports.getAllContacts = async (req, res) => {
  try {
    // Sort contacts by 'sentDate' in descending order (most recent first)
    let contacts = await Contact.find().sort({ sentDate: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// GET a single contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error("Error retrieving contact:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
