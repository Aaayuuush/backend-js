import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const filter = {
        $and: [{
            isPublished: true,
            ...(query && {
                $or: [
                    {title: {$regex: query, $options: "i"}},
                    {description: {$regex: query, $options: "i"}}
                ]
            })
        }, ...(userId && {owner: new mongoose.Types.ObjectId(userId)})]
    }
    const sortFilter = {}
    if(sortBy && sortType) {
        sortFilter[sortBy] = sortType
    }

    const videos = await Video.find(filter)
        .sort(sortFilter)
        .skip((page - 1) * limit)
        .limit(limit)

    if(!videos) {
        throw new ApiError(404, "Videos not found")
    }
    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!title || !description) {
        throw new ApiError(400, "All fields are required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if(!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "All fields are required")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!video || !thumbnail) {
        throw new ApiError(500, "Something went wrong while uploading")
    }

    const videoDetails = await Video.create({
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        owner: req.user._id
    })

    if(!videoDetails) {
        throw new ApiError(500, "Something went wrong while publishing video")
    }
    return res.status(201).json(
        new ApiResponse(200, videoDetails, "Video published successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }
    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body
    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }
    if(video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(401, "Unauthorized")
    }
    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if(!videoLocalPath ||!thumbnailLocalPath) {
        throw new ApiError(400, "All fields are required")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!videoFile ||!thumbnail) {
        throw new ApiError(500, "Something went wrong while uploading")
    }

    const videoDetails = await Video.findByIdAndUpdate(videoId, {
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url
    }, {new: true})

    if(!videoDetails) {
        throw new ApiError(500, "Something went wrong while updating video")
    }
    return res.status(200).json(
        new ApiResponse(200, videoDetails, "Video updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")  
    }
    if(video.owner.toString()!== req.user._id.toString()) {
        throw new ApiError(401, "Unauthorized")
    }       
    await Video.findByIdAndDelete(videoId)  
    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle publish status
    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }
    if(video.owner.toString()!== req.user._id.toString()) {
        throw new ApiError(401, "Unauthorized")
    }
    const videoDetails = await Video.findByIdAndUpdate(videoId, {
        isPublished: !video.isPublished
    }, {new: true})
    if(!videoDetails) {
        throw new ApiError(500, "Something went wrong while toggling publish status")
    }
    return res.status(200).json(
        new ApiResponse(200, videoDetails, "Publish status toggled successfully")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}