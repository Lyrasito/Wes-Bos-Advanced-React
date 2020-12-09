require("dotenv").config({ path: "variables.env" });
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

//use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

//decode JWT to get user Id on each request

server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    //put userId on req for future requests
    req.userId = userId;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  (details) => {
    console.log(`Server is running on port http://localhost:${details.port}`);
  }
);
