<template>
  <div class="user-profile">
    <van-nav-bar title="个人信息" left-text="返回" left-arrow class="page-nav-bar"
      @click-left="$router.back()" />
    <van-cell title="头像" is-link>
      <van-image class="active" round fit="cover" :src="user.photo"
        @click="$refs.file.click()" />
    </van-cell>
    <input type="file" hidden ref="file" @change="onFileChange">
    <van-cell title="昵称" :value="user.name" is-link @click="isShow=true" />
    <van-cell title="性别" :value="user.gender===0 ? '男' : '女'" is-link
      @click="isGenderShow=true" />
    <van-cell title="生日" :value="user.birthday" is-link
      @click="isUpdateBirthdayShow=true" />
    <!-- 编辑昵称弹出层 -->
    <van-popup v-if="isShow" v-model="isShow" position="bottom"
      :style="{ height: '100%' }">
      <Updatename @close='isShow=false' v-model="user.name"></Updatename>
    </van-popup>
    <!-- 编辑昵称弹出层 -->
    <!-- 更改性别弹层 -->
    <van-popup v-model="isGenderShow" position="bottom">
      <Updategender v-if="isGenderShow" @close='isGenderShow=false'
        v-model="user.gender">
      </Updategender>
    </van-popup>
    <!-- 更改性别弹层 -->
    <!-- 更新生日弹层 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <Updatebirthday v-model="user.birthday"
        @close='isUpdateBirthdayShow=false' v-if="isUpdateBirthdayShow">
      </Updatebirthday>
    </van-popup>
    <!-- 更新生日弹层 -->
    <!-- 头像弹层 -->
    <van-popup v-model="isUpdatePhotoShow" position="bottom"
      :style="{ height: '100%' }">
      <Updatephoto v-if="isUpdatePhotoShow" :img='img'
        @close='isUpdatePhotoShow=false' @updataPhon='user.photo=$event'>
      </Updatephoto>
    </van-popup>
    <!-- 头像弹层 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import Updatename from './components/update-name.vue'
import Updategender from './components/update-gender.vue'
import Updatebirthday from './components/update-birthday.vue'
import Updatephoto from './components/update-photo.vue'
export default {
  // 组件名称
  name: 'Userprofile',
  // 局部注册的组件
  components: {
    Updatename,
    Updategender,
    Updatebirthday,
    Updatephoto
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      user: {}, // 个人信息
      isShow: false, // 编辑昵称弹出层
      isGenderShow: false, // 更改性别弹层
      isUpdateBirthdayShow: false, // 更新生日弹层
      isUpdatePhotoShow: false, // 头像弹层
      img: null
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
    this.loadUserProfile()
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () { },
  // 组件方法
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        // console.log(data)
        this.user = data.data
      } catch (e) {
        this.$toast('获取数据失败')
      }
    },
    onFileChange () {
      // 获取文章对象
      const files = this.$refs.file.files[0]
      console.log(files)
      // 基于文章对象获取blob数据
      this.img = window.URL.createObjectURL(files)
      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true
      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法就是每次使用完毕，把它的 value 清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .active {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background: #f5f7f9;
  }
}
</style>
