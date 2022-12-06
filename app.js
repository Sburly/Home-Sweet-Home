// Requirements
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require("ejs-locals");
const bodyParser = require('body-parser');
const mongoSanitize = require("express-mongo-sanitize");
const session = require("express-session");
const MongoDBStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Imports
const ExpressError = require("./utilities/ExpressError");
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");
const reviewsRoutes = require("./routes/reviews");
const User = require("./models/user");
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

// Mongo Session
const store = MongoDBStore.create({
    mongoUrl: process.env.MONGODB_URI,
    secret: process.env.SECRET_KEY,
    touchAfter: 24 * 3600
});
store.on("error", function(){ 
    console.log("Store Error", e);
});
const sessionConfig = {
    store,
    name: "session",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (1000 * 360 * 24 * 7),
        maxAge: Date.now() + (1000 * 360 * 24 * 7),
        httpOnly: true
    }
};
app.use(session(sessionConfig));

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash
app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use(async (req, res, next) => {
    if(req.user) {
        const user = await User.findById(req.user._id);
        let fav = [];
        for(let j of user.favourites) fav.push(j.toString());
        for(let i of fav) {
            const doesPostExist = await Post.exists({_id : i});
            if(!doesPostExist) fav = fav.filter(m => { return m !== i });
        };
        if(req.session.modifications) {
            for(let i of req.session.modifications) {
                if(i[1] === true) {
                    if(!user.favourites.includes(i[0])) fav.push(i[0]);
                } else if(i[1] === false) {
                    if(user.favourites.includes(i[0])) fav = fav.filter(m => { return m !== i[0] });
                };
            };
        };
        req.session.modifications = [];
        req.session.save();
        user.favourites = fav;
        await user.save();
        fav = [];
    };
    next();
});

// Routes
app.use("/", usersRoutes);
app.use("/:id/reviews", reviewsRoutes);
app.use("/", postsRoutes);

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