<template lang="pug">
  div.container
    div.avatar-container(:style="{'background-image': item.avatar ? `url(${item.avatar})` : null}")
      i(v-if="!item.avatar" class="iconfont icon-user")
    div.info-container
      div.top-container
        span.author {{item.author}}
        span.time {{time}}
      p.content {{item.content}}
      div
        i(class="iconfont icon-share" @click.stop="onShare")
        i(class="iconfont icon-heart" @click.stop="onHeart")
        i(class="iconfont icon-mail" @click.stop="onComment")
</template>

<style lang="stylus" scoped>
$avatar-width = 40px

.iconfont
  color #aaa
  font-size 25px

.icon-heart
  margin 0 5px

.container
  box-sizing border-box
  border-bottom solid #ddd 1px
  padding 15px
  display flex

.info-container
  width 100%

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

.avatar-container
  width $avatar-width
  height $avatar-width
  background-color #eee
  background-size cover
  margin-right 10px
  flex-shrink 0
  text-align center
  padding-top 5px
  box-sizing border-box

.icon-edit
  float right
</style>

<script>
const moment = require('moment')
export default {
  props: ['item'],
  methods: {
    onRead () {
      console.log('read')
      this.$router.push(`/article/${this.item._id}`)
    },
    onShare () {
      console.log('share')
    },
    onHeart () {
      console.log('heart')
    },
    onComment () {
      console.log('comment')
    }
  },
  computed: {
    time () {
      return moment(this.item.time).fromNow()
    }
  }
}
</script>
