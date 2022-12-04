const Post = require("../models/post");
const User = require("../models/user");
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
    const user = await User.findById(req.user._id);
    user.posts.push(post._id);
    await user.save();
    req.flash("success", "You've succesfully created a new post!");
    res.redirect("/");
};

module.exports.renderShow = async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate("author")
        .populate("reviews");
    const user = await User.findById(req.user._id);
    res.render("show", { post, user });
};

module.exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body);
    await post.save();
    res.redirect(`/${id}`);
};

module.exports.deletePost = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user._id, { $pull: { posts: req.params.id } });
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

module.exports.renderYourPlaces = async (req, res) => {
    const user = await User.findById(req.user._id).populate("posts");
    const posts = user.posts;
    res.render("places", { posts });
};

module.exports.renderFavourites = async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate("favourites");
    const postsTemp = user.favourites;
    let posts = [];
    for(let post of postsTemp) {
        const p = await post.populate("author");
        posts.push(p);
    }
    res.render("favourites", { posts });
};

module.exports.addFavourite = (req, res) => {
    let newArray = [];
    for(let i of req.session.modifications) {
        if(i[0] != req.body.id) newArray.push(i);
    };
    newArray.push([req.body.id, req.body.isFavourite]);
    req.session.modifications = newArray;
    req.session.save();
    return true;
};