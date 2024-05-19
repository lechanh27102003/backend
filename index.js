const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3002;
const path = require('path');
const multer = require('multer');

app.use(bodyParser.json({ limit: '5mb' }));  // Tăng giới hạn cho JSON payload
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));  // Tăng giới hạn cho URL-encoded payload


app.use(bodyParser.json({ limit: '10mb' }));  // Tăng giới hạn cho JSON payload
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));  // Tăng giới hạn cho URL-encoded payload



// Middleware
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware CORS
app.use(cors({
  origin: ['https://deft-narwhal-3a7799.netlify.app', 'https://plantique.netlify.app', 'https://plantique.io.vn'],
  methods: ['GET', 'HEAD', 'PATCH','POST', 'PUT', 'DELETE'], // Các phương thức được cho phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
  credentials: true, // Cho phép gửi cookie qua CORS
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`; 
    cb(null, filename);
  }
});


const upload = multer({ storage: storage });


app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.send(imageUrl);
});
// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/products', require('./routes/product'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/contacts', require('./routes/contactRoute'));
app.use('/api', require('./routes/orderRoute'));
app.use('/api/users', require('./routes/userRoute'));
app.use('/cart', require('./routes/cartRoute'));
app.use('/api/codes', require('./routes/codeRoute'));
app.use('/api/blogs', require('./routes/blogRoute'));
app.use('/api/campaigns', require('./routes/campaignRoute'));



// Connect to MongoDB
const db = require('./configs/db/mongodb');
db.connect();

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});