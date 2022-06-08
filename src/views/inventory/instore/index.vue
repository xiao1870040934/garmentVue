<template>
  <div>
      <el-form :model="addForm" label-width="80px" style="display:flex" ref="addFormRef" :rules="addFromRules">
        <el-form-item label="所入仓库" prop="storage">
          <el-input v-model="addForm.storage" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="经办人" prop="agent">
          <el-input v-model="addForm.agent" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="from">
          <el-input v-model="addForm.from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="入库时间" prop="addTime">
          <el-date-picker
            v-model="addForm.addTime"
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
      <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px;float:right" size="mini" @click="showDialog">添加明细</el-button>
      <!-- 明细展示表格 -->
      <el-table :data="addForm.detail" border stripe v-show="addForm.detail.length!==0">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="服装名称" prop="name" width="width"></el-table-column>
        <el-table-column label="数量" prop="count" width="width"></el-table-column>
        <el-table-column label="尺寸" prop="size" width="width"></el-table-column>
        <el-table-column label="颜色" prop="colour" width="width"></el-table-column>
        <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="editDetail(scope.$index)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDetail(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 添加对话框 -->
      <el-dialog title="添加明细" :visible.sync="dialogFormVisible" width="45%">
        <el-form :model="detailForm" label-width="80px" ref="detailFormRef" :rules="detailFormRules">
          <el-form-item label="服装名称" prop="name">
            <el-input v-model="detailForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="count">
            <el-input v-model="detailForm.count" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="尺寸" prop="size">
            <el-input v-model="detailForm.size" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="颜色" prop="colour">
            <el-input v-model="detailForm.colour" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDetail">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改对话框 -->
      <el-dialog title="修改明细" :visible.sync="editFormVisible" width="45%">
        <el-form :model="editForm" label-width="80px" ref="editFormRef" :rules="editFormRules">
          <el-form-item label="服装名称" prop="name">
            <el-input v-model="editForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="count">
            <el-input v-model="editForm.count" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="尺寸" prop="size">
            <el-input v-model="editForm.size" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="颜色" prop="colour">
            <el-input v-model="editForm.colour" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDetailConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <el-button type="primary" icon="el-icon-circle-check" style="margin:10px 0px;float:right"  @click="addFormConfirm" v-show="addForm.detail.length!==0">提交</el-button>
  </div>
</template>

<script>
export default {
    name:'inwarehouseManage',
    data() {
      var checkreturnTime = (rule, value, callback) => {
            if (value <= Date.now()) {
              callback(new Error('选择时间必须小于当前时间'));
            } else {
              callback();
            };
      }
      return {
        addForm: {
          storage: '',
          agent: '',
          from: '',
          addTime: '',
          remark: '',
          detail: []
        },
        detailForm:{
          name: '',
          size: '',
          count: 0,
          colour: ''
        },
        editForm:{
          index: -1,
          name: '',
          size: '',
          count: 0,
          colour: ''
        },
        dialogFormVisible: false,
        editFormVisible: false,
        detailFormRules:{
          name:[
            { required: true, message: '请输入服装名称', trigger: 'blur' }
          ],
          size:[
            { required: true, message: '请输入服装尺寸', trigger: 'blur' }
          ],
          colour:[
            { required: true, message: '请输入服装颜色', trigger: 'blur' }
          ]
          
        },
        editFormRules:{
          name:[
            { required: true, message: '请输入服装名称', trigger: 'blur' }
          ],
          size:[
            { required: true, message: '请输入服装尺寸', trigger: 'blur' }
          ],
          colour:[
            { required: true, message: '请输入服装颜色', trigger: 'blur' }
          ]
        },
        addFromRules:{
          storage:[
            { required: true, message: '请输入所入仓库', trigger: 'blur' }
          ],
          agent:[
            { required: true, message: '请输入经办人', trigger: 'blur' }
          ],
          from:[
            { required: true, message: '请输入供应商', trigger: 'blur' }
          ],
          addTime:[
            { required: true, message: '请选择入库日期', trigger: 'blur' },
            { validator: checkreturnTime, trigger: 'blur' }
          ]

        },
        pickerOptions: {
            // 限制时间不让选择今天以前的
            disabledDate(time) {
                return time.getTime() > Date.now() - 8.64e7;
            }
        }
      }
    },
    methods: {
      showDialog() {
        this.$refs.addFormRef.validate(async valid => {
          if (valid) {
            if(this.$refs.detailFormRef!==undefined){
              this.$refs.detailFormRef.resetFields()
            }
            this.dialogFormVisible=true
          }
        })
      },
      addDetail() {
        this.$refs.detailFormRef.validate(async valid => {
          if (valid) {
              let data=JSON.parse(JSON.stringify(this.detailForm));
              this.addForm.detail.push(data)
              this.dialogFormVisible=false
            }
          })
      },
      editDetail(index) {
        const row=this.addForm.detail[index]
        this.editForm={...row}
        this.editForm.index=index
        this.editFormVisible=true
      },
      async removeDetail(index) {
        //console.log(index)
        const confirmResult = await this.$confirm('此操作将永久删除该详情, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消删除，则返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
            return this.$message.info('已取消删除');
        }
        this.addForm.detail.splice(index,1)
        this.$message.info('删除成功')
      },
      editDetailConfirm() {
        this.$refs.editFormRef.validate(async valid => {
          if (valid) {
            this.$set(this.addForm.detail, this.editForm.index, this.editForm)
            this.editFormVisible=false
          }
        })
      },
      addFormConfirm() {
         this.$refs.addFormRef.validate(async valid => {
          if (valid) {
            let result= await this.$API.inwharehouse.addStock(this.addForm)
            if(result.code === 200){
              this.$message.success('入库成功')
              this.$refs.addFormRef.resetFields()
              this.addForm.detail=[]
            }
          }
        })
      }
    }
}
</script>

<style>
</style>
