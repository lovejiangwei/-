import request from '@/utils/request'

export default {
    //获取所有讲师
    findAll(){
        return request({
            url: '/eduservice/teacher/findAll',
            method: 'get'
          })
    },
    //条件分页讲师查询
    getTeacherListPage(current,limit,teacherQuery){
        return request({
            url: `/eduservice/teacher/pageTeacher/${current}/${limit}`,
            method: 'post',
            data:teacherQuery
          })
    },
    //删除讲师  逻辑删除
    deleteTeacherById(id){
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete',
          })
    },
    //添加讲师
    addTeacher(teacher){
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: 'post',
            data:teacher
          })
    },
    //根据id查询讲师
    getTeacherById(id){
        return request({
            url: `/eduservice/teacher/getTeacherById/${id}`,
            method: 'get'
          })
    },
    //修改讲师
    updateTeacher(teacher){
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: 'post',
            data: teacher
          })
    }
  
}