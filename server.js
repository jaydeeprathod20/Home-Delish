require("dotenv").config();

const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo")(session);
const passport = require("passport");
const Emitter = require("events");
// const MongoDbStore = require("connect-mongo")(session);
const { connected } = require("process");
const { error } = require("console");
//Database connection
const url = "mongodb://127.0.0.1:27017/item";

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/item", { useNewUrlParser: true });

const connection = mongoose.connection;

//Session store
let mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: "sessions",
});
//Event emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);
// Session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,

    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 hours
    //   cookie: { maxAge: 1000 * 15 },//15 seconds
  })
);

//Passport config
const passportInit = require("./app/config/passport.js");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});
//set Template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//socket
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  //join
  console.log(socket.id);
  socket.on("join", (orderId) => {
    console.log(orderId);
    socket.join(orderId);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

eventEmitter.on("orderPlaced", (data) => {
  io.to("adminRoom").emit("orderPlaced", data);
});
