import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }
    const channel = await User.findById(channelId)
    if(!channel) {
        throw new ApiError(404, "Channel not found")
    }
    const isSubscribed = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })
    if(isSubscribed) {
        await Subscription.deleteOne({
            subscriber: req.user._id,
            channel: channelId
        })
        return res.status(200).json(
            new ApiResponse(200, {}, "Unsubscribed successfully")
        )
    }

    await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    })
    return res.status(200).json(
        new ApiResponse(200, {}, "Subscribed successfully")
    )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: get subscriber list of a channel
    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }
    const channel = await User.findById(channelId)
    if(!channel) {
        throw new ApiError(404, "Channel not found")
    }
    const subscribers = await Subscription.find({
        channel: channelId
    })
    if(!subscribers) {
        throw new ApiError(404, "No subscribers found")
    }
    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    // TODO: get channel list to which user has subscribed
    if(!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id")
    }
    const subscriber = await User.findById(subscriberId)
    if(!subscriber) {
        throw new ApiError(404, "Subscriber not found")
    }   
    const channels = await Subscription.find({
        subscriber: subscriberId
    }) 
    if(!channels) {
        throw new ApiError(404, "No channels found")
    }
    return res.status(200).json(
        new ApiResponse(200, channels, "Channels fetched successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}