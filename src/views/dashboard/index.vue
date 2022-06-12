<template>
  <div class="dashboard-container">
    <div style="display:flex;">
      <div class="dashboard-text">name: {{ name }}</div>
      <el-button type="primary" icon="el-icon-edit" style="margin-left:70%" round @click="changePassword">修改密码</el-button>
    </div>
    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="80px">
          <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="editForm.oldPassword"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="editForm.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="newPassword2">
              <el-input v-model="editForm.newPassword2"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editPasswordInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 广告区域 -->
    <div class="banner">
        <div class="item">
            <img :src="dataList[currentIndex]" style="width: 100% ;display: block;">
        </div>
        <div class="page" v-if="this.dataList.length > 1">
            <ul>
            <li @click="gotoPage(prevIndex)">&lt;</li>
            <li v-for="( item, index) in dataList" @click="gotoPage(index)" :class="{'current':currentIndex == index}" :key="index">  {{index+1}}</li>
            <li @click="gotoPage(nextIndex)">&gt;</li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      dataList: ['https://i1.mifile.cn/a4/xmad_15535933141925_ulkYv.jpg', 'https://i1.mifile.cn/a4/xmad_15532384207972_iJXSx.jpg', 'https://i1.mifile.cn/a4/xmad_15517939170939_oiXCK.jpg'],
      currentIndex: 0,   // 默认显示图片
      timer: null,// 定时器
      editDialogVisible:false,
      editForm: {
        oldPassword:'',
        newPassword:'',
        newPassword2: ''
      },
      editFormRules:{
        oldPassword:[
            { required: true, message: '请输入旧密码', trigger: 'blur'}
        ],
        newPassword:[
          { required: true, message: '请输入新密码', trigger: 'blur'}
        ],
        newPassword2:[
          { required: true, message: '请输入确认新密码', trigger: 'blur'}
        ]
      },
      // 上一次点击时间
      lastTime: null,
      // 当前时间
      currentTime: null,
      // 超时时间, 如果半个小时都没有点击页面就算超时
      sys_timeout: 20 * 60* 1000,
      // 检查的时间，每隔5分钟检查一次有没有超时
      check_time: 5 * 60 * 1000,
      // 计时器
      whole_timer: null
    }
  },
  mounted() {
        this.runInv()
  },
  created() {
    // 启动这个定时器  
    this.isLoginOut();
  },
  methods: {
    // 判断是否超时
    isTimeOut(){
      // 页面上一次的点击时间
      this.lastTime = this.$store.state.login.lastTime;
      this.currentTime = new Date().getTime();
      // 超时了
      if((this.currentTime - this.lastTime) > this.sys_timeout) {
        return true;
      } else {
        return false;
      }
    },
    isLoginOut() {
      // console.log("11111:" + this)
      // 每次用定时器之前先清除一下  
      clearInterval(this.whole_timer);
      // 这里要备份一下this指针
      let _this = this;
      this.whole_timer = setInterval(function () {
        // 判断一下是否超时，如果超时了就退出
        if (_this.isTimeOut()) {
          // console.log("22222:" + this)
          _this.logout()
          // 如果退出了就清除这个定时器，这里要延迟一秒清除，因为跳转到登录界面会有一点点延迟~  
          setTimeout(function() {
            clearInterval(_this.whole_timer);
          }, 1000);
        }
      }, _this.check_time);
    },

    gotoPage(index) {
        this.currentIndex = index;
    },
    runInv() {
        this.timer = setInterval(() => {
            this.gotoPage(this.nextIndex)
        }, 5000)
    },
    changePassword(){
      this.editDialogVisible=true
      if(this.$refs.editForm!==undefined){
        this.$refs.editForm.resetFields()
      }
    },
    editPasswordInfo(){
      this.$refs.editForm.validate(async valid => {
          if (valid) {
            if(this.editForm.newPassword !== this.editForm.newPassword2){
              return this.$message.info('两次密码不一致')
            }
            let result= await this.$API.clientMark.updatePassword(this.editForm)
            if(result.code ===200){
              this.$message.success('修改成功')
              this.editDialogVisible=false
              this.logout()
            }
          }
      }) 
    },
    async logout() {
      await this.$store.dispatch('logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  },
  computed: {
      ...mapGetters([
        'name'
      ]),
      prevIndex() {
          if (this.currentIndex === 0) {
              return this.dataList.length - 1;
          } else {
              return this.currentIndex - 1;
          }
      },
      // 下一张
      nextIndex() {
          if (this.currentIndex === this.dataList.length - 1) {
              return 0;
          } else {
              return this.currentIndex + 1;
          }
      },
      beforeDestroy() {
        clearInterval(this.timer);
      }
  } 
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
ul li {
    list-style: none;
    float: left;
    width: 30px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    color: rgba(255,255,255,.8);
    font-size: 14px;
}
.banner {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    margin-top: 60px;
}
.banner .page {
    background: rgba(0,0,0,.5);
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
}
.banner .page ul {
    float: right;
}
.current {
    color: #ff6700;
}
</style>
