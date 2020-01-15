<template>
  <div class="time-right">
    <div>
      <label style="font-size: 14px;color: #606266;">时间周期：</label>
      <el-select v-model="cycle" placeholder="请选择" style="width:85px" @change="timeWay">
        <el-option
          v-for="item in timeData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="day" v-if="cycle==1">
      <el-date-picker
        v-model="day"
        type="daterange"
        @change="dayWay"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        :clearable="false"
        style="width:240px"
      ></el-date-picker>
    </div>
    <div class="month" v-if="cycle==4||cycle==2||cycle==3">
      <el-date-picker
        v-model="months"
        type="monthrange"
        @change="monthWay"
        range-separator="至"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
        value-format="yyyy-MM-dd"
        :picker-options="monthPickerOptions"
        :clearable="false"
        style="width:240px"
      ></el-date-picker>
    </div>
    <div class="selectType" v-if="cycle==2||cycle==3">
      <el-select v-model="count" placeholder="请选择" style="width:100px" v-if="flag">
        <el-option
          v-for="item in weekData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :clearable="false"
        ></el-option>
      </el-select>
      <el-select v-model="count" placeholder="请选择" style="width:100px" v-else>
        <el-option
          v-for="item in xunData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      months: [],
      count: 1,
      cycle: 1,
      day: [],
      flag: false,
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
      xunData: [
        {
          label: "上旬",
          value: 1
        },
        {
          label: "中旬",
          value: 2
        },
        {
          label: "下旬",
          value: 3
        }
      ],
      weekData: [
        {
          label: "第一周",
          value: 1
        },
        {
          label: "第二周",
          value: 2
        },
        {
          label: "第三周",
          value: 3
        },
        {
          label: "第四周",
          value: 4
        },
        {
          label: "第五周",
          value: 5
        }
      ],
      timeData: [
        {
          label: "日",
          value: 1
        },
        {
          label: "周",
          value: 2
        },
        {
          label: "旬",
          value: 3
        },
        {
          label: "月",
          value: 4
        }
      ],
      startDate: this.$Tool.timeMonthMat(),
      endDate: this.$Tool.timeForMat(),
    };
  },
  mounted() {
    this.day = [this.startDate, this.endDate];
  },
  methods: {
    changeParams(){
        return {
            "count": this.count,
            "cycle": this.cycle,
            "endDate": this.endDate,
            "startDate": this.startDate
        }
    },
    timeWay(val) {
      if (val == 2) {
        this.flag = true;
      } else {
        this.flag = false;
      }
      if (val == 1) {
        this.day = [this.$Tool.timeMonthMat(), this.$Tool.timeForMat()];
        this.startDate = this.day[0];
        this.endDate = this.day[1];
        this.months = [];
      } else {
        this.months = [this.$Tool.timeForMat(), this.$Tool.timeForMat()];
        this.startDate = this.months[0];
        this.endDate = this.months[1];
        this.day = [];
        this.count = 1;
      }
    },
    dayWay(val) {
      if (val) {
        this.startDate = val[0];
        this.endDate = val[1];
      } else {
        this.startDate = "";
        this.endDate = "";
      }
    },
      monthWay(val) {
      if (val) {
        this.startDate = val[0];
        this.endDate = val[1];
      } else {
        this.startDate = "";
        this.endDate = "";
      }
    },
  }
};
</script>

