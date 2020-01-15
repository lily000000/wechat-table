<template>
  <div class="box">
    <!-- <p class="box-tit">微信聊天记录详情</p> -->
    <el-card class="box-card">
      <div v-for="o in chartData" :key="o" class="text item" @click="goChatRecord">{{ o.name+'聊天详情' }}</div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
        chartData:[{
            name:'鱼sir1'
        },{
            name:'鱼sir2'
        },{
            name:'鱼sir3'
        },{
            name:'鱼sir4'
        },{
            name:'鱼sir4'
        }]

    };
  },
  methods:{
      //进入聊天记录
      goChatRecord(){
        this.$router.push({
            path: "/chatDetail",
            query: { typeId: 3}
        });
      }
  }
};
</script>
<style scoped lang="scss" >
@import "./style.scss";
</style>