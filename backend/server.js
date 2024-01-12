const express = require("express")
const mongoose = require('mongoose')
const connectDB = require("./config/db");
const cors = require('cors')
const path = require("path");

const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes")
const postCategoriesRoutes = require("./routes/postCategoriesRoutes")
const commentRoutes = require('./routes/commentRoutes');

const app = express()
connectDB()
app.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'x-totalpagecount');
  next();
});
app.use(cors({
  origin: 'https://menrn-blog-frontend.vercel.app' // 允許此來源的請求
}));

// const corsOptions = {
//   origin: "http://localhost:3000", // 前端服務的來源
//   method: ["GET", "POST", "PUT", "DELETE"], // 允許的 http request
//   credentials: true, // 允許跨域 cookies
// };

// app.use(cors(corsOptions));

app.use(express.json())
// app.use(express.static(path.join("public")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/post-categories", postCategoriesRoutes);
app.use('/api/comments', commentRoutes);

// app.use((req, res, next) => {
//   res.sendFile(path.resolve(__dirname, "public", "index.html"));
// });


const PORT = process.env.PORT || 4000;
// const mongoose = require("mongoose");



app.listen(PORT, ()=>{
  console.log(`Server is running at port ${PORT}`);
})

