<template>
  <div class="time-right">
    <div>
      <label style="font-size: 14px;color: #606266;">时间周期：</label>
      <el-select v-model="dateCycle" placeholder="请选择" style="width:85px" @change="onCycle">
        <el-option
          v-for="item in cycleData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="day" v-if="dateCycle=='DAY'">
      <el-date-picker
              @change="onDay"
              v-model="day"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              style="width:150px"
              :clearable="false"
              placeholder="选择日期">
      </el-date-picker>
    </div>
    <div class="week" v-if="dateCycle=='WEEK'">
      <el-date-picker
              v-model="week"
              type="week"
              :format="weekText"
              :picker-options="weekPickerOptions"
              value-format="yyyy-MM-dd"
              style="width:240px"
              :clearable="false"
              placeholder="选择周"
              @change="onWeek">
      </el-date-picker>
    </div>
    <div class="week" v-if="dateCycle=='MONTH'">
      <el-date-picker
              v-model="months"
              type="month"
              :format="monthText"
              :picker-options="monthPickerOptions"
              value-format="yyyy-MM-dd"
              style="width:240px"
              placeholder="选择月"
              :clearable="false"
              @change="onMonth">
      </el-date-picker>
    </div>
    <div class="contrast" v-if="dateCycle=='CUSTOM'" >
      <div>
        <el-date-picker
                style="width:240px"
                v-model="oneTime"
                @change="onOne"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                :clearable="false"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div>
        <span style="padding:0 5px;font-size: 14px">对比</span>
      </div>
      <div>
        <el-date-picker
                style="width:240px"
                v-model="twoTime"
                @change="onTwo"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                :clearable="false"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from "moment";
export default {
  data() {
    return {
      months: "",
      count: 1,
      dateCycle: "CUSTOM",
      day: this.$Tool.timeForMat(),
      flag: false,
      weekPickerOptions:{
        firstDayOfWeek:1,
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
      cycleData: [
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
        },
        {
          label: "自定义",
          value: "CUSTOM"
        },
      ],
      startDate: this.$Tool.timeForMat(),
      endDate: this.$Tool.timeForMat(),
      compareStartDate:'',
      compareEndDate:'',
      oneTime:[],
      twoTime:[],
      week:'',
      weekText:'',
      monthText:'',
    };
  },
  props: {
    isHome:{
      type:Boolean,
      default:false
    },
  },
  mounted() {
    this.onCycle()
  },
  methods: {
    changeParams(){
      return{
        "dateCycle":this.dateCycle,
        "startDate":this.startDate,
        "endDate":this.endDate,
        "compareStartDate":this.compareStartDate,
        "compareEndDate":this.compareEndDate,
      }
    },
    onCycle(){
      this.day=''
      this.week=''
      this.weekText=''
      this.months=""
      this.monthText=''
      this.startDate=''
      this.endDate=''
      this.oneTime=[]
      this.compareStartDate=''
      this.compareEndDate=''
      this.twoTime=[]
      if(this.dateCycle=='DAY'){
        this.startDate=this.$Tool.getNowFormatDate(1);
        this.endDate=this.$Tool.getNowFormatDate(1);
        this.day=this.startDate
      }else if(this.dateCycle=='MONTH'){
        this.startDate=this.$Tool.timeMonthMat();
        this.endDate=this.$Tool.timeForMat();
        this.monthText=this.startDate+" 至 "+this.endDate
        this.months=this.startDate
        console.log(this.months)
      }else if(this.dateCycle=='WEEK'){
        const day=moment().day()
        if(day>1){
          this.startDate=this.$Tool.getNowFormatDate((day-1));
          this.endDate=this.$Tool.timeForMat()
        }else if(day==1){
          this.startDate=this.$Tool.timeForMat()
          this.endDate=this.$Tool.timeForMat()
        }else if(day==0){
          this.startDate=this.$Tool.getNowFormatDate(6);
          this.endDate=this.$Tool.timeForMat()
        }
        this.weekText=this.startDate+" 至 "+this.endDate
        this.week=this.startDate
        console.log(moment().day())
      }else if(this.dateCycle=='CUSTOM'){
        this.startDate=this.$Tool.timeMonthMat();
        this.endDate=this.$Tool.timeForMat();
        this.oneTime=[this.startDate,this.endDate]
        let startDate=new Date(this.startDate)
        let endDate=new Date(this.endDate)
        startDate.setMonth(startDate.getMonth()-1);
        endDate.setMonth(endDate.getMonth()-1);
        this.compareStartDate=this.formatDate(startDate)
        this.compareEndDate=this.formatDate(endDate)
        this.twoTime=[this.compareStartDate,this.compareEndDate]
      }
      if(this.isHome){
        this.$emit('getPointTime')
      }
    },
    formatDate(date){
      var y = date.getFullYear();  //获取年
      var m = date.getMonth() + 1;  //获取月
      m = m < 10 ? '0' + m : m;  //判断月是否大于10
      var d = date.getDate();  //获取日
      d = d < 10 ? ('0' + d) : d;  //判断日期是否大10
      return y + '-' + m + '-' + d;  //返回时间格式
    },
    onOne(val){
      console.log(val)
      if(val){
        let startDate=new Date(val[0])
        let endDate=new Date(val[1])
        startDate.setMonth(startDate.getMonth()-1);
        endDate.setMonth(endDate.getMonth()-1);
        this.compareStartDate=this.formatDate(startDate)
        this.compareEndDate=this.formatDate(endDate)
        this.twoTime=[this.compareStartDate,this.compareEndDate]
        this.startDate=val[0]
        this.endDate=val[1]
      }else{
        this.startDate=''
        this.endDate=''
        this.oneTime=[]
        this.compareStartDate=''
        this.compareEndDate=''
        this.twoTime=[]
      }
      if(this.isHome){
        this.$emit('getPointTime')
      }
      console.log(val)
    },
    onTwo(val){
      if(val){
        this.compareStartDate=val[0]
        this.compareEndDate=val[1]
        this.twoTime=[this.compareStartDate,this.compareEndDate]
      }else{
        this.compareStartDate=''
        this.compareEndDate=''
        this.twoTime=[]
      }
      if(this.isHome){
        this.$emit('getPointTime')
      }
    },
    onDay(val){
      if(val){
        this.startDate=val;
        this.endDate=val;
      }else{
        this.startDate='';
        this.endDate='';
      }
      if(this.isHome){
        this.$emit('getPointTime')
      }
    },
    onMonth(val){
      if(val){
        const date=new Date(val)
        const nowDate=new Date()
        let nowMonth=nowDate.getMonth()+1
        let oldMonth=date.getMonth()+1
        if(nowMonth==oldMonth){
          this.monthText=this.$Tool.timeMonthMat()+' 至 '+this.$Tool.timeForMat()
          this.startDate=this.$Tool.timeMonthMat();
          this.endDate=this.$Tool.timeForMat();
        }else{
          let month=this.$Tool.getDay(date.getFullYear(),oldMonth)
          nowMonth=nowMonth<10?'0'+nowMonth:nowMonth
          oldMonth=oldMonth<10?'0'+oldMonth:oldMonth
          const startText=nowDate.getFullYear()+"-"+oldMonth+"-01"
          const endText=date.getFullYear()+"-"+oldMonth+"-"+month
          this.monthText=startText+' 至 '+endText
          this.startDate=startText;
          this.endDate=endText;
        }
      }else{
        this.startDate='';
        this.endDate='';
      }
      if(this.isHome){
        this.$emit('getPointTime')
      }
    },
    onWeek(val){
      console.log(val)
      const nowTime=new Date().getTime();
      if(this.week){
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
             this.startDate=this.$Tool.getNowFormatDate((day-1));
             this.endDate=this.$Tool.timeForMat()
           }else if(day==1){
             this.startDate=this.$Tool.timeForMat()
             this.endDate=this.$Tool.timeForMat()
           }else if(day==0){
             this.startDate=this.$Tool.getNowFormatDate(6);
             this.endDate=this.$Tool.timeForMat()
           }
         }else{
           this.startDate=startText;
           this.endDate=endText;
         }
        this.weekText=this.startDate+' 至 '+this.endDate

      }else{
        this.startDate='';
        this.endDate='';
      }
      if(this.isHome){
        this.$emit('getPointTime')
      }
    },
  }
};
</script>
<style scoped>
  .time-right{
    display: flex;
    justify-content: flex-start;
  }
  .time-right>div{
    margin-right: 10px;
  }
  .contrast>div{
    display: inline-block;
  }
</style>

