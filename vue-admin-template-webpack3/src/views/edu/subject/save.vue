<template>
  <div class="app-container">
      <el-form label-width="120px"  >
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="excelUrl">点击下载模版</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :before-upload="beforeUpload"
          :disabled="importBtnDisabled"
          :on-change="change"
          :limit="1"
          :action="BASE_API+'/eduservice/subject/addSubject'"
          name="file"
          accept=".xls , .xlsx">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload()">{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import subject from '@/api/subject/subject'
export default {
  data() {
    return {
        list:[], //返回数据
        excelUrl:process.env.EXCEL_TEMPLATE,
        BASE_API: process.env.BASE_API, // 接口API地址
        fileUploadBtnText: '上传到服务器', // 按钮文字
        importBtnDisabled: false, // 按钮是否禁用,
        loading: false,
    }
    
  },
  created(){
     
  },
  methods: {
      
      submitUpload(){
         if(typeof this.$refs.upload.uploadFiles[0] === "undefined" || typeof this.$refs.upload.uploadFiles[0] === undefined){
           //没有文件
           this.$message({
            type: 'error',
            message: '请选择一个要上传的文件！'
            })
            return
         }
         this.fileUploadBtnText = '正在上传'
         this.importBtnDisabled = true
         this.loading = true
         this.$refs.upload.submit()
        
      },
      fileUploadSuccess(response){
        console.log(response);
        if (response.success === true) {
          this.fileUploadBtnText = '导入成功'
          this.loading = false
          this.$message({
              type: 'success',
              message: "添加课程分类成功"
          })
          this.importBtnDisabled = true
          this.$router.push({path:'/subject/list'});
        }else{
            this.importBtnDisabled = false
            this.loading = false
            this.fileUploadBtnText = '格式不对，重新选择文件'
            this.$message({
              type: 'error',
              message: response.message
          })
          this.$refs.upload.clearFiles();
        }    
    },
      fileUploadError(){
        this.fileUploadBtnText = '导入失败'
        this.loading = false
        this.$message({
        type: 'error',
        message: '导入失败'
        })
        this.importBtnDisabled = false
        this.$refs.upload.clearFiles();
    },
    beforeUpload(file){
        let fileName=file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = fileName === 'xls'
            const extension2 = fileName=== 'xlsx'
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是 xls、xlsx格式!',
                    type: 'warning'
                });
                this.fileUploadBtnText = '格式不对，重新选择文件'
                this.loading = false
                this.importBtnDisabled = false
                return false;
            }
    },
    change(file, fileList){
      this.fileUploadBtnText = '上传到服务器'
    },
    
  }
}
</script>

<style scoped>


</style>

