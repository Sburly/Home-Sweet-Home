const { postSchema } = require("./schemas");

module.exports.validatePost = (req, res, next) => {
    const { err } = postSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(i => i.message).join(",");
    } else {
        next();
    };
};