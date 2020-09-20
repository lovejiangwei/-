<template>
  <div class="app-container">
    <el-form label-width="120px" :model="teacher" :rules="rules" ref="teacher">
      <el-form-item label="讲师名称" prop="name">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序" prop="sort">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="1" ></el-input-number>
      </el-form-item>
      <el-form-item label="讲师头衔" prop="level">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历" prop="career">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介" prop="intro">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>
        <!--
            v-show：是否显示上传组件
            :key：类似于id，如果一个页面多个图片上传控件，可以做区分
            :url：后台上传的url地址
            @close：关闭上传组件
            @crop-upload-success：上传成功后的回调 
        -->
        <image-cropper v-show="imagecropperShow" :width="100" :height="100"
                    :key="imagecropperKey"
                    :url="BASE_API+'/eduoss/fileoss/uploadefile'"
                    field="file"
                    @close="close"
                    @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate('teacher')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from '@/api/teacher/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
    components:{ImageCropper , PanThumb },
  data() {
    return {
        teacher:{
            name: '',
            sort: 1,
            level: 1,
            career: '',
            intro: '',
            avatar: 'https://edu-jiangwei.oss-cn-beijing.aliyuncs.com/2020-09-10/a09803ecaaf740bc9237b58a9b65efbcz.jpg',
        },
        saveBtnDisabled:false,
        //是否显示上传图片组件
        imagecropperShow:false,
        //图片唯一标识  id
        imagecropperKey:0,
        //环境里面的地址
        BASE_API:process.env.BASE_API,
            rules: {
          name: [
            { required: true, message: '请输入讲师名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '请选择讲师排序', trigger: 'change' }
          ],
          level: [
            {  required: true, message: '请选择讲师头衔', trigger: 'change' }
          ],
          career: [
            {  required: true, message: '输入讲师资历', trigger: 'blur' }
          ],
          intro: [
            { required: true, message: '输入讲师简介', trigger: 'blur' }
          ]
        }
      
    }
  },
  created(){
      this.init()
  },
  watch:{
      //路由变化方式  当路由发生变化就会执行
      $route(to, from){
        this.init()
      }
  },
  methods: {
      init(){
        //判断路径中时候有id参数
        if(this.$route.params && this.$route.params.id){
            const id = this.$route.params.id
            this.getTeacherById(id)
        }else{
            this.teacher ={
                name: '',
                sort: 0,
                level: 1,
                career: '',
                intro: '',
                avatar:'https://edu-jiangwei.oss-cn-beijing.aliyuncs.com/2020-09-10/a09803ecaaf740bc9237b58a9b65efbcz.jpg'
            }
        }
      },
      saveOrUpdate(formName){
          if(!this.teacher.id){
             this.saveTeacher(formName)
          }else{
              this.updateTeacher()
          }
      },
      saveTeacher(formName){
          this.$refs[formName].validate((valid) => {
          if (valid) {
                this.saveBtnDisabled= true
                teacher.addTeacher(this.teacher).then(response =>{
                    this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                    //返回列表
                    this.$router.push({path:'/teacher/table'})
                })
          } else {
            return false;
          }
          
        });
        
      },
      getTeacherById(id){
        teacher.getTeacherById(id).then(response =>{
            this.teacher=response.data.teacher
        })
      },
      updateTeacher(){
          this.saveBtnDisabled= true
          teacher.updateTeacher(this.teacher)
            .then(response =>{
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                });
                //返回列表
                this.$router.push({path:'/teacher/table'})
            })
      },
      close(){
          //关闭上传弹框
          this.imagecropperShow=false;
          //第一次上传成功后不能第二次上传  每次把唯一标识+1  从新初始化一次组件
          this.imagecropperKey = this.imagecropperKey+1;
      },
      cropSuccess(data){
          //上传完毕回调方法
          this.teacher.avatar = data.url; 
          this.imagecropperShow=false;
          this.imagecropperKey = this.imagecropperKey+1;
      },
      
  }
}
</script>

<style scoped>

</style>

