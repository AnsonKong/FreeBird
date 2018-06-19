<template lang="pug">
  div.container
    avatar.my-avatar(avatar-width="40px"  bg-color="#eee" icon-color="#aaa" :round="false" :avatar-url="item.user ? item.user.avatar_url : null")
    div.main-container
      div.info-container
        span.user {{item.user ? item.user.name : 'annoymous'}}
        heart(:item="item" api="/api/comment/like")
      div.comment(v-html="input2Html(item.comment)")
</template>

<style lang="stylus" scoped>
.user
  font-weight bold

.info-container
  margin-bottom 10px
  display flex
  justify-content space-between

.container
  display flex
  
.my-avatar
  flex-shrink 0

.main-container
  margin-left 10px
  width 100%

</style>

<script>
import Avatar from './Avatar.vue'
import Heart from './Heart.vue'

export default {
  props: ['item'],
  components: {
    'avatar': Avatar,
    'heart': Heart
  }
}
</script>
