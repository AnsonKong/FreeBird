<template lang="pug">
  div
    div.container
      div.bg
      div.avatar-container
        div(v-if="user" class="avatar avatar-logined" :style="{'background-image': `url(${user.avatar_url})`}")
        div(v-else class="avatar avatar-unlogined")
          i(class="iconfont icon-user")
        span.user(v-if="user") {{user.name}}, #[a.underline(href="/logout") logout]
        span.user(v-else) github #[a.underline(href="/passport/github") login]
</template>

<style lang="stylus" scoped>
$container-height = 80px
$avatar-width = 50px

verticalCalc(total, self)
  (total - self) / 2

.iconfont
  font-size 25px
  color rgb(111, 169, 179)

.container
  height $container-height
  box-shadow 0px 0px 2px 1px rgba(0, 0, 0, 0.2)
  background-color white
  position relative

.bg
  position absolute
  top 0
  left 0
  bottom 0
  right 0
  background url(/public/bg.jpg)
  background-size cover
  background-position 50px center
  opacity 0.2

.avatar-container
  position absolute
  padding-left 20px
  padding-top verticalCalc($container-height, $avatar-width)

.avatar
  width $avatar-width
  height $avatar-width
  background-color white
  display inline-block
  border-radius $avatar-width
  margin-right 10px
  box-shadow 0 0 2px 1px rgba(0, 0, 0, 0.2)
  line-height $avatar-width
  text-align center
  vertical-align middle

.avatar-logined
  background-size cover

.user
  color rgb(111, 169, 179)
  vertical-align middle

.underline
  text-decoration underline
</style>

<script>
export default {
  computed: {
    user () {
      return this.$store.state.user
    }
  }
}
</script>
