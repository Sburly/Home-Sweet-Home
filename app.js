// Requirements
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require("ejs-locals");
const bodyParser = require('body-parser');
const mongoSanitize = require("express-mongo-sanitize");

// Imports
const Post = require("./models/post");
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/ExpressError");

// Express App Settings
const app = express();
let port = 5000;
app.set('view engine', 'ejs');
app.engine("ejs", engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDatabase Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Database connected"));
app.use(mongoSanitize({ replaceWith: "_" }));

// Routes
app.get("/", catchAsync(async (req, res) => {
    const posts = await Post.find({});
    res.render("home", { posts });
}));

app.get("/post", (req, res) => {
    res.render("add");
});

app.post("/post", catchAsync(async (req, res) => {
    const post = new Post(req.body);
    await post.save();
    res.redirect("/");
}));

app.get("/:id", catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render("show", { post });
}));

app.patch("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body);
    await post.save();
    res.redirect(`/${id}`);
}));

app.delete("/:id", catchAsync(async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
}));

app.get("/:id/edit", catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render("edit", { post });
}));

app.all("*", (req, res, next) => {
    const error = new ExpressError("Page Not found", 404)
    next(error);
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no! Something went wrong";
    res.status(statusCode).render("error", { err });
});

// App Listening
app.listen(port, () => {
    console.log("http://localhost:" + port);
});