<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">微信聊天管理系统</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
        <el-form-item prop="userName">
          <el-input v-model="ruleForm.userName" placeholder="请输入用户名">
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            show-password
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Cookie from "@/utils/cookie";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data: function() {
    return {
            menuList:[
      // {
      //   icon: "el-icon-s-home",
      //   index: "home",
      //   id: "01",
      //   component: "home",
      //   title: "微信聊天记录分析",
      // },
      // {
      //     icon: "el-icon-s-marketing",
      //     index: "record",
      //     id:'02',
      //     component:null,
      //     title: "微信聊天导入记录"
      // },
      {
          icon: "el-icon-document",
          index: "chatDetail",
          id:'02',
          component:"chatDetail",
          title: "微信聊天记录详情"
      },
      {
          icon: "el-icon-s-data",
          index: "member",
          id:'03',
          component:"member",
          title: "数据分析",
          subs: [
            {
              component: "memberOperation",
              index: "memberOperation",
              id: "031",
              comments: "会员运营分析",
              title:'会员运营分析',
              name: "会员运营分析"
            }
          ]
      },
        {
          icon: "el-icon-s-custom",
          index: "group",
          id:'04',
          component:"group",
          title: "群组管理",
          subs: [
            {
              component: "groupManagement",
              index: "groupManagement",
              id: "041",
              comments: "社群管理",
              title:'社群管理',
              name: "社群管理"
            }
          ]
      },
      
       {
          component:"permissions",
          icon: "el-icon-s-tools",
          index: "permissions",
          id:'02',
          title: "权限设置"
      },
    ],
      ruleForm: {
        userName: "",
        password: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  mounted () {
    if(localStorage.getItem("ms_username")){
      this.ruleForm.userName = localStorage.getItem("ms_username");
    }
    if(localStorage.getItem("ms_upassword")){
      this.ruleForm.password = localStorage.getItem("ms_upassword");
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          localStorage.setItem("ms_username", this.ruleForm.userName);
          localStorage.setItem("ms_upassword", this.ruleForm.password);
          this.loginSubmit(this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    loginSubmit(params) {
      // if(params.userName!='admin'){
      //   this.$message.error('账号不存在')
      //   return
      // }else if(params.userName=='admin' && params.password!='123456'){
      //   this.$message.error('账号密码错误')
      //   return
      // }
      // if(params.userName=='admin' && params.password=='123456'){
      //   Cookie.setCookie("token", '321321');
      //   this.$router.push("home");
      // }
      this.$API.loginReq(params).then(res => {
        const { data, msg, status } = res;
         console.log("登陆", res);
            if (status == 200) {
                if(Object.keys(data).length>0){
                  Cookie.setCookie("userId",data.userId);
                  localStorage.setItem("realName", data.userName);
                  this.getNavPermission(data.userId)
                  // this.$router.push("/chatDetail");
                }else{
                  this.$message.error('账号密码错误')
                }            
            }else{
              this.$router.push("home");    
            }
      });
    },
 getNavPermission(id) {
      const params = { userId:id };
      this.$API.getPermissionListByUserId(params).then(res => {
        const { data, msg, status } = res;
        let menuListArry = [];
          _.each(data,(item)=>{
            let objArr =  _.find(this.menuList, ["title", item]);
           
            if(objArr){
              menuListArry.push(objArr)

            }
          })
          if(menuListArry.length>0){  
            for(var i=0;i<menuListArry.length;i++){
              if(menuListArry[i].subs){
                const name = menuListArry[i].subs[0].component
                console.log(menuListArry[i].subs[0])
                this.$router.push(`/${name}`);
                return;
              }else{
                const name = menuListArry[0].component
                console.log(name)
                this.$router.push(`/${name}`);
                return;
              }

            } 
            // menuListArry.map((item,index)=>{
            //   if(item.subs){
            //     const name = item.subs[0].component
            //     console.log(item.subs[0])
            //     this.$router.push(`/${name}`);
            //   }else{
            //     const name = item.component
            //     this.$router.push(`/${name}`);
            //   }

            // })
             
          }
          // this.items = menuListArry;
           console.log(111,menuListArry)
      })
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>