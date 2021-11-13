<template>
  <div class="home-container">
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button round type="info" size="small" class="search-btn" slot="title"
        icon='search' to='/search'>搜索</van-button>
    </van-nav-bar>
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab v-for="channel in channels" :key="channel.id"
        :title="channel.name">
        <ArticleList :channels="channel" />
      </van-tab>
      <div slot="nav-right" class="placeholder">
      </div>
      <div slot="nav-right" class="hamburger-btn" @click="show=true">
        <i class="iconfont icon-gengduo"></i>
      </div>
      <!-- <ArticleList :channel='channel'></ArticleList>
       -->
    </van-tabs>
    <van-popup closeable close-icon-position="top-left" v-model="show"
      position="bottom" :style="{ height: '100%' }">
      <Channeledit :mychannels='channels' :active='active'
        @update-active='onUpdateActive'></Channeledit>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
import ArticleList from './components/article-list'
import { getUserChannels } from '@/api/user.js'
import Channeledit from './components/channel-edit.vue'
export default {
  // 组件名称
  name: 'HomeIndex',
  // 局部注册的组件
  components: {
    ArticleList,
    Channeledit
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      active: 0,
      channels: [], // 列表对象
      show: false// 遮罩层的显示隐藏
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
    this.loadChannels()
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () { },
  // 组件方法
  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        let channels = []
        if (this.user) {
          // 已登录，请求获取线上的频道数据
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            // 有本地频道数据，则使用
            channels = localChannels
          } else {
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (e) {
        this.$toast('获取频道列表数据失败')
      }
    },
    onUpdateActive (index, show = true) {
      this.active = index
      this.show = show
    }
  }

  // 已登录，请求获取线上的频道数据
  // 未登录
  // 有本地频道数据，则使用
  // 没有本地频道数据，则请求获取默认推荐的频道列表
  // 将数据更新到组件中
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
  }
  .van-icon {
    font-size: 32px;
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background: #3296fa;
    }
  }
  .hamburger-btn {
    position: fixed;
    right: 0;
    width: 66px;
    height: 82px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    opacity: 0.902;
    i.iconfont {
      font-size: 33px;
    }
    &:before {
      content: "";
      position: absolute;
      left: 0;
      width: 1px;
      height: 58px;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
}
</style>
