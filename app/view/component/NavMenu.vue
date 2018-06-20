<template lang="pug">
  div
    div.container
      div(v-if="isHome")
        avatar.avatar(:avatar-url="user ? user.avatar_url : null")
        span.user(v-if="user") {{user.name}}, #[a.underline(href="/logout") logout]
        span.user(v-else) github #[a.underline(href="/passport/github") login]
      i.iconfont.icon-left(v-else @click="onBack")
      a.github-container(href="https://github.com/AnsonKong/FreeBird" target="_blank" rel="noopener")
        i.iconfont.icon-github-fill
        span GitHub
</template>

<style lang="stylus" scoped>
@import '../style/systems.styl'

.github-container
  position absolute
  display inline-block
  top 10px
  right 10px
  padding 5px
  border-radius 5px
  background white
  box-shadow 0 0 2px 2px rgba(0,0,0,0.3)

.icon-github-fill
  margin-right 5px
  font-size 20px

.avatar
  vertical-align middle

.icon-left
  font-size 40px
  color rgb(255,255,255)

.container
  height $nav-header-height
  box-shadow 0px 0px 2px 1px rgba(0, 0, 0, 0.2)
  background-image url(/public/bg.jpg) 
  background-position 50px center
  background-size cover
  display flex
  align-items center
  padding-left 10px

.user
  margin-left 10px

.underline
  text-decoration underline
</style>

<script>
import Avatar from './Avatar.vue'
export default {
  components: {
    'avatar': Avatar
  },
  methods: {
    onBack () {
      this.$router.push('/')
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    isHome () {
      return this.$route.path === '/'
    }
  }
}
</script>
