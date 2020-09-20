<template>
  <div class="app-container">
      <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-form label-width="120px">
    <el-form-item label="课程标题">
        <el-input ref="titleInput" v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
    </el-form-item>

    <!-- 所属分类 TODO -->
    <el-form-item label="课程分类">
    <el-select
        v-model="courseInfo.subjectParentId"
        placeholder="所属大类" filterable @change="oneChange">
        <el-option
        v-for="subject in subjectNestedList"
        :key="subject.id"
        :label="subject.title"
        :value="subject.id"/>
    </el-select>

    <el-select
        v-model="courseInfo.subjectId"
        placeholder="所属小类" filterable >
        <el-option
        v-for="subject in subSubjectList"
        :key="subject.id"
        :label="subject.title"
        :value="subject.id"/>
    </el-select>
    </el-form-item>


    <el-form-item label="课程讲师">
    <el-select
        v-model="courseInfo.teacherId"
        placeholder="请选择" filterable >
        <el-option
        v-for="teacher in teacherList"
        :key="teacher.id"
        :label="teacher.name"
        :value="teacher.id"/>
    </el-select>
    </el-form-item>
    <el-form-item label="总课时">
        <el-input-number ref="timeInput" :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
    </el-form-item>

    <el-form-item label="课程简介">
         <tinymce :height="300" v-model="courseInfo.description" ref="content"/>
    </el-form-item>
    <!-- 封面 TODO -->
    <el-form-item label="课程封面">
        <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            list-type="picture"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/eduoss/fileoss/uploadefile'"
            class="avatar-uploader">
            <img v-if="courseInfo.cover" :src="courseInfo.cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </el-form-item>

    <el-form-item label="价格">
        <el-input-number ref="numberInput" :min="0" v-model="courseInfo.price" :precision="2" :step="0.1" controls-position="right" placeholder="免费课程请设置为0元"/> 元
    </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import teacher from '@/api/teacher/teacher'
import subject from '@/api/subject/subject'
import course from '@/api/course/course'
import Tinymce from '@/components/Tinymce'
export default {
   components: {Tinymce},
   data() {
    return {
        courseInfo:{
            title: '',
            subjectParentId:"",  //一级分类id
            subjectId: '',  //二级分类id
            teacherId: '',
            lessonNum: 0,
            description: "",
            cover:"",
            price: 0
        },
        //环境里面的地址
        BASE_API:process.env.BASE_API,
        teacherList: [], // 讲师列表
        subjectNestedList: [],//一级分类列表
        subSubjectList: [],//二级分类列表
        saveBtnDisabled: false, // 保存按钮是否禁用
        courseId:""
      
    }
  },
  watch: {
    //路由变化方式  当路由发生变化就会执行
      $route(to, from){
        this.init()
        this.$nextTick(function(){  //页面加载完成后执行
          if(!this.$route.params.id){
              this.$refs.content.setContent("")
          }
        })
      }
  },
  created(){
    this.init()
  },
  mounted(){
      this.inputInit();
       
  },
  methods: {
      init(){
        if(this.$route.params && this.$route.params.id){
            this.courseId = this.$route.params.id
            this.initTeacherList() //初始化老师下拉列表
            this.infoInit() //数据回显
        }else{
            //增加操作
            this.initTeacherList() //初始化老师下拉列表
            this.initSubject() //初始化一级菜单下拉列表
            //初始化数据
            this.courseInfo={
                title: '',
                subjectParentId:"",  //一级分类id
                subjectId: '',  //二级分类id
                teacherId: '',
                lessonNum: 0,
                description: "",
                cover:"",
                price: 0
            }
          
           
        }
      },
      infoInit(){
        course.getCourseInfoById(this.courseId).then(res =>{
            this.courseInfo = res.data.data
            //下拉列表回显
            subject.findAll().then(res =>{
              //获取所有一级分类赋值给一级分类的数组
              this.subjectNestedList = res.data.data
              for (let i = 0; i < this.subjectNestedList.length; i++) {
                let temp = this.subjectNestedList[i];
                if(temp.id == this.courseInfo.subjectParentId){
                    this.subSubjectList = temp.children
                    break
                }
              }
          })

        })
      },
      inputInit(){
            this.$refs.numberInput.focus();
            this.$refs.timeInput.focus();
            this.$refs.titleInput.focus(); 
      },
      initTeacherList(){
          teacher.findAll().then(res =>{
              this.teacherList = res.data.items
          })
      },
      initSubject(){
          subject.findAll().then(res =>{
              this.subjectNestedList = res.data.data
          })
      },
      oneChange(value){
        for (let index = 0; index < this.subjectNestedList.length; index++) {
            if(this.subjectNestedList[index].id == value){
                this.subSubjectList = this.subjectNestedList[index].children
                this.courseInfo.subjectId = ""
                break
            }  
        }
      },
      handleAvatarSuccess(res,file){
        this.courseInfo.cover=res.data.url 
      },
      beforeAvatarUpload(file){
           const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
      },
    addCourseInfo(){
        course.addCourseInfo(this.courseInfo).then(response =>{
              this.$message({
                    type: 'success',
                    message: '保存成功!'
                })
                this.$router.push({ path: '/course/chapter/'+response.data.data })
          })
    },
    updateCourseInfo(){
          course.updateCourse(this.courseInfo).then(response =>{
              this.$message({
                    type: 'success',
                    message: '修改成功!'
                })
                this.$router.push({ path: '/course/chapter/'+this.courseId })
          })
    },
    saveOrUpdate() {
        if(!this.courseInfo.id){
            this.addCourseInfo()
        }else(
            this.updateCourseInfo()
        )
      
    }
  }
 
}
</script>

<style scoped>
 .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .tinymce-container {
  line-height: 29px;
}
</style>