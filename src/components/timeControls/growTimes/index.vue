<template>
  <div class="areaTime">
    <div style="margin-right: 5px">
      <label style="font-size: 14px;color: #606266;"></label>
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
        @focus="dayFocus"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        style="width:230px"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
    </div>
    <div class="week" v-if="dateCycle=='WEEK'">
      <el-date-picker
        v-model="week"
        type="week"
        :format="weekText"
        :picker-options="weekPickerOptions"
        value-format="yyyy-MM-dd"
        style="width:230px"
        placeholder="开始周"
        @change="onWeek"
      ></el-date-picker>
    </div>
    <div class="month">
      <el-date-picker
        v-if="dateCycle=='MONTH'"
        v-model="months"
        type="month"
        :format="monthText"
        value-format="yyyy-MM-dd"
        style="width:230px"
        range-separator="至"
        start-placeholder="开始月份"
        end-placeholder="选择月份"
        @change="onMonth"
      ></el-date-picker>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      dateCycle: "WEEK",
      months: "",
      count: 1,
      day: [],
      flag: false,
      startWeek: "",
      weekPickerOptions: {
        firstDayOfWeek: 1
      },
      timeData: [
       
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
      monthText: ""
    };
  },
  props: {
    cycle: {
      type: String,
      default: "DAY"
    },
    isLimit: {
      type: Boolean,
      default: false
    },
    cycleStartTime: {
      type: String,
      default: ""
    },
    cycleEndTime: {
      type: String,
      default: ""
    }
  },
  watch: {
    cycleStartTime: function(newVue) {
      console.log(2444, newVue);
    }
  },
  beforeDestroy() {
    this.$root.Bus.$off("cycleDefault");
  },
  mounted() {
    this.$root.Bus.$on("cycleDefault", res => {
      this.dateCycle = res;
      this.onCycle();
    });
    this.day = [this.startDate, this.endDate];
    console.log(this.cycleStartTime);
    if (this.cycleStartTime || this.cycleEndTime) {
      this.startDate = this.cycleStartTime;
      this.endDate = this.cycleEndTime;
      this.dateCycle = this.cycle;
      this.showTime();
    
    }
  },
  methods: {
    //回显传递的时间
    showTime() {
      if (this.dateCycle == "DAY") {
        this.day = [this.startDate, this.endDate];
      } else if (this.dateCycle == "MONTH") {
        this.monthText = this.startDate + " 至 " + this.endDate;
        this.months = this.startDate;
        //  console.log(this.monthText)
        //  console.log(this.startDate,this.endDate)
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
    dayFocus(val) {
      let obj = {};
      obj.startDate = this.startDate;
      obj.endDate = this.endDate;
      localStorage.setItem("banTime", JSON.stringify(obj));
      console.log(val);
    },
    changeParams() {
      return {
        dateCycle: this.dateCycle,
        startDate: this.startDate,
        endDate: this.endDate
      };
    },
    onCycle() {
      this.day = "";
      this.week = "";
      this.weekText = "";
      this.months = "";
      this.monthText = "";
      if (this.dateCycle == "DAY") {
        this.startDate = this.$Tool.timeMonthMat();
        this.endDate = this.$Tool.timeForMat();
        this.day = [this.startDate, this.endDate];
      } else if (this.dateCycle == "MONTH") {
        if (this.isLimit) {
          this.startDate = this.$Tool.timeMonthMat();
          this.endDate = this.$Tool.getMonthDay(this.$Tool.timeMonthMat());
        } else {
          this.startDate = this.$Tool.timeMonthMat();
          this.endDate = this.$Tool.timeForMat();
        }

        this.monthText = this.startDate + " 至 " + this.endDate;
        this.months = this.endDate;
        // console.log(this.monthText)
      } else if (this.dateCycle == "WEEK") {
        const day = moment().day();
        console.log(day);
        if (day > 1) {
          this.startDate = this.$Tool.getNowFormatDate(day - 1);
          this.endDate = this.$Tool.getNowFormatDate(day - 7);
        } else if (day == 1) {
          this.startDate = this.$Tool.timeForMat();
          this.endDate = this.$Tool.getNowFormatDate(day - 7);
        } else if (day == 0) {
          this.startDate = this.$Tool.getNowFormatDate(6);
          this.endDate = this.$Tool.timeForMat();
        }
        console.log(this.startDate);
        console.log(this.endDate);
        this.weekText = this.startDate + " 至 " + this.endDate;
        this.week = this.startDate;
      }
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
        const start = val[0];
        const end = val[1];
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (this.isLimit) {
          if (start == end) {
            this.$message.warning("开始时间不能等于结束时间");
            const time = JSON.parse(localStorage.getItem("banTime"));
            this.startDate = time.startDate;
            this.endDate = time.endDate;
            this.day = [this.startDate, this.endDate];
            console.log(this.day);
            return;
          } else if (
            startDate.getFullYear() != endDate.getFullYear() ||
            startDate.getMonth() != endDate.getMonth()
          ) {
            this.$message.warning("只能选择同一月份下的日期！");
            const time = JSON.parse(localStorage.getItem("banTime"));
            this.startDate = time.startDate;
            this.endDate = time.endDate;
            this.day = [this.startDate, this.endDate];
          } else {
            this.startDate = val[0];
            this.endDate = val[1];
          }
        } else {
          this.startDate = val[0];
          this.endDate = val[1];
        }
      } else {
        this.startDate = "";
        this.endDate = "";
      }
    },
    onMonth(val) {
      if (val) {
        const startDate = new Date(val);
        const endDate = new Date(val);
        const nowMonth =
          startDate.getMonth() + 1 < 10
            ? "0" + (startDate.getMonth() + 1)
            : startDate.getMonth() + 1;
        let nowDay = "";
        nowDay = this.$Tool.getDay(
          endDate.getFullYear(),
          endDate.getMonth() + 1
        );
        const startText = val;
        const endText = endDate.getFullYear() + "-" + nowMonth + "-" + nowDay;
        this.monthText = startText + " 至 " + endText;
        this.startDate = startText;
        this.endDate = endText;
      } else {
        this.monthText = "";
        this.startDate = "";
        this.endDate = "";
      }
    },
    onWeek() {
      var date = new Date(this.week); //获取当前时间
      date.setDate(date.getDate() - 1); //设置天数 -1 天
      this.startDate = this.formatDate(date);
      date.setDate(date.getDate() + 6);
      this.endDate = this.formatDate(date);
      this.weekText = this.startDate + " 至 " + this.endDate;
      this.week = this.startDate;
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
</style>

