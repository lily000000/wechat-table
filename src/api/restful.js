export default {
    getLineList: {  //获取操作日志
        method: 'get',
        url: '/chat/getIndicatorsByDate'
    },
    getIndicatorDetail: {  //获取微信号率
        method: 'get',
        url: '/chat/getIndicatorDetail'
    },
    getContactList: {  //获取教育伙伴通讯录列表
        method: 'get',
        url: '/chat/getContactListByConsultant'
    },
    getChatRecordByGroup: {  //获取教育伙伴分组聊天记录
        method: 'get',
        url: '/chat/getChatRecordByGroup'
    },
    getConsultantList: {  //获取成长顾问和顾问主管列表
        method: 'get',
        url: '/chat/getConsultantList'
    },
    getSystemUserList: {  //获取CRM系统用户
        method: 'get',
        url: '/chat/getSystemUserList'
    },
    getPermissionByUserId: {  
        method: 'get',
        url: '/chat/getDataPermissionByUserId'
    },
    saveDataPermission: {  
        method: 'post',
        url: '/chat/saveDataPermission'
    },
    
    loginReq:{
        method:'post',
        url:'/chat/login'
    },

    /********************* 数据分析******************/
    getGroupContact:{//获取群组名称
        method:'post',
        url:'/analysis/getGroupContact'
    },
    
    getWorkSummaryData:{
        method:'get',
        url:'/mock/asyData.json'
    },
    getWorkLineData:{
        method:'get',
        url:'/mock/echsrtsData.json'
    },

    
    
    getGroupIndicatorSummary:{//获取群组会员数据总览
        method:'post',
        url:'/chat/getGroupIndicatorSummary'
    },
    getGroupIndicatorTrend:{//获取群组会员趋势图
        method:'post',
        url:'/chat/getGroupIndicatorTrend'
    },
    getGroupIndicatorTable:{//获取群组会员报表
        method:'post',
        url:'/chat/getGroupIndicatorTable'
    },
    getGroupList:{//根据类型获取社群列表
        method:'get',
        url:'/chat/getGroupList'
    },
    getGroupLatestDateByCycle:{//获取群组聊天记录最新记录日期
        method:'post',
        url:'/chat/getGroupLatestDateByCycle'
    },
    

  /****************** 社群管理*********************/
    manageGroupList:{ //根据类型获取社群列表
        method:'get',
        url:'/chat/manageGroupList'
    },
    updateGroupType:{ //设置群组类型
        method:'post',
        url:'/chat/updateGroupType'
    },
    updateGroupChargeUser:{ //设置群组类型
        method:'post',
        url:'/chat/updateGroupChargeUser'
    },
    getGroupUserList:{ //设置群组类型
        method:'get',
        url:'/chat/getGroupUserList'
    },
    saveMenuPermission:{ //保存菜单权限
        method:'post',
        url:'/chat/saveMenuPermission'
    },
    getPermissionListByUserId:{ //根据用户编号获取用户菜单权限
        method:'get',
        url:'/chat/getPermissionListByUserId'
    },
    
    
    
}


