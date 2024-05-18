const multer = require('multer');

const storage = multer.memoryStorage(); // Lưu trữ file trong bộ nhớ

const multerMiddleware = multer({
  storage: storage,
}).single('profilePicture');

module.exports = multerMiddleware;
