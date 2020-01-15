import Vue from 'vue';
import Router from 'vue-router';
import Loading from 'components/loading';
import SideLayout from '@/layout/sideLayout';
/**
 *解决重复点击导航路由报错
 */
// const routerPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return routerPush.call(this, location).catch(error=> error)
// }

Vue.use(Router);
const Home = () => ({
    component: import('@/pages/home/index'),
    loading: Loading
});
const advisoryDetails = () => ({
    component: import('@/pages/advisoryDetails/index'),
    loading: Loading
});
const record = () => ({
    component: import('@/pages/record/index'),
    loading: Loading
});
const Login = () => ({
    component: import('@/pages/login/index'),
    loading: Loading
});
const chatRecord = () => ({
    component: import('@/pages/chatRecord/index'),
    loading: Loading
});
const chatDetail = () => ({
    component: import('@/pages/chatDetail/index'),
    loading: Loading
});
//权限设置
const permissions = () => ({
    component: import('@/pages/permissions/index'),
    loading: Loading
});
//会员运营分析
const memberOperation = () => ({
    component: import('@/pages/memberOperation/index'),
    loading: Loading
});
//新增会员概况
const generalSituation = () => ({
    component: import('@/pages/memberOperation/generalSituation/index'),
    loading: Loading
});
//报表明细
const reportDetails = () => ({
    component: import('@/pages/memberOperation/reportDetails/index'),
    loading: Loading
});
//群组管理
const groupManagement = () => ({
    component: import('@/pages/groupManagement/index'),
    loading: Loading
});


export default new Router({
    // mode: 'history',  //路由配置，不设置默认为hash
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: Login,
        },
        {
            path: '/',
            component: SideLayout,
            meta: { title: '区域' },
            children:[
                {
                    path: '/home',
                    component: Home,
                    meta: { title: '微信聊天记录分析' }
                },
                {
                    path: '/advisoryDetails',
                    component: advisoryDetails,
                    meta: { title: '微信聊天' }
                },
                {
                    path: '/record',
                    component: record,
                    meta: { title: '微信聊天' }
                },
                {
                    path:'/chatRecord',
                    component:chatRecord,
                    meta:{title:'微信聊天记录'}
                },
                {
                    path:'/chatDetail',
                    component:chatDetail,
                    meta:{title:'微信聊天内容'}
                },
                {
                    path:'/permissions',
                    component:permissions,
                    meta:{title:'权限设置'}
                },
                {
                    path:'/memberOperation',
                    component:memberOperation,
                    meta:{title:'会员运营分析'}
                },
                {
                    path:'/generalSituation',
                    component:generalSituation,
                    meta:{title:'新增会员概况'}
                },{
                    path:'/reportDetails',
                    component:reportDetails,
                    meta:{title:'报表明细'}
                },{
                    path:'/groupManagement',
                    component:groupManagement,
                    meta:{title:'群组管理'}
                }
            ],
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
