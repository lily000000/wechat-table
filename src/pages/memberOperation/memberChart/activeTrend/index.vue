<template>
  <div class="order_charts" style="margin-top:10px">
    <el-row>
      <el-col>
        <el-card shadow="hover" style>
          <div slot="header" class="heard-item">
            <p class="title">会员运营趋势-活跃会员</p>
            <div class="time-right type_item">
              <query-conditions ref="queryConditions" :timeFilter="true"></query-conditions>
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
          <div id="myCharteone" style="width: 100%;height:400px;" v-loading="loading"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Cookie from "@/utils/cookie";
import echarts from "@/utils/echarts";

import queryConditions from "@/components/queryConditionsDay/index.vue";
export default {
  data() {
    return {
      title: "",
      figureline: false,
      tabPosition: "2",
      communityTypes: "0",
      lengthName: [],
      xdataTime: [],
      lineData: [],
      tooltipData: [],
      params: {
        type: 2
      },
      loading: true
    };
  },
  components: {
    queryConditions
  },
  mounted() {
    this.params = Object.assign(
      this.params,
      this.$refs.queryConditions.changeParams()
    );
    // this.$root.Bus.$emit("timeParams", this.params);
    this.getLineReqs(this.params);
  },
  methods: {
    onTabPosition() {
      switch (this.tabPosition) {
        case "1":
          this.figureline = true;
          this.getLineReqs(this.params);
          break;
        case "2":
          this.figureline = false;
          this.getLineReqs(this.params);
          break;
      }
    },
    search() {
      this.params = Object.assign(
        this.params,
        this.$refs.queryConditions.changeParams()
      );
      this.getLineReqs(this.params);
      // this.timeParams = this.$refs.refChild.changeParams();
    },
    onChartsInit(e) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("myCharteone"));
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
                      let listHtml = "";
                      listHtml += `<p>${one.name}:${one.count}</p>`;

                      str = `<div ><span>${one.date}</span></div>`;
                      let crcy = `<span style='width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:5px;background:${params.color}'></span>`;
                      str += `<div>${crcy}<span style='width:110px;display:inline-block'>${listHtml}</span></div>`;
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
                        str +=
                          "<div>" +
                          crcy +
                          "<span style='width:100px;display:inline-block'>" +
                          params[i].seriesName +
                          ":" +
                          one.count +
                          "</span></div>";
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
    getLineReqs(params) {
      // console.log('参数',params)
      this.loading = true;
      this.$API.getGroupIndicatorTrend(params).then(res => {
        // console.log("数据", res);
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
              // console.log('报表数据',item)
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