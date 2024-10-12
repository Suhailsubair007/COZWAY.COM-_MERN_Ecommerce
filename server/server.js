const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8000;
const connectDB = require('./config/dbConfig')
const userrouter = require('./routes/userRoute')
const adminrouter = require('./routes/adminRoute')


app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());


app.use('/api/users', userrouter);
app.use('/api/admin', adminrouter);

app.listen(port, async () => {
  await connectDB();
  console.log(`Server connected and listning to port ${port}`)
})