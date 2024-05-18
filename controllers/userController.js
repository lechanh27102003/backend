const User = require('../models/User');

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).send('User not found');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.uploadAvatar = async (req, res) => {
  const base64String = req.body.profilePicture; // Nhận chuỗi Base64 từ client
  const userId = req.params.userId;

  try {
    // Cập nhật trường profilePicture của user trong MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: base64String },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.json(updatedUser); // Trả về thông tin user sau khi đã cập nhật
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).send('Error uploading avatar.');
  }
};