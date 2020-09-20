import request from '@/utils/request'

export default {
    addCourseInfo(courseInfo){
        return request({
            url: '/eduservice/course/addCourseInfo',
            method: 'post',
            data: courseInfo
        })
    },
    getCourseInfoById(courseId){
        return request({
            url: `/eduservice/course/getCourseInfo/${courseId}`,
            method: 'get'
        })
    },
    updateCourse(courseInfo){
        return request({
            url: '/eduservice/course/updateCourse',
            method: 'post',
            data: courseInfo
        })
    },
    //分页获取课程
    getPageList(page, limit, searchObj) {
        return request({
            url: `/eduservice/course/getCourseList/${page}/${limit}`,
            method: 'post',
            data: searchObj
        })
    },
    //删除课程
    deleteCourseById(id){
        return request({
            url: `/eduservice/course/${id}`,
            method: 'delete'
        })
    }
 
  
}