<template>
  <div class="collect-article">
    <van-button class="btn-item" :icon="value ? 'star': 'star-o'"
      :class="{liked:value}" :loading='loading' @click="onCollect" />
  </div>
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  // 组件名称
  name: 'CollectArticle',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Boolean,
      reduired: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      loading: false
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
    async onCollect () {
      // 开始请求
      this.loading = true
      try {
        if (this.value) {
          // 取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 收藏
          await addCollect(this.articleId)
        }
        // 不能在子组件更改数据，需要传给父组件
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '点赞成功' : '取消收藏')
      } catch (e) {
        this.$toast.fail('操作失败，请重试')
      }
      // 请求结束
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.collect-article {
  .liked {
    .van-icon {
      color: #e5645f !important;
    }
  }
}
</style>
