import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const like = await Like.create({
        video: videoId,
        user: req.user._id
    })

    if(!like) {
        throw new ApiError(500, "Something went wrong while liking the video")
    }

    return res.status(200).json(
        new ApiResponse(200, like, "Video liked successfully")
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const like = await Like.create({
        Comment: commentId,
        user: req.user._id
    })
    if(!like) {
        throw new ApiError(500, "Something went wrong while liking the comment")
    }

    return res.status(200).json(
        new ApiResponse(200, like, "Comment liked successfully")
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const like = await Like.create({
        tweet: tweetId,
        user: req.user._id  
    })
    if(!like) {
        throw new ApiError(500, "Something went wrong while liking the tweet")
    }

    return res.status(200).json(
        new ApiResponse(200, like, "Tweet liked successfully")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.find({user: req.user._id})
    if(!likedVideos) {
        throw new ApiError(404, "No liked videos found")
    }

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}