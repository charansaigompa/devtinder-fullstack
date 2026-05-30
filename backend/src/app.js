const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const{userAuth}=require("./middleware/auth");

const cors=require("cors")
const http=require("http")
const initializesocket=require("./utils/socket")

require("dotenv").config()

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}))


const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")
const userRouter=require("./routes/user")
const chatRouter=require("./routes/chat")


app.use(express.json());
app.use(cookieParser());
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)
app.use("/",chatRouter)

const server=http.createServer(app)
initializesocket(server)


connectDB()
  .then(() => {
    console.log("Database connection done ");
    server.listen(process.env.PORT, () => {
      console.log("server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });
