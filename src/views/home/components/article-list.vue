<template>
  <div class="article-list">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh"
      :success-duration='1500' :success-text='refreshSuccessText'>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
        @load="onLoad" :error.sync="error" error-text="请求失败，点击重新加载">
        <Article v-for="(article,index) in list" :key="index"
          :article='article'></Article>
        <!-- <van-cell v-for="(article,index) in list" :key="index"
            :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import Article from '@/components/article-item/index.vue'
export default {
  // 组件名称
  name: 'Articlelist',
  // 局部注册的组件
  components: {
    Article
  },
  // 组件参数 接收来自父组件的数据
  props: {
    channels: {
      type: Object,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      list: [],
      loading: false, // 控制加载中 loading 状态  loading 控制上拉加载更多的 loading 状态
      finished: false, // 控制数据加载结束的状态   finished 控制数据是否加载结束
      timestamp: null, // 请求下一页数据的时间戳
      error: false,
      isLoading: false, // 控制下拉刷新的状态
      refreshSuccessText: '刷新成功'
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created () { },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () { },
  // 组件方法
  methods: {
    async onLoad () {
      // 异步更新数据
      // 1.请求获取数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      try {
        const { data } = await getArticles({
          channel_id: this.channels.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 0
        })
        console.log(data)
        // 2.把请求的数据放在list里
        const { results } = data.data
        console.log(results)
        this.list.push(...results)
        // 加载状态结束  3.本次数据加载 结束之后要把加载状态设置为结束
        //     loading 关闭以后才能触发下一次的加载更多
        this.loading = false
        // 4.判断数据是否全部加在完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true
        }
      } catch (e) {
        console.log('失败')
        this.error = true
        this.loading = false
      }
    },
    // 下拉刷新会触发这个事件
    async onRefresh () {
      try {
        // 1.获取数据
        const { data } = await getArticles({
          channel_id: this.channels.id,
          timestamp: Date.now(),
          with_top: 0
        })
        // 手动抛出错误
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsnajndjsa')
        // }
        console.log(data)
        // 2.拿到数据追加到顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3.追加完成之后关闭刷新
        this.isLoading = false
        this.refreshSuccessText = `刷新了${results.length}条数据`
      } catch (e) {
        this.refreshSuccessText = '刷新失败'
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
