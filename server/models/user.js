import mongoose from 'mongoose';

const {Schema} = mongoose;

const userSchema = new Schema( {
    name : {
        type: String,
        trim: true,
        required: true,
    },
    email : {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 30,
    },
    security: {
        type: String,
        required: true,
        lowercase: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    about : {},
    image : {
        url: String,
        public_id: String,
    },
    role: {
        type: String,
        default: "subscriber",
    },
    following: [{type: Schema.ObjectId, ref: "User"}],//using mongoose schema with unique Id's
    followers: [{type: Schema.ObjectId, ref: "User"}], 
}, 
{timestamps: true}
);

export default mongoose.model('User', userSchema);