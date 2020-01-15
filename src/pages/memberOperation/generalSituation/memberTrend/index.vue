<template>
  <div class="order_charts">
    <el-row>
      <el-col>
        <el-card shadow="hover" style>
          <div slot="header" class=" heard-item">
            <p class="title">{{title}}</p>
            <div class="time-right type_item">
              <query-conditions
                ref="queryConditions"
                :getRidStatus="getRidStatus"
                :timeFilter="timeFilter"
                :dateCycle="dateCycle"
              ></query-conditions>
              <div class="export-btn">
                <el-button type="primary" @click="search">查询</el-button>
              </div>
            </div>
          </div>
          <div class="btn_wrap">
            <el-radio-group
              v-model="tabPosition"
              style="margin-bottom: 10px;"
              @change="onTabPosition"
            >
              <el-radio-button label="2">折线图</el-radio-button>
              <el-radio-button label="1">柱状图</el-radio-button>   
            </el-radio-group>
          </div>
          <div v-loading="loading">
            <div id="myChart" ref="chart" style="width: 100%;height:400px;"></div>
          </div>

          <table-detail></table-detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Cookie from "@/utils/cookie";
import echarts from "@/utils/echarts";
import tableDetail from "../tableDetail/index";
import queryConditions from "@/components/queryConditions/index.vue";
export default {
  data() {
    return {
      dateCycle:"",
      timeFilter: true,
      getRidStatus: true,
      title: "",
      figureline: false,
      tabPosition: "2",
      communityTypes: "0",
      lengthName: [],
      xdataTime: [],
      lineData: [],
      tooltipData: [],
      params: {
        type: 1
        
      },
      loading: true
    };
  },
  components: {
    queryConditions,
    tableDetail
  },
  mounted() {
    this.params.type = this.$route.query.orderType
    ? this.$route.query.orderType
    : "";
    this.determineType(this.params.type);
    this.params = Object.assign(
      this.$refs.queryConditions.changeParams(),
      this.params
    );
    this.$root.Bus.$emit("timeParams", this.params);
    this.title = this.$route.query.title ? this.$route.query.title : ""; 
    this.getLine(this.params);
  },
  methods: {
    determineType(val) {
      switch (val) {
        case 1:
          this.timeFilter = true;
          break;
        case 2:
          this.timeFilter = true;
          break;
        case 3:
          this.timeFilter = false; 
          this.$root.Bus.$emit("timeFilter",this.timeFilter); 
          break;
        case 4:
          this.timeFilter = false;
          this.$root.Bus.$emit("timeFilter",this.timeFilter);
           break;
        case 5:
          this.timeFilter = false;
          this.$root.Bus.$emit("timeFilter",this.timeFilter);
          break;
      }
    },
    onTabPosition() {
      switch (this.tabPosition) {
        case "1":
          this.figureline = true;
          this.getLine(this.params);
          break;
        case "2":
          this.figureline = false;
          this.getLine(this.params);
          break;
      }
    },
    search() {
      this.params = Object.assign(
        this.params,
        this.$refs.queryConditions.changeParams()
      );
      console.log('嘻嘻嘻',this.$refs.queryConditions.changeParams())
      this.$root.Bus.$emit("timeParams", this.params);
      this.getLine(this.params);
      // this.timeParams = this.$refs.refChild.changeParams();
    },
    onChartsInit(e) {
      // 基于准备好的dom，初始化echarts实例
      // var myChart = echarts.init(document.getElementById("myChart"));
      var bar_dv = this.$refs.chart;
      var myChart = echarts.init(document.getElementById("myChart"));
      var trigger;
      if (this.figureline) {
        trigger = "item";
      } else {
        trigger = "axis";
      }
      // 绘制图表
      let option = {
        color: ["#3398DB"],
        title: {
          text: "",
          textStyle: {
            fontWeight: "normal",
            fontSize: "16"
          }
        },
        textStyle: {
          fontSize: 16
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        tooltip: {
          trigger: trigger,
          // alwaysShowContent:true,
          enterable: true,
          formatter: params => {
            if (this.figureline) {
              let str;
              // let str = `<div ><span>${params.name}</span></div>`;
              this.tooltipData.map((item, index) => {
                if (item.day == params.name) {
                  item.data.map(one => {
                    if (params.seriesName == one.name) {
                      let crcy = `<span style='width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:5px;background:${params.color}'></span>`;
                      let listHtml = "";
                      if(this.params.type == 4){
                        listHtml += `<p>合计:${one.count}</p><p>有流失风险:${one.count1}</p><p>半流失用户:${one.count2}</p><p>流失用户:${one.count3}</p>`;
                        str = `<div ><span>${one.date}</span></div>`;
                        str += `<div><span style='width:110px;display:inline-block;font-size:14px'>${listHtml}</span></div>`;
                      }else{
                        listHtml += `<p>${one.name}:${one.count}</p>`;
                        str = `<div ><span>${one.date}</span></div>`;
                        str += `<div>${crcy}<span style='width:110px;display:inline-block;font-size:14px'>${listHtml}</span></div>`;
                      }        
                    }
                  });
                }
              });
              return `<div style="max-height:200px;overflow-y:auto;">${str}</div>`;
            } else {
              let str;
              for (var i = 0; i < params.length; i++) {
                this.tooltipData.map((item, index) => {
                  if (item.day == params[i].axisValue) {
                    item.data.map(one => {
                      if (params[i].seriesName == one.name) {
                        str = `<div ><span>${one.date}</span></div>`;
                        let crcy = `<span style='width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:5px;background:${params[i].color}'></span>`;
                        if(this.params.type == 4){
                          str +=`<div> <span style='width:100px;display:inline-block'><p>合计:${one.count}</p><p>有流失风险:${one.count1}</p><p>半流失用户:${one.count2}</p><p>流失用户:${one.count3}</p></span></div>`;
                        }else{
                          str +=`<div>${crcy}<span style='width:100px;display:inline-block'>${params[i].seriesName} : ${one.count} </span></div>`;
                        }
                       
                      }
                    });
                  }
                });
              }
              return str;
            }
          }
        },
        legend: {
          itemHeight: 8,
          right: 0,
          top: "20px",
          right: "40px",
          textStyle: {
            fontSize: "12px"
          },
          data: this.lengthName // 坐标轴指示器，坐标轴触发有效
        },

        xAxis: [
          {
            type: "category",
            axisLabel: {
              color: "#606266"
            },
            axisLine: {
              lineStyle: { color: "#606266" } // x轴坐标轴颜色
            },
            data: this.xdataTime,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],

        yAxis: {
          type: "value",
          splitLine: {
            //网格线
            lineStyle: {
              type: "dashed" //设置网格线类型 dotted：虚线   solid:实线
            },
            show: true //隐藏或显示
          }
        },
        series: this.lineData
      };
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
      this.loading = false;
    },
    //获取折线图接口
    getLine(params) {
      this.loading = true;
      this.$API.getGroupIndicatorTrend(params).then(res => {
        // console.log("请求数据数据", res);
        this.loading = false;
        const { status, data, msg } = res;
        if (status == 200) {
          let list = [];
          let time = [];
          let name = [];
          let dataArr = [];
          for (let i in data) {
            let key = {};
            let timeArr = [];
            key.name = data[i].name;
            // key.type = "bar";
            key.type = this.figureline ? "bar" : "line";
            key.data = [];
            data[i].data.map((item, index) => {
              let obj = {};
              obj.data = [];
              obj.day = item.cycle;
              obj.data.push(item);
              key.data.push(item.count);
              key.smooth = true;
              timeArr.push(item.cycle);
              dataArr.push(obj);
            });
            key.barMaxWidth = 20;
            if (i == 0) {
              key.itemStyle = {
                normal: {
                  color: "#4da3ff", //改变折线点的颜色
                  lineStyle: {
                    color: "#4da3ff" //改变折线颜色
                  }
                }
              };
            } else if (i == 1) {
              key.itemStyle = {
                normal: {
                  color: "#49d57b", //改变折线点的颜色
                  lineStyle: {
                    color: "#49d57b" //改变折线颜色
                  }
                }
              };
            } else if (i == 2) {
              key.itemStyle = {
                normal: {
                  color: "#E6A23C", //改变折线点的颜色
                  lineStyle: {
                    color: "#E6A23C" //改变折线颜色
                  }
                }
              };
            } else if (i == 3) {
              key.itemStyle = {
                normal: {
                  color: "#F56C6C", //改变折线点的颜色
                  lineStyle: {
                    color: "#F56C6C" //改变折线颜色
                  }
                }
              };
            }

            name.push(data[i].name);
            list.push(key);
            time = timeArr;
          }
          var result = [];
          var obj = {};
          for (var i = 0; i < dataArr.length; i++) {
            if (!obj[dataArr[i].day]) {
              result.push(dataArr[i]);
              obj[dataArr[i].day] = true;
            } else {
              result.map((item, index) => {
                if (item.day == dataArr[i].day) {
                  item.data = [...item.data, ...dataArr[i].data];
                }
              });
            }
          }
          this.tooltipData = result;
          this.lineData = list;
          this.xdataTime = time;
          this.lengthName = name;
          // console.log(this.lineData);
          this.onChartsInit();
        }
      });
    }
  }
};
</script>
<style lang="scss" >
@import "./style.scss";
</style>