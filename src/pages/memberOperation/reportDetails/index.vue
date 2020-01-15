<template>
  <div class="table_details">
    <el-row>
      <el-col>
        <el-card shadow="hover" style>
          <div class="table_head">
            <p class="table_tit">报表明细：{{headTitle}}</p>
            <el-button type="primary" @click="exportExcel" class="exportbtn">导出excel</el-button>
          </div>

          <el-table :data="tableDataFormat" style="width: 100%" border v-loading="loading">
            <el-table-column
              :prop="item.key"
              :label="item.title"
              v-for="(item,index) in columns"
              :key="index"
            >
              <template slot-scope="scope">
                <el-popover placement="top-start" trigger="hover" width="200" popper-class="scrool_class" v-if="item.key=='lastMsg'">
                  <div class="text-cont">
                    <p  v-if="item.key=='lastMsg'">{{scope.row[item.key]||scope.row[item.key]==0?scope.row[item.key]:'/'}}</p>
                  </div>
                  <div slot="reference">
                    <P
                      class="ellipsis"
                      v-if="item.key=='lastMsg'"
                    >{{scope.row[item.key]||scope.row[item.key]==0?scope.row[item.key]:'/'}}</P>
                  </div>
                </el-popover>
                <p v-else>{{scope.row[item.key]||scope.row[item.key]==0?scope.row[item.key]:'/'}}</p>

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
  </div>
</template>
<script>
export default {
  data() {
    return {
      headTitle: "",
      loading: true,
      tableDataFormat: [],
      columns: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      params: {
        groupType: "",
        dateCycle: "DAY",
        startDate: "",
        endDate: "",
        groups: [],
        type: 31
      },
      currentPage4: 1,
      tableData: []
    };
  },
  mounted() {
    this.params.dateCycle = this.$route.query.dateCycle
      ? this.$route.query.dateCycle
      : "";
    this.params.startDate = this.$route.query.startDate
      ? this.$route.query.startDate
      : "";
    this.params.endDate = this.$route.query.endDate
      ? this.$route.query.endDate
      : "";
    this.headTitle = this.$route.query.group ? this.$route.query.group : "";
    if (this.$route.query.type == 3) {
      this.params.type = 31;
    } else if (this.$route.query.type == 4) {
      this.params.type = 41;
    } else if (this.$route.query.type == 10) {
      this.params.type = 11;
    }
    if (this.$route.query.group) {
      this.params.groups.push(this.$route.query.group);
    }
    this.getGroupUserAddReport();
  },
  methods: {
    //导出的方法
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/utils/excel/Export2Excel");
        // 上面设置Excel的表格第一行的标题
        let tHeader = [];
        // 上面的index、nickName、name是tableData里对象的属性
        let filterVal = [];
        this.columns.map((item, index) => {
          tHeader.push(item.title);
          filterVal.push(item.key);
        });
        const list = this.tableDataFormat; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, this.excelName);
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    getGroupUserAddReport() {
      this.$API.getGroupIndicatorTable(this.params).then(res => {
        console.log(res);
        this.loading = false;
        const { status, data, msg } = res;
        if (status == 200) {
          console.log(data);
          this.tableData = data.data;
          this.columns = data.cols;
          if (data.data) {
            this.tableDataFormat = data.data;
            this.total = this.tableDataFormat.length;
            this.tableCopyTableList = JSON.parse(
              JSON.stringify(this.tableDataFormat)
            );
            this.tableDataFormat = this.paging(this.pageSize, this.pageNo);
            this.getSpanArr(this.tableDataFormat);
          }
        } else {
        }
      });
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
      this.tableDataFormat = this.paging(this.pageSize, this.pageNo);
    }
  }
};
</script>
<style lang="scss" scope>
@import "./style.scss";
</style>