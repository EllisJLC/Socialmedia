import User from '../models/user';
import { hashPassword, comparePassword } from '../helpers/auth';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

export const register = async (req, res) => {
    //console.log('register endpoint =>', req.body);
    const {name, email, password, security} = req.body;
    // validation
    if (!name) {
        return res.json({
            error: "Please enter a name.",
        });
    }

    if (!password || password.length<6){
        return res.json({
            error: "Please enter a password that is at least 6 characters long.",
        });
    }

    if (!security) {
        return res.json({
            error: "Please enter an answer for your security question.",
        });
    }

    const existing = await User.findOne({ email });
        if (existing) {
            return res.json ({
                error: "Email has been taken.",
            })
        }
    const hashedPassword = await hashPassword(password);
    const user = new User ({
        name, 
        email, 
        password:hashedPassword, 
        security, 
        username:nanoid(6),
    });

    try {
        await user.save();
        // console.log('saved!', user);
        return res.json({ok:true,})
    }
    catch (error) {
        console.log('registration error =>', error);
        return res.status(400).send('Registration error, try again.');
    };
};

export const login = async (req, res) => {
    // login process, sends input into server, need to limit routes to logged in user.
    try {
        const {email, password} = req.body;
        //check if database has user with the email
        const user=await User.findOne({ email });
        if (!user) {
            return res.json ({
                error: "This user does not exist.",
            })
        }
        // check password
        const match = await comparePassword(password, user.password);
        if(!match) {
            return res.json({
                error: "wrong password!",
            });
        }
        // create signed token
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn:'10d'
            //need JWT to generate token, expiresIn can be blank for ms, 's' for s, d, and h.
        });
        user.password=undefined;
        user.security=undefined;
        res.json({
            token,
            user,
        });
    } catch (error) {
        console.log(error)
        return res.status(400).send('error. try again');
    }
};


export const currentUser = async(req,res) => {
    try {
        const user = await User.findById(req.user._id);
        // res.json(user); // shows user info
        res.json({ok:true}); //confirms success, but hides data
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
    // token in headers with POSTMAN (will change to react)
    // verify token with expressJwt (create middleware)
    // if verified, get user id from token to create signed token
    // use id to find user in db
    // send successful response if found
}

export const forgotPassword = async (req,res) => {
    //console.log(req.body);
    const {email, newPassword, security} = req.body;
    //validation
    if(!newPassword || !newPassword < 6) {
        return res.json ({
            error:"Please enter a valid new password.",
        });
    }
    if (!security) {
        return res.json ({
            error: "Please answer your security question.",
        });
    }
    const user = await User.findOne({email, security});
    if (!user) {
        return res.json ({
            error: "Cannot match the email to the security password. Please try again.",
        });
    }
    try {
        const hashed = await hashPassword(newPassword);
        await User.findByIdAndUpdate(user._id, {password: hashed});
        return res.json({
            success: "Your password has been changed!"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            error: "Encountered an error, please try again.",
        })
    }
}

export const profileUpdate = async(req,res) => {
    try {
        // console.log("profile update req.body", req.body)
        const data = {};

        if (req.body.username) {
            data.username = req.body.username;
        }
        if (req.body.about) {
            data.about = req.body.about;
        }
        if (req.body.name) {
            data.name = req.body.name;
        }
        if (req.body.password ) {
            if (req.body.password.length <6 ) {
                return res.json( {
                    error: 'Password needs to be at least 6 characters long.'
                })
            }
            else {
            data.password = await hashPassword(req.body.password);
            }
        }
        if (req.body.security) {
            data.security = req.body.security;
        }
        if (req.body.image) {
            data.image = req.body.image;
        }

        let user = await User.findByIdAndUpdate(req.user._id, data, {new:true});
        // console.log('updated user', user)
        user.password=undefined;
        user.security=undefined;
        res.json(user);

    } catch (error) {
        if (error.code == 11000) {
            return res.json({error: "username is already taken"})
        }
        console.log(error)
    }
}

export const findPeople = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        // user's following list to avoid when showing suggestions
        let following = user.following;
        following.push(user._id);
        // following.push(user._id); //adds user themself to the list to avoid suggesting, only works if _id is not in format ObjectId
        const people = await User.find(
            {_id:{$nin: following}})
            .select("-password -secret")
            .limit(5); // $nin = not including
        res.json(people);
    } catch (error) {
        console.log(error)
    }
}

// addFollower, userFollow
export const addFollower = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.body._id, {
            $addToSet: {followers: req.user._id},
        });
        next();
    } catch (error) {
        console.log(error);
    }
};

export const userFollow = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id, 
            {
                $addToSet: {following: req.body._id},
            }, 
            {new: true}
        ).select('-password -security');
        res.json(user);
    } catch (error) {
        console.log(error);
    }
};

export const userFollowing = async (req,res) => {
    try {
        const user = await User.findById(req.user._id);
        const following = await User.find({_id: user.following }).limit(100); 
        res.json(following);
    } catch (error) {
        console.log(error);
    }
};


// middleware
export const removeFollower = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.body._id, {
            $pull: {followers: req.user._id} //$pull removes from the set
        });
        next();
    } catch (error) {
        console.log(error);
    }
};

export const userUnfollow = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id, 
            {
                $pull: {following: req.body._id},
            },
            {new: true},
        );
        res.json(user);
    } catch (error) {
        console.log(error);
    }
};

export const searchUser = async (req, res) => {
    const {query} = req.params
    if(!query) return;
    try {
        const user = await User.find({
            $or: [
                {name : {
                    $ne: req.user,
                    $regex: query, // i mod makes it case insensitive
                    $options: 'i',
                }},
                // {username : {
                //     $regex: query,
                //     $options: 'i',
                // }},
            ]
        }, ).select('-password -security'); //use -item to exclude
        res.json(user);
    } catch (error) {
        console.log(error);
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username}).select (
            '-password -security'
        );
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}