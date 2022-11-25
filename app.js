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
app.get("/", async (req, res) => {
    const posts = await Post.find({});
    res.render("home", { posts });
});

app.get("/post", (req, res) => {
    res.render("add");
});

app.post("/post", async (req, res) => {
    const post = new Post(req.body);
    await post.save();
    res.redirect("/");
});

app.get("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render("show", { post });
});

app.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body);
    await post.save();
    res.redirect(`/${id}`);
});

app.get("/:id/edit", async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render("edit", { post });
});

app.delete("/:id", async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

// App Listening
app.listen(port, () => {
    console.log("http://localhost:" + port);
});