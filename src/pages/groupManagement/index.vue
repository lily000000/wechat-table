<template>
  <div class=" table_item">
    <el-row>
      <el-col>
        <el-card shadow="hover" style>
          <p class="table_tit">社群管理</p>
          <el-table :data="tableDataFormat" style="width: 100%" border v-loading="loading">
            <el-table-column prop="createTime" label="群组创建时间" width="180"></el-table-column>
            <el-table-column prop="groupName" label="群组名称" width="180"></el-table-column>
            <el-table-column prop="type" label="群组类型" width="180"></el-table-column>
            <el-table-column prop="retain" label="留存会员"></el-table-column>
            <el-table-column prop="charge" label="当前负责人"></el-table-column>
            <el-table-column fixed="right" label="操作" width="400">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">设置群组类型</el-button>
                <el-button type="text" size="small" @click="onGroup(scope.row)">分配群组负责人</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNo"
              :page-sizes="[10, 20, 30, 50,100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="设置群组类型" :visible="dialogFormVisible" width="500px" @close="onClose('form')">
      <el-form :model="form" >
        <el-form-item label="群组类型" >
          <el-select v-model="form.region" placeholder="请选择群组类型">
            <el-option label="机构社群" value="1"></el-option>
            <el-option label="会员社群" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose('form')">取 消</el-button>
        <el-button type="primary" @click="onSublime('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配群组负责人" :visible="dialogPartVisible" width="500px" @close="onClosePeople('form')">
      <el-form :model="form">
        <el-form-item label="群组负责人">
          <el-select
            v-model="form.chargeUser"
            placeholder="请选择群组负责人"
            style="width:230px"
            collapse-tags
            filterable
            @change="onChange"
          >
            <el-option
              v-for="(item,index) in partData"
              :key="index"
              :label="item.userName"
              :value="item.userName"
            ></el-option>
          </el-select>
          <!-- <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="机构社群" value="0"></el-option>
            <el-option label="会员社群" value="1"></el-option>
          </el-select>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClosePeople('form')">取 消</el-button>
        <el-button type="primary" @click="onSublimePeople('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading:true,
      rules: {
        region: [
          {
            required: true,
            message: "请选择群组类型",
            trigger: ["blur", "change"]
          }
        ]
      },
      tableDataFormat: [],
      tableCopyTableList: [],
      dialogPartVisible: false,
      partData: [],
      dialogFormVisible: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      groupName:"",
      chargeUser:"",
      form: {
        region: "",
        chargeUser:""
      },
      currentPage4: 1,
      tableData: []
    };
  },
  mounted() {
    this.getlistReq();
    this.getConsultantList();
  },
  methods: {
    onSublime() {
      if(this.form.region==""){
        this.$message.warning('请选择群组类型')
        return
      }else{
        this.updateGroupType()
      } 
    },
    onSublimePeople(){
       if(this.form.chargeUser==""){
        this.$message.warning('请选择群组负责人')
        return
      }else{
        this.updateGroupChargeUser()
      } 

    },
    onClosePeople(){
      this.dialogPartVisible = false;
      this.form.chargeUser = "";

    },
    onClose() {
      this.dialogFormVisible = false;
      this.form.region = "";
    },
    onGroup(row) {
      this.groupName = row.groupName;
      this.dialogPartVisible = true;
    },
    //设置群组类型
    updateGroupType() {
      const params = {
        groupName:this.groupName,
        type:this.form.region
      }
      this.$API.updateGroupType(params).then(res => {
        const { data, msg, status } = res;
        if (status == 200) {
          this.form.region = "";
          this.dialogFormVisible = false;
          this.$message.success("设置成功");
           this.getlistReq();

        }else{
          this.$message.warning(msg);
        }
      });
    },
    //设置分组负责人
    updateGroupChargeUser() {
      const params = {
        groupName:this.groupName,
        chargeUser:this.form.chargeUser
      }
      this.$API.updateGroupChargeUser(params).then(res => {
        const { data, msg, status } = res;
        if (status == 200) {
          this.form.chargeUser = "";
          this.dialogPartVisible = false;
          this.$message.success("设置成功");
          this.dialogPartVisible = false;
          this.getlistReq();
        }else{
          this.$message.warning(msg);
        }
      });
    },
    //获取成长顾问列表
    getConsultantList() {
      this.$API.getGroupUserList().then(res => {
        const { data, msg, status } = res;
        if (status == 200) {
          this.partData = data;
        }
      });
    },
    getlistReq() {
      this.$API.manageGroupList().then(res => {
        const { data, msg, status } = res;
        this.loading = false;
        if (status == 200) {
          this.tableData = data;
          this.tableDataFormat = data;
          this.total = this.tableDataFormat.length;
          this.tableCopyTableList = JSON.parse(
            JSON.stringify(this.tableDataFormat)
          );
          this.tableDataFormat = this.paging(this.pageSize, this.pageNo);
          this.getSpanArr(this.tableDataFormat);
        }
      });
    },
    // getConsultantList() {
    //   this.$API.manageGroupList().then(res => {
    //     const { data, msg, status } = res;
    //     if (status == 200) {
    //       this.tableData = data;

    //       this.tableDataFormat = data;
    //       this.total = this.tableDataFormat.length;
    //       this.tableCopyTableList = JSON.parse(
    //         JSON.stringify(this.tableDataFormat)
    //       );
    //       this.tableDataFormat = this.paging(this.pageSize, this.pageNo);
    //       this.getSpanArr(this.tableDataFormat);

    //     }
    //   });
    // },
    onChange(e) {},
    handleClick(row) {
      this.groupName = row.groupName 
      this.dialogFormVisible = true;
    },
    getSpanArr(data) {
      this.spanArr = []; //置空
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断cycle当前元素与上一个元素是否相同
          if (data[i].cycle === data[i - 1].cycle) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
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
      this.tableDataFormat = this.paging(this.pageSize, this.pageNo);
    },
    //每页展示多少条
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      console.log(pageSize);
      this.tableDataFormat = this.paging(this.pageSize, this.pageNo);
    }
  }
};
</script>
<style lang="scss" scope>
@import "./style.scss";
</style>