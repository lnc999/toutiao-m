<template>
  <div class="update-name">
    <van-nav-bar title="设置信息" left-text="返回" right-text="完成" left-arrow
      @click-left='$emit("close")' @click-right='onConfirm' />
    <div class="field-wrap">
      <van-field v-model.trim="message" rows="2" autosize type="textarea"
        maxlength="7" placeholder="请输入昵称" show-word-limit />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  // 组件名称
  name: 'Updatename',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: String,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      message: this.value// 留言栏内容
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
    async onConfirm () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0 // 持续展示 toast
      })
      try {
        const message = this.message
        if (!message.length) {
          this.$toast('昵称不能为空')
          return
        }
        const { data } = await updateUserProfile({
          name: message
        })
        console.log(data)
        // 更新视图
        this.$emit('input', message)
        // 关闭弹层
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (e) {
        this.$toast.fail('更改信息失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-name {
  .field-wrap {
    padding-top: 20px;
  }
}
</style>
