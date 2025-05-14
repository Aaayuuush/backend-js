import mongoose, {Schema} from "mongoose";
const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export const Playlist = mongoose.model("Playlist", playlistSchema)