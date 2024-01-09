import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import usersRouter from './routes/users.js';
import usersRoute from './routes/auth.js';
import postRoute from './routes/posts.js';
import conversationRoute from './routes/conversation.js'
import messageRoute from './routes/message.js'
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

dotenv.config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/customers', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectToDatabase();

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json('file uploaded succe');
  } catch (error) {
    console.log(error);
  }
});

app.use('/api/users', usersRouter);
app.use('/api/auth', usersRoute);
app.use('/api/posts', postRoute);
app.use('/api/converstaion',conversationRoute)
app.use('/api/message',messageRoute)

app.listen(8800, () => {
  console.log(`Server is running on port 8800`);
});
