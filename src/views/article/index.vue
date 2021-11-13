<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow @click-left="$router.back()"
      title="黑马头条"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail markdown-body" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover"
            :src="article.aut_photo" />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">
            {{article.pubdate |relativeTime}}</div>
          <FollowUser class="follow-btn" :isFollow='article.is_followed'
            :userId='article.aut_id' @updataFollow='article.is_followed=$event'>
          </FollowUser>
          <!-- <van-button :loading="followLoading" @click="onFollow"
            v-if='article.is_followed' class="follow-btn" round size="small">
            已关注</van-button>
          <van-button :loading="followLoading" @click="onFollow" v-else
            class="follow-btn" type="info" color="#3296fa" round size="small"
            icon="plus">关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->
        <!-- 文章内容 -->
        <div class="article-content" ref="article-content"
          v-html="article.content"></div>
        <van-divider>正文结束</van-divider>
        <CommentList :source='article.art_id'
          @onload-success='totalCommentCount=$event.total_count'
          :list="commentList" @reply-click="onReplyClick"></CommentList>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small"
            @click="isshow=true">写评论
          </van-button>
          <van-icon class="comment-icon" name="comment-o"
            :info="totalCommentCount" />
          <CollectArticle v-model="article.is_collected"
            :articleId='article.art_id'>
          </CollectArticle>
          <!-- <van-button class="btn-item" icon="star-o" /> -->
          <LikeArticle v-model="article.attitude" :articleId='article.art_id'>
          </LikeArticle>
          <!-- <van-button class="btn-item" icon="good-job-o" /> -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <van-popup v-model="isshow" position="bottom">
          <CommentPost :target='article.art_id' @post-success='onPostSuccess'>
          </CommentPost>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus===404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <van-popup v-model="isReplyShow" position="bottom"
      :style="{ height: '100%' }">
      <Commentreply :comment='currentComment' @close='isReplyShow=false'
        v-if="isReplyShow">
      </Commentreply>
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article.js'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/article-item/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment-post.vue'
import Commentreply from './components/comment-reply.vue'
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    Commentreply
  },
  // 给所有的后代组件提供数据
  // 然后在任何后代组件里，我们都可以使用 inject 选项来接收指定的我们想要添加在这个实例上的属性
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的 loading 状态
      errStatus: 0, // 失败的状态码
      followLoading: false,
      totalCommentCount: 0, // 评论显示的数量
      isshow: false, // 显示评论弹出层
      commentList: [],
      isReplyShow: false, // 显示回复弹出层
      currentComment: {} // 点击回复的那个评论对象
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () { },
  methods: {
    async loadArticle () {
      try {
        this.loading = true// 展示 loading 加载中
        const { data } = await getArticleById(this.articleId)
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsankljdnskaljndlkjsa')
        // }
        console.log(data)
        this.article = data.data
        // console.log(this.article)
        // 数据驱动视图这件事儿不是立即的
        setTimeout(() => {
          this.previewImage()
          // console.log(this.$refs['article-content'])
        }, 0)
        this.loading = false
      } catch (e) {
        if (e.response && e.response.status === 404) {
          this.errStatus = 404
        }
        this.loading = false
        console.log('失败')
      }
    },
    previewImage () {
      // 得到img里边所有的节点
      const articleContent = this.$refs['article-content']
      const Img = articleContent.querySelectorAll('img')
      console.log(Img)
      const images = []
      Img.forEach((img, index) => {
        images.push(img.src)
        images.onclick = () => {
          ImagePreview({
            images,
            startPosition: index
          })
        }
      })
      // console.log(images)
    },
    onPostSuccess (data) {
      // 关闭评论弹层
      this.isshow = false
      // 添加到list最前面
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick (comment) {
      console.log(comment)
      this.currentComment = comment
      // 点击回复打开弹出层
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777;
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
}
</style>
