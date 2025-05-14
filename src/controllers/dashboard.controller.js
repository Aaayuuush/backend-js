import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
     const {channelId} = req.params
     if(!isValidObjectId(channelId)) {
         throw new ApiError(400, "Invalid channel id")
     }

     const channel = await User.findById(channelId)
     if(!channel) {
         throw new ApiError(404, "Channel not found")
     }

     const channelVideos = await Video.find({owner: channelId})
     if(!channelVideos) {
         throw new ApiError(404, "No videos found")
     }

     const channelSubscribers = await Subscription.find({channel: channelId})
     if(!channelSubscribers) {
         throw new ApiError(404, "No subscribers found")
     }

     const channelLikes = await Like.find({video: {$in: channelVideos.map(video => video._id)}})
     if(!channelLikes) {
         throw new ApiError(404, "No likes found")
     }

     const channelStats = {
         totalVideos: channelVideos.length,
         totalSubscribers: channelSubscribers.length,
         totalLikes: channelLikes.length,
         totalViews: channelVideos.reduce((acc, video) => acc + video.views, 0)
     }

    return res.status(200).json(
        new ApiResponse(200, {}, "Channel stats fetched successfully")
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId} = req.params
    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const channel = await User.findById(channelId)
    if(!channel) {
        throw new ApiError(404, "Channel not found")
    }

    const channelVideos = await Video.find({owner: channelId})
    if(!channelVideos) {
        throw new ApiError(404, "No videos found")
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Channel videos fetched successfully")
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }