<template>
  <div class="login-container">
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon class="page-nav-back" slot="left" name="revoke" size="18"
        @click="$router.back()" />
    </van-nav-bar>
    <van-form @submit="onSubmit" ref="loginFrom">
      <van-field v-model="user.mobile" placeholder="请输入手机号"
        :rules="userFromRules.mobiles" type='number' maxlength='11'
        name='mobile'>
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <van-field v-model="user.code" type="password" placeholder="请输入验证码"
        :rules="userFromRules.codes" maxlength='6' name='code'>
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
        <template #button>
          <van-count-down v-if="isCountDownShow" :time="1000 * 5"
            format="  ss 秒" @finish='isCountDownShow=false' />
          <van-button v-else native-type="button" round class="send-sms-btn"
            size="small" type="default" @click="sendFrom">
            获取验证</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendCode } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      isCountDownShow: false,
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      // 手机号和验证码的校验
      userFromRules: {
        mobiles: [
          {
            required: true,
            message: '请填写用户名'
          },
          {
            pattern: /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/,
            message: '手机号格式错误'
          }
        ],
        codes: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式不正确'
          }
        ]
      }
    }
  },
  methods: {
    // 获取表单数据
    async onSubmit () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      // 1.获取表单数据
      const user = this.user
      // 2.表单验证
      // 3.提交表单请求登录
      try {
        const { data } = await login(user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        this.$router.back()
        // console.log('11')
      } catch (e) {
        if (e.response.status === 400) {
          this.$toast.fail('手机号或者验证码错误')
        } else {
          this.$toast.fail('登录失败,请稍后再试', e)
        }
      }
      // 4.根据请求响应结果处理后续操作
    },
    // 发送验证码
    async sendFrom () {
      console.log('btnFrom')
      // 1.校验手机号
      try {
        await this.$refs.loginFrom.validate('mobile')
      } catch (e) {
        return console.log('验证失败', e)
      }
      // 2.验证通过，显示倒计时
      this.isCountDownShow = true
      // 3.请求发送验证码
      try {
        await sendCode(this.user.mobile)
        this.$toast.success('发送成功')
        // this.isCountDownShow = false
      } catch (e) {
        this.isCountDownShow = false
        if (e.response.status === 429) {
          this.$toast('频繁发送,请稍后再试')
        } else {
          this.$toast('发送失败,请稍后再试')
        }
      }
    }
  }

}
</script>

<style scoped lang='less'>
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    background-color: #ededed;
    width: 152px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    color: #666;
    padding: 0;
  }
  .login-btn-wrap {
    padding: 53px 33px;
  }
}
</style>
