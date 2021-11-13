<template>
  <div class="comment-list">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
      @load="onLoad" :error.sync="error" :immediate-check="false">
      <CommentItem v-for="(item,index) in list" :key="index"
        :title="item.content" :comment="item"
        @reply-click="$emit('reply-click', $event)" />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item.vue'
export default {
  // 组件名称
  name: 'CommentList',
  // 局部注册的组件
  components: {
    CommentItem
  },
  // 组件参数 接收来自父组件的数据
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      // default，默认值，如果是数组或者对象，需要通过函数的形式返回
      default: () => []
    },
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }

  },
  // 组件状态值
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10,
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
  created () {
    // 当你手动初始 onLoad 的话，它不会自动开始初始的 loading
    // 所以我们要手动的开启初始 loading
    this.loading = true
    this.onLoad()
  },
  /**
* el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
* 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
*/
  mounted () { },
  // 组件方法
  methods: {
    async onLoad () {
      try {
        // 1.发请求
        const { data } = await getComments({
          type: this.type,
          source: this.source.toString(), // 源id，文章id或评论id(特别注意：需要手动加上toString()，否则会在source的值两边加上双引号，导致id不是一个有效的整形)
          offset: this.offset,
          limit: this.limit
        })
        // console.log(data)
        // 2.获取数据
        const { results } = data.data
        this.list.push(...results)
        // 把评论数据给父组件
        this.$emit('onload-success', data.data)
        // 3. 将 loading 设置为 false
        this.loading = false
        // 3.判断是否有数据
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          // 没有就将 finished 设置结束
          this.finished = true
        }
      } catch (e) {
        this.error = true
        this.loading = false
      }
    }
  }
}

</script>

<style scoped lang="less">
</style>
