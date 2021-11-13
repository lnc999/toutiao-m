<template>
  <div class="comment-reply">
    <van-nav-bar :title="comment.reply_count">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <div class="scroll-wrap">
      <CommentItem :comment='comment'></CommentItem>
      <van-cell title="回复" />
      <CommentList :source="comment.com_id" type='c' :list='commentList'>
      </CommentList>
    </div>
    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button class="post-btn" size="small" round
        @click='isPostShow = true'>写评论</van-button>
    </div>
    <!-- /发布评论 -->
    <!-- 发布评论的弹层，视频里面没有提到，自行补充 -->
    <van-popup v-model="isPostShow" position="bottom">
      <CommentPost :target='comment.com_id' @post-success='onPostSuccess'>
      </CommentPost>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
  // 组件名称
  name: 'Commentreply',
  // 局部注册的组件
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  // 组件参数 接收来自父组件的数据
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  // 组件状态值
  data () {
    return {
      isPostShow: false,
      commentList: []
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
    onPostSuccess (data) {
      console.log(data)
      // 更新回复的数量
      this.comment.reply_count++
      // 关闭弹层
      this.isPostShow = false
      // 将最新回复的内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
.comment-reply {
  .post-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-top: 1px solid #d8d8d8;
    .post-btn {
      width: 60%;
    }
  }
  .scroll-wrap {
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 88px;
    overflow-y: auto;
  }
}
</style>
