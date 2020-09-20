import request from '@/utils/request'

export default {
    //insert video
    addVideo(video){
        return request({
            url: `/eduservice/video/addVideo`,
            method: "post",
            data: video
        })
    },
    //get one video data
    getVideoById(videoId){
        return request({
            url: `/eduservice/video/getVideoById/${videoId}`,
            method: "get"
        })
    },
    //update Video
    updateVideo(video){
        return request({
            url: `/eduservice/video/updateVideo`,
            method: "post",
            data: video
        })
    },
    //delete one Video
    deleteVideo(videoId){
        return request({
            url: `/eduservice/video/deleteVideo/${videoId}`,
            method: 'delete'
        })
    },
}