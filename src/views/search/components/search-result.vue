<template>
  <div class="search-result">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list :error.sync="error" error-text="请求失败，点击重新加载" v-model="loading"
        :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="(item,index) in list" :key="index"
          :title="item.title" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/Mysearch.js'
export default {
  // 组件名称
  name: 'Searchresult',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    searchtext: {
      type: String,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      page: 1, // 页码从第一页
      pageBag: 20, // 每次更新20条数据
      error: false
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
      try {
        // / 1. 请求获取数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.pageBag, // 每页大小
          q: this.searchtext // 搜索关键字
        })
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsnajndjsa')
        // }
        // 2. 将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)
        // 3. 设置加载状态结束
        this.loading = false
        // 4. 判断数据是否加载完毕
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (e) {
        // console.log('失败')
        // 展示加载失败的提示状态
        this.error = true
        // 加载失败了 loading 也要关闭
        this.loading = false
      }
    },
    onRefresh () {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    }
  }
}

</script>

<style scoped lang="less">
</style>
