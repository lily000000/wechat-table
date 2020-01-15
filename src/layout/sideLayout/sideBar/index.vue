<template>
  <div class="sidebar" id="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import _ from "loadsh";
import Cookie from "@/utils/cookie";
export default {
  data() {
    return {
      collapse: false,
      items: [],
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
          component:null,
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
          icon: "el-icon-s-tools",
          index: "permissions",
          id:'02',
          component:"permissions",
          title: "权限设置"
      },
    ]
    };
  },
  mounted() {

    // if(Cookie.getCookie('userId')==1){
    //   this.items = menuList;
    // }else{
    //   this.items.push(menuList[0]);
    // }
    console.log(this.items)
    this.getNavPermission();
    
  },
  methods: {
    getNavPermission(res) {
      const params = { userId: Cookie.getCookie("userId") };
      this.$API.getPermissionListByUserId(params).then(res => {
        const { data, msg, status } = res;
        let menuListArry = [];
          _.each(data,(item)=>{
            let objArr =  _.find(this.menuList, ["title", item]);  
            if(objArr){
              menuListArry.push(objArr)

            }
          })
          this.items = menuListArry;
           console.log(menuListArry)
      })
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    this.$root.Bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  }
};
</script>

<style scoped>
.sidebar .el-submenu .el-menu-item {
  padding-left: 60px !important;
}
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
  background-color: rgb(50, 65, 87);
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 190px;
}
.sidebar > ul {
  height: 100%;
}
</style>
