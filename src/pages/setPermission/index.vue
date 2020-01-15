<template>
  <div class="">
    <el-dialog :title="dialogTit" :visible="dialogVisible" width="600px" @close="onClose('form')">
      <el-form :model="form" label-position="left" ref="form" >
        <el-form-item label="" prop="checkAll">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            style="margin-left:30px"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" style="margin-left:30px">
            <el-checkbox v-for="(item,index) in menuData" :label="item.lable" :key="index">{{item.lable}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose('form')" class="btn-reset">取 消</el-button>
        <el-button
          type="primary"
          @click="onSubmit('form')"
          class="btn-search"
          style="margin-left:23px"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Cookie from "@/utils/cookie";
export default {
  props: {
    dialogVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      checkAll: false,
    //   checkedCities: ["微信聊天记录", "数据分析"],
      checkedCities: [],
      menuData: [{lable:"微信聊天记录详情",value:1}, {lable:"数据分析",value:2}, {lable:"群组管理", value:3},{lable:"权限设置", value:4}],
      menuList:["微信聊天记录详情","数据分析","群组管理","权限设置"],
      isIndeterminate: false,
      dialogTit: "设置权限",
      form: {
        permissions: [],
        userId:null,
      }
    };
  },
  watch:{
    dialogVisible(newValue){
      if(newValue){
        this.getNavPermission();
      }

    },

  },
  methods: {
    handleCheckAllChange(val) {
        let menuArr = [];
        this.menuData.map((item,index)=>{
            menuArr.push(item.lable);
        })
      this.form.permissions = menuArr
      this.checkedCities = val ? menuArr : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      var mix = this.menuList.filter(function(item){
          return value.indexOf(item) != -1
      });
      this.form.permissions = mix;
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.menuData.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.menuData.length;
    },
    onClose(form) {
      this.$refs["form"].resetFields();
      this.$emit("onCancel");
      this.form.permissions=[];
      this.checkedCities = [];
      this.checkAll = false;
      // this.getSysUserTeach();
      // this.resetForm();
    },
    onSubmit() {
      console.log(this.form.permissions);
      if(this.form.permissions.length==0){
        this.$message.warning("请设置权限");
      }else{
        this.saveMenuPermission();
      }
    },
    //获取权限
    getNavPermission(res) {
      const params = { userId: this.form.userId };
      this.$API.getPermissionListByUserId(params).then(res => {
        const { data, msg, status } = res;
        this.checkedCities = data;
        if(data.length>0){
          this.checkAll = true;
          this.form.permissions = data;
        }
       
       
      })
    },
    //设置权限
    saveMenuPermission() {
      this.$API.saveMenuPermission(this.form).then(res => {
        const { data, msg, status } = res;
        if (status == 200) {
          //console.log('哈哈哈',data)
          this.$message.warning("保成功存");
          this.$emit("onCancel");
          this.form.permissions = [];
          this.checkedCities = [];
          this.checkAll = false;
        } else {
          this.$message.warning(msg);
        }
      });
    },
  }
};
</script>
<style  lang="scss" >
@import "./style.scss";
</style>