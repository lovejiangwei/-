<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-button type="success"  @click="openChapterDialog()">添加章节</el-button>
    <hr/>
     <el-tree
      :data="chapterVideoList"
      node-key="id"
      :props="defaultProps"
      :default-expand-all="true"
      :highlight-current="true"
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
    <br/>
    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="1" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" :disabled="chapterSave" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 小节弹框表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="1" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
           :on-success="handleVodUploadSuccess"
           :on-remove="handleVodRemove"
           :before-remove="beforeVodRemove"
           :on-error="error"
           :on-exceed="handleUploadExceed"
           :file-list="fileList"
           :action="BASE_API+'/eduvod/video/upload'"
           :limit="1"
           class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
                <div slot="content">最大支持1G，<br>
                    支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                    GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                    MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                    SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
      </el-form-item>
      </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
      <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
    </div>
  </el-dialog>
    
  </div>
</template>

<script>
import course from '@/api/course/course'
import chapter from '@/api/chapter/chapter'
import video from '@/api/chapter/video'
export default {
   data() {
    return {
      //章节===============================================================================
      chapter:{
        title: '',
        sort: 1
      },
      //环境里面的地址
      BASE_API:process.env.BASE_API,
      fileList: [],//视频文件列表
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '', // 所属课程
      chapterVideoList: [], // 章节嵌套课时列表
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      dialogChapterFormVisible:false,//弹框控制
      chapterSave: false, //添加章节按钮控制
      //===============================小节管理================================================
      //小节   课时对象
      video: {
        title: '',
        sort: 1,
        isFree: 0,
        videoSourceId: '',
        video_original_name: ''
      }, 
      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示课时表单
      chapterId: '', // 课时所在的章节id


    }
  },
  watch: {
    
  },
  mounted(){
      
  },
  created(){
    this.init()
  },
  methods: {
    init(){
      if(this.$route.params && this.$route.params.id){
        this.courseId = this.$route.params.id
        // 根据id获取课程基本信息
        this.fetchChapterNestedListByCourseId()
      }
    },
    fetchChapterNestedListByCourseId(){
        chapter.getChapterVideo(this.courseId).then(res =>{
            this.chapterVideoList = res.data.data
        })
    },
    //=============================小节信息=================================================
    //视频上传成功
    handleVodUploadSuccess(response, file, fileList){
      this.video.videoSourceId = response.data.data
      this.video.videoOriginalName = file.name;
          this.$message({
            type: 'success',
            message: '视频上传成功'
          })
    },
    //视频上传失败
    error(err, file, fileList){
      this.$message({
            type: 'error',
            message: '视频上传失败'
          })
    },
    //删除上传文件时钩子函数
    handleVodRemove(file, fileList){
      chapter.removeVideoById(this.video.videoSourceId).then(res =>{
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
        this.fileList = []
          this.$message({
            type: 'success',
            message: '视频删除成功'
          })
      })
    },
    //删除文件之前钩子函数
    beforeVodRemove(file, fileList){
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    //文件超出规定过数时候调用
    handleUploadExceed(){
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    //添加小节弹框
    openVideo(node, data) {
      this.chapterId = data.id
      this.dialogVideoFormVisible = true
      //清空表单
      this.video={
        title: '',
        sort: 1,
        isFree: 0,
        videoSourceId: '',
        video_original_name: ''
      }
      //清空文件列表
      this.fileList = []

    },
    //小节删除
    videoRemove(node, data) {
        this.$confirm('此操作将永久删除当前节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           video.deleteVideo(data.id).then(res =>{
             this.$message({
                type: 'success',
                message: '删除成功!'
              })
              //刷新页面
              this.fetchChapterNestedListByCourseId();
           })
        }).catch(() =>{})

    },
    //保存按钮
    saveOrUpdateVideo(){
        if(!this.video.id){
          this.saveVideo()
        }else{
          this.updateVideo()
        }
    },
    saveVideo(){
      this.video.courseId = this.courseId
      this.video.chapterId = this.chapterId
      this.saveVideoBtnDisabled = true
      video.addVideo(this.video).then(res =>{
        //关闭弹框
        this.dialogVideoFormVisible = false
        //提示信息
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.saveVideoBtnDisabled = false
        //刷新页面
        this.fetchChapterNestedListByCourseId();
      })
    },
    updateVideo(){
      this.saveVideoBtnDisabled = true
      //return
      video.updateVideo(this.video).then(res =>{
        //关闭弹框
        this.dialogVideoFormVisible = false
        //提示信息
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        //清空表单
        this.video={
          title: '',
          sort: 1,
          isFree: 0,
          videoSourceId: '',
          video_original_name: ''
        }
        this.saveVideoBtnDisabled = false
        //刷新页面
        this.fetchChapterNestedListByCourseId();
      })
    },
    //小节修改
    videoEdit(node, data){
        //打开弹框
        this.dialogVideoFormVisible = true
        video.getVideoById(data.id).then(res =>{
        this.video = res.data.data
        if(this.video.videoOriginalName =="" || this.video.videoOriginalName == null){
          this.fileList=[]
        }else{
           this.fileList = [{'name': this.video.videoOriginalName}]
        }  
      })

    },
    //============================章节信息============================================
    //章节修改
    chapterEdit(node, data){
      this.dialogChapterFormVisible = true
      chapter.getChapterById(data.id).then(res =>{
        this.chapter = res.data.data
        
      })

    },
    //章节删除
    chapterRemove(node, data) {
        this.$confirm('此操作将永久删除当前章节及其下面所有小节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           chapter.deleteChapter(data.id).then(res =>{
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              //刷新页面
              this.fetchChapterNestedListByCourseId();
           })
        }).catch(() =>{})

    },  
    //添加章节打开按钮
    openChapterDialog(){
      this.dialogChapterFormVisible = true
      this.chapter.title = ''
      this.chapter.sort = 1
    },
    //章节添加修改信息
    saveOrUpdate(){
      if(this.chapter.id){
        this.updateChapter()
      }else{
        this.saveChapter()
      }
    },
    saveChapter(){
      this.chapterSave = true
      this.chapter.courseId = this.courseId;
      chapter.addChapter(this.chapter).then(res =>{
        //关闭弹框
        this.dialogChapterFormVisible = false
        //提示信息
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.chapterSave = false
        //刷新页面
        this.fetchChapterNestedListByCourseId();
      })
    },
    updateChapter(){
      this.chapterSave = true
      chapter.updateChapter(this.chapter).then(res =>{
          //关闭弹框
        this.dialogChapterFormVisible = false
        //提示信息
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.chapterSave = false
        //置空对象
        this.chapter = {
          title: '',
          sort: 1
        }
        //刷新页面
        this.fetchChapterNestedListByCourseId();
      })
    },

    //树节点自定义渲染方法=====================================================================
    renderContent(h, { node, data, store }){
        if(data.level==0){
            //一级菜单
            return(<span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.openVideo(node,data) }>添加课时</el-button>
              <el-button size="mini" type="text" on-click={ () => this.chapterEdit(node,data) }>编辑</el-button>
              <el-button size="mini" type="text" on-click={ () => this.chapterRemove(node, data) }>删除</el-button>
            </span>
          </span>);
        }else{
             return(<span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.videoEdit(node,data) }>编辑</el-button>
              <el-button size="mini" type="text" on-click={ () => this.videoRemove(node, data) }>删除</el-button>
            </span>
          </span>);
        }
    },

    //===========页面跳转===================================================
    previous() {
      this.$router.push({ path: '/course/info/'+this.courseId })
    },
    next() {
      this.$router.push({ path: '/course/publish/'+ this.courseId})
    },
  }
 
}
</script>

<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>