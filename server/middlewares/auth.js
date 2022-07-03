import expressJwt from 'express-jwt';
import User from '../models/user';
import Post from '../models/post';

export const requireSignin = expressJwt ({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
})

export const canEditDeletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params._id);
        // console.log('post in editdelete middleware =>', post);
        if (req.user._id != post.postedBy) { //don't need triple = signs, as that is much more rigid and may cause complications
            return res.status(400).send('Unauthorized!');
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
    }
};

export const isAdmin = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if(user.role !== 'admin') {
            return res.status(400).send('unauthorized');
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
    }
};