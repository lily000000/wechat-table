<template>
  <div class="areaTime">
    <div style="margin-right: 5px">
      <label style="font-size: 14px;color: #606266;">时间周期：</label>
      <el-select v-model="dateCycle" placeholder="请选择" style="width:60px" @change="onCycle">
        <el-option
          v-for="item in timeData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="day">
      <el-date-picker
        v-if="dateCycle=='DAY'"
        @change="onDay"
        v-model="day"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        :picker-options="pickerOptions"
        style="width:240px"
        :clearable="false"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
    </div>
    <div class="week" v-if="dateCycle=='WEEK'">
      <el-date-picker
        v-model="week"
        type="week"
        :format="weekText"
        :picker-options="startweekPickerOptions"
        value-format="yyyy-MM-dd"
        style="width:230px"
        placeholder="开始周"
        :clearable="false"
        @change="onWeek"
      ></el-date-picker>
      <span style="font-size: 14px;color: #606266;padding: 4px;">至</span>
      <el-date-picker
        ref="saveDateInput"
        v-model="endWeek"
        type="week"
        :format="endWeekText"
        :picker-options="weekPickerOptions"
        value-format="yyyy-MM-dd"
        style="width:230px"
        :clearable="false"
        placeholder="结束周"
        @change="onEndWeek"
      ></el-date-picker>
    </div>
    <div class="month">
      <el-date-picker
        v-if="dateCycle=='MONTH'"
        v-model="months"
        type="monthrange"
        :format="monthText"
        :picker-options="monthPickerOptions"
        value-format="yyyy-MM-dd"
        style="width:240px"
        range-separator="至"
        :clearable="false"
        start-placeholder="开始月份"
        end-placeholder="选择月份"
        @change="onMonth"
      ></el-date-picker>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import localDb from "@/utils/localDb.js";
export default {
  data() {
    return {
      timeNum: {},
      months: [],
      count: 1,
      dateCycle: "DAY",
      day: [],
      flag: false,
      startWeek: "",
      startweekPickerOptions: {
        firstDayOfWeek: 1,
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      },
      weekPickerOptions: {
        firstDayOfWeek: 1,
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      },
      monthPickerOptions: {
        disabledDate(time) {
          var date = new Date();
          var month = date.getMonth() + 1;
          var year = date.getFullYear();
          if (time.getFullYear() == year && time.getMonth() + 1 > month) {
            return true;
          } else if (time.getFullYear() > year) {
            return true;
          }
        }
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      timeData: [
        {
          label: "日",
          value: "DAY"
        },
        {
          label: "周",
          value: "WEEK"
        },
        {
          label: "月",
          value: "MONTH"
        }
      ],
      startDate: this.$Tool.timeMonthMat(),
      endDate: this.$Tool.timeForMat(),
      week: "",
      weekText: "",
      monthText: "",
      endWeek: "",
      endWeekText: ""
    };
  },
  props: {
    isHome: {
      type: Boolean,
      default: false
    },
    cycle: {
      type: String,
      default: "DAY"
    },
    cycleStartTime: {
      type: String,
      default: ""
    },
    cycleEndTime: {
      type: String,
      default: ""
    },
    timeControl: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    // if (this.timeControl) {
    //   this.startDate = this.$Tool.getNowFormatDate(15);
    //   this.endDate = this.$Tool.timeForMat();
    //   this.day = [this.startDate, this.endDate];
    // } else {
    //   this.day = [this.startDate, this.endDate];
    // }
    // if (this.cycleStartTime || this.cycleEndTime) {
    //   this.startDate = this.cycleStartTime;
    //   this.endDate = this.cycleEndTime;
    //   this.dateCycle = this.cycle;
    //   this.showTime();
    //   // console.log('13',this.cycleStartTime)
    //   // console.log('13',this.cycleEndTime)
    // }else{
    //   this.dateCycle = "WEEK";
    //   this.onCycle();
    // }
    this.$root.Bus.$on("cycleDefaults", res => {
      this.dateCycle = res;
      this.onCycle();
    });
  
    this.$root.Bus.$on("timeFilter", res => {
      if (!res) {
        this.timeData = [
          {
            label: "周",
            value: "WEEK"
          },
          {
            label: "月",
            value: "MONTH"
          }
        ];
        
      }else{
        this.timeData = [
          {
          label: "日",
          value: "DAY"
          },
          {
            label: "周",
            value: "WEEK"
          },
          {
            label: "月",
            value: "MONTH"
          }
        ]
      }
    });
      this.dateCycle = "WEEK";
      this.onCycle();
  
  },
  methods: {
    //回显传递的时间
    showTime() {
      // console.log(this.dateCycle);
      if (this.dateCycle == "DAY") {
        this.day = [this.startDate, this.endDate];
      } else if (this.dateCycle == "MONTH") {
        this.monthText = this.startDate + " 至 " + this.endDate;
        this.months = [this.startDate, this.endDate];
        // console.log(this.monthText)
      } else if (this.dateCycle == "WEEK") {
        const endDay = new Date(this.endDate).getDay();
        const nowTime = new Date().getTime();
        var date = new Date(this.startDate); //获取当前时间
        const minStamp = date.getTime();
        let startText = this.formatDate(date);
        date.setDate(date.getDate() + 6);
        const maxStamp = date.getTime();
        let endText = this.formatDate(date);
        if (
          (nowTime > minStamp && nowTime < maxStamp) ||
          nowTime == minStamp ||
          nowTime == maxStamp
        ) {
          endText = this.$Tool.timeForMat();
        }
        this.week = this.startDate;
        this.weekText = startText + " 至 " + endText;

        var endDate = new Date(this.endDate); //获取当前时间
        let endTextEnd = this.formatDate(endDate);
        endDate.setDate(endDate.getDate() - 6);
        let startTextEnd = this.formatDate(endDate);
        if (endDay > 1) {
          startTextEnd = this.$Tool.getNowFormatDate(endDay - 1);
        } else if (endDay == 1) {
          startTextEnd = this.$Tool.timeForMat();
        } else if (endDay == 0) {
          startTextEnd = this.$Tool.getNowFormatDate(6);
        }
        this.endWeek = this.endDate;
        this.endWeekText = startTextEnd + " 至 " + endTextEnd;
      }
    },
    changeParams() {
      return {
        dateCycle: this.dateCycle,
        startDate: this.startDate,
        endDate: this.endDate
      };
    },
    //获取群组聊天记录最新记录日期
    getGroupCycle(dateCycle){
      const params = {
         dateCycle:dateCycle
      }
      this.$API.getGroupLatestDateByCycle(params).then(res => {
         const { data, msg, status } = res;
        if (status == 200) {
          if (dateCycle == "DAY") {
          this.startDate = data.startDate;
          this.endDate = data.endDate;
          this.day = [this.startDate, this.endDate];
        } else if (dateCycle == "MONTH") {
          this.startDate = data.startDate;
          this.endDate = data.endDate;
          this.monthText = this.startDate + " 至 " + this.endDate;
          this.months = [this.startDate, this.endDate];
          // console.log(this.monthText)
        } else if (dateCycle == "WEEK") {
          this.startDate = data.startDate;
          this.endDate = data.endDate;
          const day = moment().day();
          this.weekText = this.startDate + " 至 " + this.endDate;
          this.endWeekText = this.startDate + " 至 " + this.endDate;
          this.week = this.startDate;
          this.endWeek = this.endDate;
        }     
        }
      });
    },
    onCycle() {
      this.day = "";
      this.week = "";
      this.weekText = "";
      this.months = "";
      this.monthText = "";
      this.startWeek = "";
      this.startweekPickerOptions = {
        firstDayOfWeek: 1,
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      };
      this.weekPickerOptions = {
        firstDayOfWeek: 1,
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      };
      this.getGroupCycle(this.dateCycle);
      if (this.dateCycle == "DAY") {
        this.startDate = this.$Tool.timeMonthMat();
        this.endDate = this.$Tool.timeForMat();
        this.day = [this.startDate, this.endDate];
      } else if (this.dateCycle == "MONTH") {
        this.startDate = this.$Tool.timeMonthMat();
        this.endDate = this.$Tool.timeForMat();
        this.monthText = this.startDate + " 至 " + this.endDate;
        this.months = [this.startDate, this.endDate];
        // console.log(this.monthText)
      } else if (this.dateCycle == "WEEK") {
        const day = moment().day();
        if (day > 1) {
          this.startDate = this.$Tool.getNowFormatDate(day - 1);
          this.endDate = this.$Tool.timeForMat();
        } else if (day == 1) {
          this.startDate = this.$Tool.timeForMat();
          this.endDate = this.$Tool.timeForMat();
        } else if (day == 0) {
          this.startDate = this.$Tool.getNowFormatDate(6);
          this.endDate = this.$Tool.timeForMat();
        }
        this.weekText = this.startDate + " 至 " + this.endDate;
        this.endWeekText = this.startDate + " 至 " + this.endDate;
        this.week = this.startDate;
        this.endWeek = this.endDate;
        // console.log(moment().day())
      }
      if (this.isHome) {
        this.$emit("getHomeTime");
      }
      // console.log(this.startDate, this.endDate);
    },
    formatDate(date) {
      var y = date.getFullYear(); //获取年
      var m = date.getMonth() + 1; //获取月
      m = m < 10 ? "0" + m : m; //判断月是否大于10
      var d = date.getDate(); //获取日
      d = d < 10 ? "0" + d : d; //判断日期是否大10
      return y + "-" + m + "-" + d; //返回时间格式
    },
    onDay(val) {
      if (val) {
        this.startDate = val[0];
        this.endDate = val[1];
      } else {
        this.startDate = "";
        this.endDate = "";
      }
      if (this.isHome) {
        this.$emit("getHomeTime");
      }
    },
      onMonth(val) {
        console.log(val);
        if (val) {
          const startDate = new Date(val[0]);
          const endDate = new Date(val[1]);
          const nowDate = new Date();
          console.log('startDate',startDate.getMonth())
          console.log('endDate',endDate.getMonth())
          console.log('nowDate',nowDate.getMonth())
          if (
                  startDate.getMonth() == endDate.getMonth() &&
                  nowDate.getMonth() == endDate.getMonth() &&
                  nowDate.getMonth() == startDate.getMonth()
          ) {
            let nowMonth = "";
            let nowDay = "";
            nowMonth =
                    nowDate.getMonth() + 1 < 10
                            ? "0" + (nowDate.getMonth() + 1)
                            : nowDate.getMonth() + 1;
            if (endDate.getFullYear() == nowDate.getFullYear()) {
              nowDay =
                      nowDate.getDate() < 10
                              ? "0" + nowDate.getDate()
                              : nowDate.getDate();
            } else {
              nowDay = this.$Tool.getDay(
                      endDate.getFullYear(),
                      endDate.getMonth() + 1
              );
            }
            const startText = val[0];
            const endText = endDate.getFullYear() + "-" + nowMonth + "-" + nowDay;
            this.monthText = startText + " 至 " + endText;
            this.startDate = startText;
            this.endDate = endText;
            console.log('文字1',this.monthText);
          } else if (
                  startDate.getMonth() != nowDate.getMonth() &&
                  endDate.getMonth() != nowDate.getMonth()
          ) {
            const endMonth =
                    endDate.getMonth() + 1 < 10
                            ? "0" + (endDate.getMonth() + 1)
                            : endDate.getMonth() + 1;
            const endDay = this.$Tool.getDay(
                    endDate.getFullYear(),
                    endDate.getMonth() + 1
            );
            // const endDay=endDate.getDate()<10?'0'+(endDate.getDate()):endDate.getDate()
            const startText = val[0];
            const endText = endDate.getFullYear() + "-" + endMonth + "-" + endDay;
            this.monthText = startText + " 至 " + endText;
            this.startDate = startText;
            this.endDate = endText;
            console.log('文字2',this.monthText);
            // console.log(this.monthText);
          } else if (
                  startDate.getMonth() != nowDate.getMonth() &&
                  endDate.getMonth() == nowDate.getMonth()
          ) {
            const nowMonth =
                    nowDate.getMonth() + 1 < 10
                            ? "0" + (nowDate.getMonth() + 1)
                            : nowDate.getMonth() + 1;
            let nowDay = "";
            if (endDate.getFullYear() == nowDate.getFullYear()) {
              nowDay =
                      nowDate.getDate() < 10
                              ? "0" + nowDate.getDate()
                              : nowDate.getDate();
            } else {
              nowDay = this.$Tool.getDay(
                      endDate.getFullYear(),
                      endDate.getMonth() + 1
              );
            }
            const startText = val[0];
            const endText = endDate.getFullYear() + "-" + nowMonth + "-" + nowDay;
            this.monthText = startText + " 至 " + endText;
            this.startDate = startText;
            this.endDate = endText;
            console.log('文字3',this.monthText);
            // console.log(this.monthText);
          } else if (
                  startDate.getMonth() == nowDate.getMonth() &&
                  endDate.getMonth() != nowDate.getMonth()
          ) {
            const nowMonth =
                    endDate.getMonth() + 1 < 10
                            ? "0" + (endDate.getMonth() + 1)
                            : endDate.getMonth() + 1;
            let nowDay = "";
            nowDay = this.$Tool.getDay(
                    endDate.getFullYear(),
                    endDate.getMonth() + 1
            );
            const startText = val[0];
            const endText = endDate.getFullYear() + "-" + nowMonth + "-" + nowDay;
            this.monthText = startText + " 至 " + endText;
            this.startDate = startText;
            this.endDate = endText;
            console.log('文字4',this.monthText);
            // console.log(this.monthText);
          }
        } else {
          this.monthText = "";
          this.startDate = "";
          this.endDate = "";
        }
        if(this.isHome){
          this.$emit('getHomeTime')
        }
        // console.log("开始", this.startDate);
        // console.log("结束", this.endDate);
      },
      onWeek() {
        const nowTime=new Date().getTime();
        var date = new Date(this.week);//获取当前时间
        date.setDate(date.getDate()-1);//设置天数 -1 天
        const minStamp=date.getTime()
        let startText = this.formatDate(date)
        date.setDate(date.getDate()+6);
        const maxStamp=date.getTime()
        let endText =this.formatDate(date)
        if((nowTime>minStamp && nowTime<maxStamp) || nowTime==minStamp || nowTime==maxStamp){
          const day=moment().day()
          if(day>1){
            startText=this.$Tool.getNowFormatDate((day-1));
            endText=this.$Tool.timeForMat()
          }else if(day==1){
            endText=this.$Tool.timeForMat()
          }else if(day==0){
            endText=this.$Tool.getNowFormatDate(6);
          }
        }
        let newDay=''
        let newStart=''
        const self=this
        $(function () {
          console.log('开始周',startText)
          const length=$('.el-picker-panel').length
          newDay=$('.el-picker-panel').eq(length-1).find('.el-date-table__row.current').find('div').eq(0).children('span').text().replace(/\ +/g,"").replace(/[\r\n]/g,"")
          if(newDay!=Number(startText.substr(8))){
            newStart=(Number(endText.substr(0,4))-1)+'-12-'+newDay
            endText = self.$Tool.getNowFormatDate(-6, newStart)
            self.startDate = newStart
            self.weekText = newStart + ' 至 ' + endText
            console.log('区间',self.weekText,endText)
          }else{
            
            self.startDate = startText
            self.weekText = startText + ' 至 ' + endText
             console.log('区间2',self.weekText)
          }
          self.weekPickerOptions={
            firstDayOfWeek: 1,
            disabledDate: time => {
              return time.getTime() < new Date(self.startDate).getTime()- 8.64e7 || time.getTime() > Date.now();
            }
          }
          if(self.isHome){
            self.$emit('getHomeTime')
          }
          //console.log($('.el-date-table__row.current').find('div').eq(0).children('span').text().replace(/\ +/g,"").replace(/[\r\n]/g,""))
        })
        // this.startDate=startText
        // this.weekText=startText+' 至 '+endText

      },
    onEndWeek(e) {
      const nowTime = new Date().getTime();
      var date = new Date(this.endWeek); //获取当前时间
      date.setDate(date.getDate() - 1); //设置天数 -1 天
      const minStamp = date.getTime();
      let startText = this.formatDate(date);
      date.setDate(date.getDate() + 6);
      const maxStamp = date.getTime();
      let endText = this.formatDate(date);
      if (
        (nowTime > minStamp && nowTime < maxStamp) ||
        nowTime == minStamp ||
        nowTime == maxStamp
      ) {
        const day = moment().day();
        if (day > 1) {
          startText = this.$Tool.getNowFormatDate(day - 1);
          endText = this.$Tool.timeForMat();
        } else if (day == 1) {
          endText = this.$Tool.timeForMat();
        } else if (day == 0) {
          endText = this.$Tool.getNowFormatDate(6);
        }
      }
      this.endDate = endText;
      this.endWeekText = startText + " 至 " + endText;
      this.startweekPickerOptions = {
        firstDayOfWeek: 1,
        disabledDate: time => {
          return time.getTime() > new Date(endText).getTime();
        }
      };

      if (this.isHome) {
        this.$emit("getHomeTime");
      }
    }
  }
};
</script>
<style>
.month .el-date-editor span {
  display: none;
}
.month .el-date-editor > .el-range-input:nth-child(2) {
  display: none;
}
.month .el-date-editor > .el-range-input {
  width: 100%;
}
</style>
<style scoped>
.areaTime {
  display: flex;
  justify-content: flex-end;
}
.areaTime label {
  font-size: 14px;
  color: #606266;
}
</style>

