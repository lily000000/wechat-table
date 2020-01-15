<template>
  <div class="conditions_wrap">
    <el-select v-model="params.groupType" @change="onChangeTypes">
      <el-option label="全部" value></el-option>
      <el-option label="机构社群" value="1"></el-option>
      <el-option label="会员社群" value="2"></el-option>
    </el-select>
    <el-select v-model="groupsCollection" style="width:250px" multiple collapse-tags clearable filterable @change="onChange" >
      <el-option
        v-for="item in groupNameData"
        :label="item.groupName"
        :value="item.groupName"
        :key="item.id"   
      ></el-option>
    </el-select>
    <area-timeFilter ref="refChild"></area-timeFilter>
  </div>
</template>
<script>
import Cookie from "@/utils/cookie";
import areaTime from "components/timeControls/areaTime/index";
import growTimes from "components/timeControls/growTimes/index";
import areaTimeFilter from "components/timeControls/areaTimeFilter/index";
export default {
  components: {
    areaTime,
    growTimes,
    areaTimeFilter,
  },
  props: {
    timeFilter: {
      type: Boolean
    },
    dateCycle:{
      type: String
    }
   
  },
  data() {
    return {
      groupNameData: [],
      groupsCollection:"",
      params: {
        groups: [],
        groupType: "",
      }
    };
  },
  mounted() {
    // this.getGroupContact(this.params.groupName);
    this.getGroupContact(this.params.groupType);
    this.params = Object.assign(
      this.params,
      this.$refs.refChild.changeParams()
    );
  },
  methods: {
    onChange(e){
      this.params.groups = e;
    },
    changeParams() {
      return Object.assign(
        this.params,
        this.$refs.refChild.changeParams()
      );
    },
    onChangeTypes(e) {
      this.groupsCollection = "";
      this.getGroupContact(e);
    },
    //根据类型获取群组
    getGroupContact(e) {
      const params = {
        type: e
      };
      this.$API.getGroupList(params).then(res => {
        // console.log(res);
        const { status, data, msg } = res;
        if (status == 200) {
          this.groupNameData = data;
        }
      });
    }
  }
};
</script>
<style scoped>
.conditions_wrap {
  display: flex;
  justify-content: flex-start;
}
</style>