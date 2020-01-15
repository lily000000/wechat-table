<template>
  <div>
    <div class="search">
      <el-form class="clearfix search-form">
        <el-form-item label>
          <el-input placeholder="请输入姓名进行查询" v-model="params.userName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="onReset()">重置</el-button>
          <el-button type="success" @click="goBack">返回微信导入工具</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <el-table :data="tableData6" border style="width: 100%" v-loading="loading">
           <!-- <el-table-column
                type="index"
                :index="indexMethod" label="序号">
           </el-table-column> -->
            <el-table-column prop="index" label="序号"></el-table-column>
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="roleName" label="角色"></el-table-column>
            <el-table-column prop="range" label="当前数据权限范围">
                 <template slot-scope="scope">
                     <p v-if="scope.row.range"> 人员范围：
                        <span v-for="(item,index) in scope.row.range" :key="index">{{item}} </span>
                        <!-- <i v-if="index!=scope.row.range.length-1">,</i> -->
                     </p>
                     <p v-if="scope.row.startDate">时间范围：{{scope.row.startDate}} 至 {{scope.row.endDate}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="最后修改时间"></el-table-column>
            <el-table-column fixed="right" label="数据权限">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="onEditor(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="onSetPermission(scope.row)">设置权限</el-button>
            </template>
            </el-table-column>
        </el-table>
            <div class="pagination">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageNo"
                :page-sizes="[10, 20, 30, 50,100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                ></el-pagination>
            </div>
            </div>
        <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="500px" @close="onClose('form')">
            <el-form :model="form" :rules="rules" ref="form" label-width="80px">
                <el-form-item label="人员范围" prop="range">
                <el-select v-model="form.range" placeholder="请选择教育伙伴人员名单" style="width:230px" multiple
                    collapse-tags filterable @change = "onChange">
                    <el-option
                        v-for="(item,index) in partData"
                        :key="index"
                        :label="item.userName"
                        :value="item.userId"
                        ></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="时间范围" prop="timeData">
                <el-date-picker
                    v-model="timeData"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width:230px"
                    value-format="yyyy-MM-dd"
                    @change = 'onChangeTime'
                ></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="onClose('form')">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </div>
        </el-dialog>
        <set-permission :dialogVisible="dialogBackVisible" @onCancel="onBackClose" ref="permiss"></set-permission>
  </div>
</template>
<script>
import setPermission from "../setPermission";
import Cookie from "@/utils/cookie";
export default {
  components: {
    setPermission
  },
  data() {
    return {
      loading:true,
      tableData6:[],
      partData:[],
      pageNo: 1,
      pageSize: 10,
      total:0,
      timeData: "",
      dialogFormVisible: false,
      dialogBackVisible: false,
      tableData: [],
      params: {
        userName:'',
      },
      form: {
        endDate:'',
        startDate:'',
        range:[],
        userId:'',
      },
      rules: {
        range: [
          { required: true, message: "请选择人员范围", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
      const role = Cookie.getCookie('userId');
        if (!role ) {
        this.$router.push("/login");
        }
      this.getSystemUserList(this.params);
      this.getConsultantList();
  },
  methods: {
    onBackClose(e) {
      this.dialogBackVisible = false;
      // this.getOrderListReq();
    },
    onSetPermission(row){
      console.log(row)
      this.$refs.permiss.form.userId = row.userId;  
      this.dialogBackVisible = true;
    },
    onChangeTime(e){
        if(e){
          this.form.startDate = e[0];
          this.form.endDate = e[1];
        }else{
          this.form.startDate = '';
          this.form.endDate = ''; 
        }
    },
    onChange(e){
      this.form.range = e;
    },
    indexMethod(index) {
      return index+1; 
    },
    //获取成长顾问列表
    getConsultantList(){ 
      this.$API.getConsultantList().then(res => {
        const { data, msg, status } = res;
        if (status == 200) {
          this.partData = data;        
        }
      });
    },
       //获取用户数据权限
    getPermissionByUserId(params){
      this.$API.getPermissionByUserId(params).then(res => {
         const { data, msg, status } = res;
        if (status == 200) {
            if(data){
                this.form = Object.assign({},this.form,data);
                this.timeData =[data.startDate,data.endDate]  
            }else{
                this.timeData = [];
                this.form.startDate = '';
                this.form.endDate = '';
            }
             
        }
      });
    },
    //获取好友聊天记录
    getSystemUserList(params){
      this.$API.getSystemUserList(params).then(res => {
         const { data, msg, status } = res;
         this.loading = false;
        if (status == 200) {
            this.tableData = data;
            data.map((item,index)=>{
              item.index = index+1;
            })
            this.tableData6 = data;
            this.total = this.tableData6.length;
            this.pageNo = 1;
            this.tableCopyTableList = JSON.parse(JSON.stringify(this.tableData6));
            this.tableData6 = this.paging(this.pageSize, this.pageNo); 
        }
      });
    },
        //获取用户数据权限
    saveDataPermission(params){
      this.$API.saveDataPermission(params).then(res => {
        this.loadingStatus = false;
        const { data, msg, status } = res;
        if (status == 200) {
            this.dialogFormVisible = false;
            this.getSystemUserList(this.params);
            this.timeDate = [];
            this.form.startDate = [];
            this.form.endDate = [];
            this.$message({
              message: "编辑成功",
              type: "success"
            });
        }
      });
    },
    goBack() {
      let ipcRenderer = window.require("electron").ipcRenderer;
      if (window.require("electron")) {
        ipcRenderer && ipcRenderer.sendToHost("我已经收到消息了");
      }
    },
    search() {
        this.getSystemUserList(this.params);
    },
    onReset() {
      this.params.userName = "";
      this.getSystemUserList(this.params);
    },
    submitForm(formName) {     
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.saveDataPermission(this.form);            
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onClose(formName){
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
    },
    onEditor(row) {
      this.dialogFormVisible = true;
      const params ={
        userId:row.userId
      }
      this.form.userId = row.userId;
      this.getPermissionByUserId(params);

    },
    onAdd() {
      this.dialogFormVisible = true;
    },
    // 本地分页的方法
    paging(size, current) {
      const tableList = JSON.parse(JSON.stringify(this.tableCopyTableList));
      const tablePush = [];
      tableList.forEach((item, index) => {
        if (size * (current - 1) <= index && index <= size * current - 1) {
          tablePush.push(item);
        }
      });
      return tablePush;
    },
     //请求第几页
    handleCurrentChange(currentPage) {
      this.pageNo = currentPage;
      this.tableData6 = this.paging(this.pageSize, this.pageNo);
    },
    //每页展示多少条
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.tableData6 = this.paging(this.pageSize, this.pageNo);
    }
  }
};
</script>
<style  lang="scss" scope>
@import "./style.scss";
</style>