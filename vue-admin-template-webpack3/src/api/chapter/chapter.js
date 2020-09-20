import request from '@/utils/request'

export default {
    //get tree chapter and video by chapterid
    getChapterVideo(id){
        return request({
            url: `/eduservice/chapter/getChapterVideo/${id}`,
            method: 'get'
        })
    },
    //delete chapter
    deleteChapter(id){
        return request({
            url: `/eduservice/chapter/deleteChapter/${id}`,
            method: 'delete'
        })
    },
    //update chapter
    updateChapter(chapter){
        return request({
            url: `/eduservice/chapter/updateChapter`,
            method: 'post',
            data: chapter
        })
    },
    //info
    getChapterById(id){
        return request({
            url: `/eduservice/chapter/getChapterById/${id}`,
            method: 'get'
        })
    },
    //add chapter
    addChapter(chapter){
        return request({
            url: `/eduservice/chapter/addChapter`,
            method: 'post',
            data: chapter
        })
    },
 
  
}