<template>
  <div class="search-suggestion">
    <van-cell v-for="(text,index) in suggestions" :key="index" icon="search"
      @click="$emit('search',text)">
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
    <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/Mysearch.js'
import { debounce } from 'lodash'
export default {
  // 组件名称
  name: 'Searchsuggestion',
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
      suggestions: []
      // htmlStr: 'Hello <span style="color: red">World</span>'
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    searchtext: {
      handler: debounce(function (val) {
        this.loadSearchSuggestions(val)
      }, 300),
      // handler (val) {
      //   this.loadSearchSuggestions(val)
      // },
      immediate: true
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
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch (e) {
        console.log('失败')
      }
    },
    highlight (text) {
      console.log(text)
      const highlightStr = `<span class='active'>
      ${this.searchtext}</span>`
      const reg = new RegExp(this.searchtext, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: yellowgreen;
  }
}
</style>
