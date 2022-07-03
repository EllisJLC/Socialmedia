import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema;

const postSchema = new mongoose.Schema(
    {
        content: {
            type: {}, // using empty {} means any type of data
            required: true, // posts require content
        },
        postedBy: {
            type: ObjectId, // uses user data to state owner of post
            ref: "User",
        },
        image: {
            url: String, // store images into a url uploaded to a image saving service, saves space on db.
            public_id: String,
        },
        likes: [{type: ObjectId, ref: "User"}],
        comments: [
            {
                text: String,
                created: {type: Date, default:Date.now}, // get current date with Date.now, mongoose onlyl
                postedBy: {
                    type: ObjectId,
                    ref: "User",
                },
            },
        ],
    },
    {timestamps: true}
);

export default mongoose.model("Post", postSchema);