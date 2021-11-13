<template>
  <div class="search-container">
    <form action="/">
      <van-search v-model="searchText" background="#3296fa" show-action
        placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel"
        @focus='isResultShow=false' />
    </form>
    <!-- 搜索结果 -->
    <SearchResult v-if="isResultShow" :searchtext='searchText'></SearchResult>
    <!-- 联想建议 -->
    <SearchSuggestion v-else-if="searchText" :searchtext='searchText'
      @search='onSearch'>
    </SearchSuggestion>
    <!-- //历史记录 -->
    <SearchHistory v-else :searchHistories='searchHistories'
      @clearSearchHistory='searchHistories=[]' @search='onSearch'>
    </SearchHistory>

  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  // 组件名称
  name: 'Searchcontainer',
  // 局部注册的组件
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []// 数据用来存储历史记录
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    searchHistories (value) {
      // 同步存储到本地
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
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
    onSearch (val) {
      // 更新文本的内容
      this.searchText = val
      console.log(val)
      // 存储搜索历史记录
      // 要求：不要有重复历史记录、最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      console.log(index)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      // 把数据放到第一个
      this.searchHistories.unshift(val)
      // 渲染更新的结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  .van-search__action {
    color: #fff;
  }
}
</style>
