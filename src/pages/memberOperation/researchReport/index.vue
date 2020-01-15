<template>
  <div class="rese_report" v-loading>
    <div class="head clearfix">
         <div class="head-title">
          <p>会员运营报表</p>
          <!-- <noun-annotations :typeNum="typeNum"></noun-annotations> -->
        </div>
      <div class="head-left" style="display: flex;justify-content: flex-end;margin-bottom:20px">
        <div class="head-right type_item">
          <query-conditions ref="queryConditions" :timeFilter="timeFilter"></query-conditions>
          <div class="export-btn">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="exportExcel">导出excel</el-button>
          </div>
        </div>
      </div>
      <ul class="data-analyze" v-loading="loading">
        <el-table :data="tableDataFormat" border style="width: 100%">
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

          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="goDetails(scope.row)" type="text" size="small">明细</el-button>
            </template>
          </el-table-column>
        </el-table>
      </ul>
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
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import localDb from "@/utils/localDb.js";
import queryConditions from "@/components/queryConditions/index.vue";

export default {
  components: {
    queryConditions
  },
  data() {
    return {
      timeFilter: false,
      tableData: [],
      formTitle: "",
      loading: true,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tableData6: [],
      spanArr: [], //存放每一行记录的合并数
      cycle: "DAY",
      columns: [],
      tableDataFormat: [],
      tableCopyTableList: [],
      params: {
        dateCycle: "WEEK",
        type: 10
      },
      optionsTest: []
    };
  },
  computed: {
    ...mapState({
      listByCodes: state => state.global.listByCodes
    })
  },
  mounted() {
    this.$root.Bus.$emit("timeFilter", this.timeFilter);
    this.params = Object.assign(
      this.$refs.queryConditions.changeParams(),
      this.params
    );
    console.log("时间", this.params);

    // this.getFlowStateReq(this.params);
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
        console.log(this.columns);
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
    goDetails(row) {
      console.log(row);
      this.$router.push({
        path: "/reportDetails",
        query: {
          startDate: this.params.startDate,
          endDate: this.params.endDate,
          group: row.group,
          dateCycle: this.params.dateCycle,
          type: this.params.type
        }
      });
    },
    getGroupUserAddReport() {
      this.$API.getGroupIndicatorTable(this.params).then(res => {
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
    },
    search() {
      this.params = Object.assign(
        this.params,
        this.$refs.queryConditions.changeParams()
      );
      this.loading = true;
      this.getGroupUserAddReport(this.params);
    }
  }
};
</script>
<style lang="scss">
@import "./style.scss";
</style>