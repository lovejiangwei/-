import request from '@/utils/request'

export default {
    //获取课程基本信息
    getCoursePublishInfoById(id) {
        return request({
            url: `/eduservice/course/publish/${id}`,
            method: 'get'
        })
    },
    //发布课程
    publishCourse(id) {
        return request({
            url: `/eduservice/course/publish/${id}`,
            method: 'put'
            })
    }
}


