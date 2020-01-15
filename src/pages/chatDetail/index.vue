<template>
  <div class="box-wrap">
    <!-- <p>聊天记录详情</p> -->
    <div class="search">
      <el-form class="clearfix search-form" ref="form" :model="form">
        <el-form-item label="筛选日期：">
          <el-date-picker
            v-model="time"
            value-format="yyyy-MM-dd"
            type="daterange"
            @change="onTime"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:230px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label>
          <el-select v-model="form.type" placeholder="微信昵称（微信名）">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-input placeholder="请输入关键字进行查询" v-model="form.keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="onReset('form')">重置</el-button>
          <el-button type="success" @click="goBack">返回微信导入工具</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card class="box-card" v-loading="loading">
      <div class="nav-container">
        <div class="nav-left" v-loading="partLoading" style="height:100%">
          <ul class="nav-row" style="height:100%">
            <li
              v-for=" (item,index) in wxPartData"
              :key="index"
              :class="['nav-col',{active:index==isPartActive}]"
              @click="onPartDetail(index,item.wechat)"
            >
              <div class="nav-cont">
                <p class="nav-msg" style="width:100px;">{{item.userName}}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="nav-left" style="width:350px" v-loading="loadingStatus">
          <ul class="nav-title">
            <el-radio-group v-model="tabStatus" style="margin-bottom: 30px;">
              <el-radio-button label="1">
                个人
                <span v-if="wechatData.length>0">（{{wechatData.length}}）</span>
              </el-radio-button>
              <el-radio-button label="2">群组</el-radio-button>
            </el-radio-group>
          </ul>
          <ul class="nav-row">
            <li
              v-for=" (item,index) in wechatData"
              :key="index"
              :class="['nav-col',{active:index==isActive}]"
              @click="onDetail(index,item)"
            >
              <div class="nav-avatar">
                <img
                  src="http://wx.qlogo.cn/mmhead/ver_1/3aTvRPBsdZRnFpibq7GY2c2yDvtENmjyPbNkQGZkxxEyDXzla5jL0So7nYfzZMhicndQZavIFt8iazKMaB4bZRM2A/96"
                />
              </div>
              <div class="nav-cont">
                <p class="nav-msg">{{item.wechatName}}</p>
              </div>
              <p class="nav-item">{{item.latestTime}}</p>
            </li>
          </ul>
        </div>
        <div class="nav-right">
          <div class="wx-container">
            <div v-for="(item,index) in chatRecordData" :key="index" :id="'list'+index">
              <div class="wx-row wx-msg-row--other" v-if="item.msgType == '1'">
                <div class="wx-msg">
                  <div class="wx-layout__item wx-msg__user-logo">
                    <img
                      src="http://wx.qlogo.cn/mmhead/ver_1/3aTvRPBsdZRnFpibq7GY2c2yDvtENmjyPbNkQGZkxxEyDXzla5jL0So7nYfzZMhicndQZavIFt8iazKMaB4bZRM2A/96"
                    />
                  </div>
                  <div class="wx-layout__item wx-msg__content">
                    <div class="wx-msg__username">{{item.senderComments}}</div>
                    <div class="wx-msg__body">
                      <div class="wx-state--deleted"></div>
                      <div class="wx-state--error"></div>
                      <span class="keywords">{{item.msgContent}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="wx-row wx-sys-row--date" v-if="item.msgType == 3">
                <div class="wx-sys-row__item">
                  <!-- <p class="wx-date">{{item.msgContent}}</p> -->
                  <el-divider>{{item.msgContent}}</el-divider>
                </div>
              </div>
              <div class="wx-row wx-sys-row--date" v-if="item.msgType ==4">
                <div class="wx-sys-row__item">
                  <p class="wx-date">{{item.msgContent}}</p>
                </div>
              </div>
              <div class="wx-row wx-msg-row--me" v-if="item.msgType =='2'">
                <div class="wx-msg">
                  <div class="wx-layout__item wx-msg__content">
                    <div class="wx-msg__username">{{item.senderComments}}</div>
                    <div class="wx-msg__body">
                      <div class="wx-state--deleted"></div>
                      <div class="wx-state--error"></div>
                      <span class="keywords">{{item.msgContent}}</span>
                    </div>
                  </div>
                  <div class="wx-layout__item wx-msg__user-logo">
                    <img
                      src="http://wx.qlogo.cn/mmhead/ver_1/3aTvRPBsdZRnFpibq7GY2c2yDvtENmjyPbNkQGZkxxEyDXzla5jL0So7nYfzZMhicndQZavIFt8iazKMaB4bZRM2A/96"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import Cookie from "@/utils/cookie";
import $ from "jquery";

export default {
  data() {
    return {
      partLoading: true,
      loadingStatus: true,
      isPartActive: 0,
      tabStatus: 1,
      isActive: 0,
      form: {
        wechat: "",
        keyword: "",
        endDate: "",
        startDate: "",
        type: "1",
        userId: Cookie.getCookie("userId")
      },
      time: [],
      startDate: "",
      endDate: "",
      options: [
        {
          value: "1",
          label: "微信昵称（微信名）"
        },
        {
          value: "2",
          label: "微信备注"
        },
        {
          value: "3",
          label: "微信号"
        },
        {
          value: "4",
          label: "微信内容"
        }
      ],
      wxPartData: [],
      wechatData: [],
      chatRecordData: [],
      chatId: "",
      loading: false
    };
  },
  mounted() {
    this.getConsultantList();
    const role = Cookie.getCookie("userId");
    if (!role) {
      this.$router.push("/login");
    }
  },
  methods: {
    //获取成长顾问列表
    getConsultantList() {
      this.loading = true;
      const params = this.form;
      // console.log('获取成长顾问',this.form)
      this.$API.getConsultantList(params).then(res => {
        this.partLoading = false;
        const { data, msg, status } = res;
        if (status == 200) {
          this.wxPartData = data;

          this.wechatData = [];
          this.chatRecordData = [];
          if (data.length > 0) {
            this.getContactListReq(data[0].wechat);
            this.form.wechat = data[0].wechat;
          }
        }
      });
    },
    //获取好友列表
    getContactListReq(wechatId) {
      this.loading = true;
      const params = Object.assign({}, this.form, { wechat: wechatId });
      this.$API.getContactList(params).then(res => {
        this.loadingStatus = false;
        const { data, msg, status } = res;
        if (status == 200) {
          this.wechatData = data;
          if (data) {
            this.wechatData.map((item, index) => {
              item.latestTime = item.latestTime.substring(11, 16);
            });
          }
          if (data.length == 0) {
            this.chatRecordData = [];
          } else {
            // data[0].type = '';
            data[0].wechat = wechatId;
            data[0].userId = Cookie.getCookie("userId");
            this.getChatByGroup(data[0]);
          }
        }
      });
    },
    //获取好友聊天记录
    getChatByGroup(params) {
      this.loading = true;
      this.$API.getChatRecordByGroup(params).then(res => {
        const { data, msg, status } = res;
        if (status == 200) {
          this.loading = false;
          this.chatRecordData = data;
          if (this.form.keyword != "" && this.form.type == 4) {
            $(".nav-right").scrollTop(0);
            for (let i = 0; i < this.chatRecordData.length; i++) {
              if (this.chatRecordData[i].msgContent.indexOf(this.form.keyword) !=-1) {
                let reg = new RegExp(this.form.keyWords, "g");
                this.chatId = i;
                let chatId = "list" + this.chatId;
                let replaceString = `<i style="color:red;font-style:normal;">${this.form.keyword}</i>`;

                if (this.chatRecordData[i].msgContent.match(reg)) {
                  this.chatRecordData[i].msgContent = this.chatRecordData[i].msgContent.replace(this.form.keyword, replaceString);
                }
                let cont = `<p>${this.chatRecordData[i].msgContent}</p>`;
                $(function() {
                  $("#" + chatId)
                    .find(".keywords")
                    .html(cont);
                  let top = $("#" + chatId).offset().top - 200;
                  $(".nav-right").scrollTop(top);
                });

                return;
              }
            }
          }
        }
      });
    },
    onPartDetail(index, wechat) {
      this.isPartActive = index;
      this.form.wechat = wechat;
      this.getContactListReq(wechat);
    },
    //切换好友列表
    onDetail(index, item) {
      this.isActive = index;
      // delete item.latestTime;
      // item.consultant = this.form.consultant;
      item.userId = Cookie.getCookie("userId");
      this.getChatByGroup(item);
    },
    search() {
      this.isActive = 0;
      this.getConsultantList();
      // this.getContactListReq(this.form.wechat);
      // console.log(this.form)
    },
    onTime(e) {
      if (e) {
        this.form.startDate = e[0];
        this.form.endDate = e[1];
      } else {
        this.form.endDate = "";
        this.form.startDate = "";
      }
    },
    goBack() {
      let ipcRenderer = window.require("electron").ipcRenderer;
      if (window.require("electron")) {
        ipcRenderer && ipcRenderer.sendToHost("我已经收到消息了");
      }
    },
    onReset(form) {
      this.$refs[form].resetFields();
      this.form.keyword = "";
      this.form.startDate = "";
      this.form.endDate = "";
      this.form.type = "1";
      this.time = [];
      // console.log(this.form)
      this.getConsultantList();

      // this.getContactListReq(this.form.wechat);
    }
  }
};
</script>
<style  lang="scss" >
@import "./style.scss";
.el-divider__text {
  background-color: #f5f5f5;
}
</style>