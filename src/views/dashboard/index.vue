<template>
  <div class="dashboard-container">
    <div style="display:flex;">
      <div class="dashboard-text">name: {{ name }}</div>
      <el-button type="primary" icon="el-icon-edit" style="margin-left:70%" round>修改密码</el-button>
    </div>
    
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
      timer: null    // 定时器
    }
  },
  mounted() {
        this.runInv()
  },
  methods: {
    gotoPage(index) {
        this.currentIndex = index;
    },
    runInv() {
        this.timer = setInterval(() => {
            this.gotoPage(this.nextIndex)
        }, 5000)
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
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
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
