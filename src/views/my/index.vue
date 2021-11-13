<template>
  <div class="my-container">
    <!-- 我的页面 -->
    <div v-if="user" class="header user-info">
      <!-- 上 -->
      <div class="base-info">
        <div class="left">
          <van-image round class="avatar" fit="cover" :src="userInfo.photo" />
          <span class="text">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button round size='mini' to='/user-profile'>编辑资料
          </van-button>
        </div>
      </div>
      <!-- 下 -->
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 登录注册 -->
    <div v-else class="header no-btn">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="modile-img" src="~@/assets/mobile.png" alt="">
        <span class="text">注册 / 登录</span>
      </div>
    </div>
    <!-- 导航 -->
    <van-grid :column-num="2" clickable class="grid-nav">
      <van-grid-item icon="photo-o" text="文字" class="grid-item">
        <i class="iconfont icon-shoucang"></i>
        <span class="text">收藏</span>
      </van-grid-item>
      <van-grid-item icon="photo-o" text="文字" class="grid-item">
        <i class="iconfont icon-lishi"></i>
        <span class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell v-if="user" class="logout-cell" title="退出登录" clickable
      @click="onLogout" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user.js'
export default {
  // 组件名称
  name: 'MyIndex',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      userInfo: {}// 初始化用户信息
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user'])
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created () {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () { },
  // 组件方法
  methods: {
    onLogout () {
      this.$dialog.confirm({
        title: '是否确认退出'
      })
        .then(() => {
          // on confirm
          console.log('成功')
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          console.log('失败')
        })
    },
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (e) {
        this.$toast('获取数据失败', e)
        console.log(e)
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }
  .no-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .text {
        font-size: 28px;
        color: #fff;
      }
      .modile-img {
        height: 132px;
        width: 132px;
        margin-bottom: 15px;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        justify-content: center;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
        }
        .text {
          margin-left: 15px;
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      display: flex;
      height: 130px;
      .data-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.iconfont {
        font-size: 45px;
      }
      .iconfont-shoucang {
        color: #eb5253;
      }
      .iconfont-lishi {
        color: #ff9d1d;
      }
      .text {
        font-size: 28px;
      }
    }
  }
  .logout-cell {
    text-align: center;
    font-size: 30px;
    color: red;
  }
}
</style>
