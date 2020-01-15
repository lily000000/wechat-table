<template>
  <div class="checkTime">
    <div style="margin-right: 5px">
      <label style="font-size: 14px;color: #606266;padding-right: 9px">{{title}}</label>
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
              style="width:210px"
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
              value-format="yyyy-MM-dd"
              style="width:210px"
              placeholder="请选择周"
              :clearable="false"
              @change="onWeek"
      ></el-date-picker>
    </div>
    <div class="month">
      <el-date-picker
              v-if="dateCycle=='MONTH'"
              v-model="months"
              type="monthrange"
              :format="monthText"
              value-format="yyyy-MM-dd"
              style="width:210px"
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
  export default {
    data() {
      return {
        months: [],
        count: 1,
        dateCycle: "DAY",
        day: [],
        flag: false,
        startWeek: "",
        timeData: [
          {
            label: "日",
            value: 'DAY'
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
        startDate: '',
        endDate:'',
        week: "",
        weekText: "",
        monthText: "",
        endWeek: "",
        endWeekText: "",
      };
    },
    props: {
      title:{
        type:String,
      },
      isHome:{
        type:Boolean,
        default:false
      },
      cycle:{
        type:String,
        default:'DAY'
      },
      cycleStartTime:{
        type:String,
        default:''
      },
      cycleEndTime:{
        type:String,
        default:''
      },
    },
    mounted() {
      // console.log('13',this.cycleStartTime)
      // console.log('13',this.cycleEndTime)
      if(this.cycleStartTime || this.cycleEndTime){
        this.startDate=this.cycleStartTime
        this.endDate=this.cycleEndTime
        this.dateCycle=this.cycle
        this.showTime()
        // console.log('13',this.cycleStartTime)
        // console.log('13',this.cycleEndTime)
      }
    },
    methods: {
      reset(){
        this.dateCycle='DAY'
        this.onCycle();
      },
      //回显传递的时间
      showTime(){
        if(this.dateCycle=='DAY'){
          this.day=[this.startDate,this.endDate]
        }else if(this.dateCycle=='MONTH'){
          this.monthText=this.startDate+" 至 "+this.endDate
          this.months=[this.startDate,this.endDate]
          // console.log(this.monthText)
        }else if(this.dateCycle=='WEEK'){
          const endDay=new Date(this.endDate).getDay()
          const nowTime=new Date().getTime();
          var date = new Date(this.startDate);//获取当前时间
          const minStamp=date.getTime()
          let startText = this.formatDate(date)
          date.setDate(date.getDate()+6);
          const maxStamp=date.getTime()
          let endText =this.formatDate(date)
          if((nowTime>minStamp && nowTime<maxStamp) || nowTime==minStamp || nowTime==maxStamp){
            endText=this.$Tool.timeForMat()
          }
          this.week=this.startDate
          this.weekText=startText+' 至 '+endText

          var endDate = new Date(this.endDate);//获取当前时间
          let endTextEnd = this.formatDate(endDate)
          endDate.setDate(endDate.getDate()-6);
          let startTextEnd =this.formatDate(endDate)
          if(endDay>1){
            startTextEnd=this.$Tool.getNowFormatDate((endDay-1));
          }else if(endDay==1){
            startTextEnd=this.$Tool.timeForMat()
          }else if(endDay==0){
            startTextEnd=this.$Tool.getNowFormatDate(6);
          }
          this.endWeek=this.endDate
          this.endWeekText=startTextEnd+' 至 '+endTextEnd
        }
      },
      changeParams() {
        return {
          "dateCycle": this.dateCycle,
          "startDate": this.startDate,
          "endDate": this.endDate,
        }
      },
      onCycle() {
        this.day = [];
        this.week = "";
        this.weekText = "";
        this.months = "";
        this.monthText = "";
        this.startWeek="";
        if(this.dateCycle=='DAY'){
          this.day=[]
        }else if(this.dateCycle=='MONTH'){
          this.monthText=''
          this.months=[]
          // console.log(this.monthText)
        }else if(this.dateCycle=='WEEK'){
          const day=moment().day()
          this.weekText=''
          this.week=''
          // console.log(moment().day())
        }
        this.startDate=''
        this.endDate='';
        if(this.isHome){
          this.$emit('getHomeTime')
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
          this.startDate = val[0];
          this.endDate = val[1];
        } else {
          this.startDate = "";
          this.endDate = "";
        }
        if(this.isHome){
          this.$emit('getHomeTime')
        }
      },
      onMonth(val) {
        // console.log(val);
        if (val) {
          const startDate = new Date(val[0]);
          const endDate = new Date(val[1]);
          const nowDate = new Date();
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
            // console.log(this.monthText);
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
        this.startDate=startText
        this.endDate=endText
        this.weekText=startText+' 至 '+endText
        if(this.isHome){
          this.$emit('getHomeTime')
        }
      },
    }
  };
</script>
<style>
  .checkTime .el-range-editor--small.el-input__inner,.checkTime .el-range-editor--small .el-range-input{
    background: transparent;
  }
  .checkTime .el-input--small .el-input__inner{
    padding-right: 0px;
    background: transparent;
  }
  .checkTime .month .el-date-editor span {
    display: none;
  }
  .checkTime .month .el-date-editor > .el-range-input:nth-child(2) {
    display: none;
  }
  .checkTime .month .el-date-editor > .el-range-input {
    width: 100%;
    text-align: left;
  }
  .checkTime .el-date-editor .el-range__close-icon{
    display: none;
  }
</style>
<style scoped>
  .checkTime {
    display: flex;
    justify-content: flex-end;
  }
  .checkTime label{
    font-size: 14px;
    color: #606266;
  }
</style>

