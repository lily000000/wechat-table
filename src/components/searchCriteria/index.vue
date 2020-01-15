<template>
  <div>
    <div class="head-right">
      <div class="channel-wrap" style="margin-right: 10px;">
        <label>教研：</label>
        <el-select v-model="params.userIds" filterable multiple placeholder="请选择" collapse-tags>
          <el-option
            v-for="item in optionsTest"
            :key="item.id"
            :label="item.realName"
            :value="item.id"
            @change="onPartner"
          ></el-option>
        </el-select>
      </div>
      <div class="channel-wrap" style="margin-right: 10px;">
        <label>工单优先级：</label>
        <el-select v-model="params.isUrgency" placeholder="请选择" style="width:80px">
          <el-option label="全部" value="2"></el-option>
          <el-option label="紧急" value="1"></el-option>
          <el-option label="普通" value="0"></el-option>
        </el-select>
      </div>
      <div class="channel-wrap" style="margin-right: 10px">
        <time-controls ref="refChild"></time-controls>
      </div>
      <div style="display: inline-block;margin-left:10px">
        <el-button
          @click="search"
          type="primary"
          icon="el-icon-search"
          style="position: relative;bottom:1px;"
        >搜索</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import timeControls from "components/timeControls/areaTime/index.vue";
export default {
    components: {
        timeControls
    },
    data(){
        return{
            params:{
                userIds:'',
                isUrgency:''


            }
            
        }
    }
    
}
</script>