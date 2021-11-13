<template>
  <div class="channel-edit">
    <van-cell :border='false'>
      <div slot="title" class="title-text">我的频道</div>
      <van-button class="edit-btn" round type="danger" size='mini' plain
        @click="isEdit=!isEdit">{{isEdit ? '完成':'编辑'}}
      </van-button>
    </van-cell>
    <van-grid class='my-grid' :gutter="10">
      <van-grid-item class="grid-item" v-for="(channels,index) in mychannels"
        :key="index" @click="onMyChannelClick(channels,index)">
        <van-icon v-show="isEdit && !fiexdChannels.includes(channels.id)"
          slot="icon" name="clear" />
        <span class="text" :class="{active:index===active}"
          slot="text">{{channels.name}}</span>
      </van-grid-item>
    </van-grid>
    <van-cell :border='false'>
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class='recommend-grid' :gutter="10">
      <van-grid-item class="grid-item"
        v-for="(value,index) in recommendChannels" :key="index" icon='plus'
        :text="value.name" @click="onAddChannel(value)" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  // 组件名称
  name: 'Channeledit',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    mychannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      allChannels: [], // 所有频道的数据
      isEdit: false, // 控制编辑状态的显示
      fiexdChannels: [0] // 固定频道的id，不允许删除
    }
  },
  // 计算属性
  computed: {
    // 获取user
    ...mapState(['user']),
    recommendChannels () {
      return this.allChannels.filter(Channel => {
        return !this.mychannels.find(Channels => {
          return Channels.id === Channel.id
        })
      })
    }
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
  */
  created () {
    this.loadAllChannels()
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted () { },
  // 组件方法
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (e) {
        this.$toast('获取频道列表数据失败')
      }
    },
    async onAddChannel (val) {
      // 添加
      this.mychannels.push(val)
      if (this.user) {
        // 以登录，把数据请求接口放到线上
        try {
          await addUserChannel({
            id: val.id, // 频道 id
            seq: this.mychannels.length // 频道的 序号
          })
        } catch (e) {
          this.$toast('保存失败')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.mychannels)
      }
    },
    onMyChannelClick (channels, index) {
      // 要判断是否是完成还是编辑
      // 如果是固定的频道项就不要删除
      if (this.fiexdChannels.includes(channels.id)) {
        return
      }
      if (this.isEdit) {
        // 编辑状态需要删除
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        this.mychannels.splice(index, 1)
        // 4. 处理持久化 (添加这行代码)
        this.deleteChannel(channels)
      } else {
        // 完成状态，切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，将数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.mychannels)
        }
      } catch (err) {
        console.log(err)
        this.$toast('删除频道失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
