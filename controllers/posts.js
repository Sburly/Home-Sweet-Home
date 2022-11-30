const Post = require("../models/post");
const Booking = require("../models/book");

module.exports.renderHome = async (req, res) => {
    const posts = await Post.find({}).populate("author");
    res.render("home", { posts });
};

module.exports.renderAdd = (req, res) => {
    res.render("add");
};

module.exports.addNew = async (req, res) => {
    const post = new Post(req.body);
    post.author = req.user._id;
    await post.save();
    req.flash("success", "You've succesfully created a new post!");
    res.redirect("/");
};

module.exports.renderShow = async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate("author")
        .populate("reviews");
    res.render("show", { post });
};

module.exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body);
    await post.save();
    res.redirect(`/${id}`);
};

module.exports.deletePost = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
};

module.exports.renderEdit = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render("edit", { post });
};

module.exports.book = async (req, res) => {
    const { id } = req.params;
    const book = new Booking(req.body);
    book.post = id;
    book.user = req.user._id;
    book.save();
    res.redirect(`/${id}`);
};