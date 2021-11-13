<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clearSearchHistory')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow=false">完成</span>
      </div>
      <van-icon v-else name="delete-o" @click="isDeleteShow=true" />
    </van-cell>
    <van-cell v-for="(item,index) in searchHistories" :key="index" :title="item"
      @click="onSearchItemClick(item,index)">
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'Searchhistory',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    searchHistories: {
      type: Array,
      redirect: true
    }
  },
  // 组件状态值
  data () {
    return {
      // 定义当前是否是删除状态
      isDeleteShow: false
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
  mounted () {

  },
  // 组件方法
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态
        this.searchHistories.splice(index, 1)
      } else {
        /// / 否则执行搜索操作
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
