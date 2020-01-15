<template>
  <div class="table_detail">
    <p class="table_tit">{{title}}报表</p>
    <el-table
      :data="tableDataFormat"
      border
      style="width: 100%; margin-top: 20px"
      v-loading="loading"
      :header-cell-style="{background:'#F3F4F7',color:'#555'}"
    >
      <el-table-column
        :prop="item.key"
        :label="item.title"
        v-for="(item,index) in columns"
        :key="index"
      >
        <template slot-scope="scope">
          <p>{{scope.row[item.key]||scope.row[item.key]==0?scope.row[item.key]:'/'}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="status">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goDetails(scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 50,100]"
        :page-size="params.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      status: true,
      title: "",
      loading: true,
      currentPage4: 1,
      tableData: [],
      columns: [],
      tableCopyTableList: [],
      tableDataFormat: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      params: {
        type: null
      }
    };
  },
  mounted() {
    this.title = this.$route.query.title ? this.$route.query.title : "";
    this.params.type = this.$route.query.orderType
      ? this.$route.query.orderType
      : "";
    if (this.params.type == 3 || this.params.type == 4) {
      this.status = true;
    } else {
      this.status = false;
    }
    this.$root.Bus.$on("timeParams", res => {
      this.params = Object.assign(res, this.params);
      this.getGroupUserAddReport();
    });
  },
  methods: {
    goDetails(row) {
      console.log(row);
      this.$router.push({
        path: "/reportDetails",
        query: {
          startDate: row.date,
          endDate: row.date,
          group: row.group,
          dateCycle: this.params.dateCycle,
          type: this.params.type
        }
      });
    },
    getGroupUserAddReport() {
      this.loading = true;
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
  },
  beforeDestroy() {
    this.$root.Bus.$off("timeParams");
  }
};
</script>
<style lang="scss" scope>
@import "./style.scss";
</style>