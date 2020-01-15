<template>
  <div class="profile" v-loading="loading">
        <div class="head clearfix">
      <div class="head-left">
        <div class="head-title">
          <p>数据概况</p>
          <span class="rTime">更新时间：{{refreshTime}}</span>
          <!-- <noun-annotations :typeNum="typeNum"></noun-annotations> -->
        </div>
      </div>
      <div class="head-right"></div>
      <div class="type_item" >
        <query-conditions ref="queryConditions"></query-conditions>
        <div style="display: inline-block;margin-left:10px">
          <el-button
            @click="search"
            type="primary"   
            style="position: relative;bottom:1px;"
          >查询</el-button>
        </div>
      </div>
    </div>
    <div class="boxList">
       <!-- <p class="box_tit">数据概况</p> -->
      <div class="list clearfix">
        <div
          class="list-one"
          v-for="(item,index) in numData"
          :style="{width:(100/numData.length)+'%'}"
          :key="index"
        >
          <div class="list-main" @click="jumpPage(index)">
            <p>
              <span style="color:#409EFF">{{item.name}}</span>
            </p>
             <p>
              <span style="color:#409EFF">{{item.count}}</span>
            </p>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import queryConditions from "components/queryConditions/index";

import Cookie from "@/utils/cookie";
import _ from "loadsh";
import localDb from "@/utils/localDb.js";
export default {
  components: {
    queryConditions

  },
  data() {
    return {
      cycleType:"",
      cycleStartTime:"",
      cycleEndTime:"",
      timeNum: {},
      communityTypes: "0",
      loading: true,
      cycle: "DAY",
      numData: [],
      refreshTime: "",
      params: {
      }
    };
  },
  props: {},
  computed: {
    ...mapState({
      listByCodes: state => state.global.listByCodes
    })
  },
  mounted() {
    this.params = Object.assign(
      this.params,
      this.$refs.queryConditions.changeParams()
    );
    this.getStatusReq(this.params);
    this.refreshTimes();
  },
  methods: {
    //获取工单概况
    flowProfile(params) {
      this.$API.getWorkSummaryData(params).then(res => {
        const { data, msg, status } = res;
        if (status == 200) {
          this.loading = false;
          this.numData = data;
        }
      });
    },
      //获取工单概况
    refreshTimes() {
       const params = {
         dateCycle:"DAY"
      }
      this.$API.getGroupLatestDateByCycle(params).then(res => {
        const { data, msg, status } = res;
        if (status == 200) {
          this.refreshTime = data.endDate; 
        }
      });
    },
    jumpPage(id) {
      let pointTime = this.$refs.queryConditions.changeParams()
      localDb.set("timecont", pointTime);
        if(id == 0){
          this.$router.push({
          path: "/generalSituation",
          query: { orderType: 1,title:"新增会员" }
        });
      }else if(id == 1){
          this.$router.push({
          path: "/generalSituation",
          query: { orderType: 2,title:"活跃会员" }
        });
      }else if(id == 2){
        this.$router.push({
          path: "/generalSituation",
          query: { orderType: 3,title:"沉默会员" }
        });
      }else if(id == 3){
        this.$router.push({
          path: "/generalSituation",
          query: { orderType: 4,title:"流失会员" }
        });
      }else if(id == 4){
        this.$router.push({
          path: "/generalSituation",
          query: { orderType: 5,title:"累计留存会员" }
        });

      }    
    },
    search() {
      this.params = Object.assign(
        this.params,
        this.$refs.queryConditions.changeParams()
      );
      this.getStatusReq(this.params);
    },
    getStatusReq(params) {
      this.$API.getGroupIndicatorSummary(params).then(res => {
        const { status, data, msg } = res;
        if (status == 200) {
          this.numData = data;
          this.loading = false;
          // this.numData.map((item, index) => {
          //   item.flag = index < 3 ? true : false;
          //   if (item.ratio.indexOf("-") == -1 && item.ratio != "0%") {
          //     item.ratio = "+" + item.ratio;
          //   }
          // });
        }
        // this.lineData=res.data;
        // console.log( this.numData);
      });
    }


  }
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>

