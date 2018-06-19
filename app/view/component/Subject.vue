<template lang="pug">
  div.container(@click="onRead($event)")
    avatar.my-avatar(:avatar-url="item.avatar ? item.avatar : null" bg-color="#eee" icon-color="#aaa" :round="false" avatar-width="40px")
    div.info-container
      div.top-container
        span.author {{item.author}}
        span.time {{time}}
      p.content(v-html="input2Html(item.content)")
      div.icons-container(ref="btns")
        i(class="iconfont icon-share copy" :data-clipboard-text="shareLink")
        heart(:item="item" api="/api/article/like")
        i(class="iconfont icon-mail" @click.stop="onComment")
        span.comment-count {{item.comments_count}}
</template>

<style lang="stylus" scoped>
@import '../style/systems.styl'

.icons-container
  display inline-block

.comment-count
  color #aaa
  font-size 20px

.my-avatar
  flex-shrink 0
  
.iconfont
  color #aaa
  font-size 25px
  display inline-block

.icon-share
  margin-right 5px

.icon-mail
  margin-left 5px

.container
  box-sizing border-box
  border-bottom solid 1px $hr-color
  padding 15px
  display flex

.info-container
  width 100%
  margin-left 10px

.top-container
  position relative

.author
  font-weight bold
  font-size 18px
  display inline-block
  max-width 250px
  overflow hidden
  white-space nowrap
  text-overflow ellipsis

.content
  font-size 18px

.time
  position absolute
  right 0
  color #ccc

.icon-edit
  float right
</style>

<script>
import Avatar from './Avatar.vue'
import Heart from './Heart.vue'
const moment = require('moment')

export default {
  components: {
    'avatar': Avatar,
    'heart': Heart
  },
  props: ['item'],
  methods: {
    read() {
        this.$router.push(`/article/${this.item._id}`)
    },
    onRead ($event) {
      if (this.$refs['btns'].contains($event.target) === false) {
        this.read()
      }
    },
    onComment () {
      this.read()
    }
  },
  computed: {
    time () {
      return moment(this.item.time).fromNow()
    },
    shareLink () {
      return `${window.location.origin}/article/${this.item._id}`
    }
  }
}
</script>
