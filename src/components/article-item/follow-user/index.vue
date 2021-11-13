<template>

  <van-button :loading="loading" @click="onFollow" v-if='isFollow'
    class="follow-btn" round size="small">
    已关注</van-button>
  <van-button :loading="loading" @click="onFollow" v-else class="follow-btn"
    type="info" color="#3296fa" round size="small" icon="plus">关注</van-button>

</template>

<script>
import { addFollow, deleteFollow } from '@/api/user.js'
export default {
  // 组件名称
  name: 'FollowUser',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    isFollow: {
      type: Boolean,
      required: true
    },
    userId: {
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
    // 点击取消关注或者添加关注
    async onFollow () {
      this.loading = true// 展示关注按钮的 loading 状态
      try {
        if (this.isFollow) {
          // 已关注，需要取消关注
          await deleteFollow(this.userId)
          // this.article.is_followed = false
        } else {
          // 没有关注，需要关注
          // await addFollow(this.article.art_id)
          await addFollow(this.userId)
          // this.article.is_followed = true
        }
        // this.article.is_followed = !this.article.is_followed
        this.$emit('updataFollow', !this.isFollow)
      } catch (e) {
        let message = '操作失败,请稍后再试'
        if (e.response && e.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.loading = false// 关闭关注按钮的 loading 状态
    }
  }
}
</script>

<style scoped lang="less">
</style>
