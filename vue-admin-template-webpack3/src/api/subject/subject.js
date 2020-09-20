import request from '@/utils/request'

export default {
    //
    findAll(){
        return request({
            url: '/eduservice/subject/getList',
            method: 'get'
          });
    },
 
  
}