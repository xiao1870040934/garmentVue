<template>
  <div>
      <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="服装名称" width="120">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="货号" width="120">
          <template slot-scope="scope">{{ scope.row.number }}</template>
        </el-table-column>
        <el-table-column label="数量" width="120">
          <template slot-scope="scope">{{ scope.row.count }}</template>
        </el-table-column>
        <el-table-column label="尺寸" width="120">
          <template slot-scope="scope">{{ scope.row.size }}</template>
        </el-table-column>
        <el-table-column label="颜色" width="120">
          <template slot-scope="scope">{{ scope.row.color }}</template>
        </el-table-column>
        <el-table-column label="出库数量" width="120">
          <template slot-scope="scope">{{ scope.row.outCount }}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px; textAlign: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pageSize"
        :total="total"
        layout=" prev, pager, next, jumper, ->, total, sizes">
      </el-pagination>
      <!-- 出库表单 -->
      <el-form :model="addForm" label-width="80px" style="display:flex" ref="addFormRef" :rules="addFromRules" v-show="multipleSelection.length!==0">
        <el-form-item label="所出仓库" prop="storage">
          <el-input v-model="addForm.storage" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="经办人" prop="agent">
          <el-input v-model="addForm.agent" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="from">
          <el-input v-model="addForm.towhere" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出库时间" prop="addTime">
          <el-date-picker
            v-model="addForm.outTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择入库日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-circle-check" style="margin:10px 0px;float:right"  @click="addFormConfirm" v-show="detail.length!==0">提交</el-button>
  </div>
</template>

<script>
export default {
    name:'outwarehouseManage',
    data() {
      return {
        list:[],
        pageNum: 1,
        pageSize: 5,
        total: 0,
        pickerOptions: {
            // 限制时间不让选择今天以前的
            disabledDate(time) {
                return time.getTime() > Date.now() - 8.64e7;
            }
        },
        addForm: {
          storage:'',
          agent: '',
          outTime: '',
          remark: '',
          detail: []
        },
        addFromRules:{
          storage:[
            { required: true, message: '请输入所出仓库', trigger: 'blur' }
          ],
          agent:[
            { required: true, message: '请输入经办人', trigger: 'blur' }
          ],
          from:[
            { required: true, message: '请输入客户', trigger: 'blur' }
          ],
          addTime:[
            { required: true, message: '请选择出库日期', trigger: 'blur' },
            { validator: checkreturnTime, trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.getPageList()
    },
    methods: {
      async getPageList() {
        let result= await this.$API.goodsManage.reqGoodListPage(this.pageNum,this.pageSize)
        if(result.code === 200){
          this.total = parseInt(result.data.total)
          this.list = result.data.list;
        }
      },
      handleSelectionChange(val) {
        this.adddForm.detail = val;
        console.log(this.adddForm.detail)
      },
      handleSizeChange(newSize) {
        this.pageSize = newSize;
        this.getPageList();
      },
      handleCurrentChange(newPage) {
        this.pageNum = newPage
        this.getPageList();
      },
      addFormConfirm() {
        this.$refs.addFormRef.validate(async valid => {
          if (valid) {
            let result= await this.$API.outwharehouse.OutStock(this.addForm)
          }
        })
      }
    }
}
</script>

<style>
</style>
