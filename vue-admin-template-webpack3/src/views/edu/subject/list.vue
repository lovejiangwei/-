<template>
  <div class="app-container">
    <el-input placeholder="输入关键字搜索" v-model="filterText" style="margin-bottom:30px;"></el-input>

    <el-tree class="filter-tree" 
      :data="data2" :props="defaultProps" 
      default-expand-all 
      :filter-node-method="filterNode" 
      ref="tree2">
    </el-tree>

  </div>
</template>

<script>
import subject from '@/api/subject/subject'
export default {
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created(){
    this.init();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    init(){
      subject.findAll().then((res)=>{
          this.data2 = res.data.data;
      })
    },
  },

  data() {
    return {
      filterText: '',
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  }
}
</script>

