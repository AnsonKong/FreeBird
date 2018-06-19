<template lang="pug">
  div.like-container(@click="onHeart")
    i(class="iconfont icon-heart-fill heart" ref="myHeart")
    i(:class="['iconfont', like ? 'icon-heart-fill' : 'icon-heart']")
    span.like {{item.like}}
</template>

<style lang="stylus" scoped>
.iconfont
  color #aaa
  font-size 25px

.heart
  opacity 0
  position absolute
  left 0

.like-container
  display inline-block
  position relative
  
.like
  color #aaa
  font-size 20px
</style>

<script>
import { TweenLite } from "gsap/umd/TweenMax"
const axios = require('axios')


export default {
  props: ['item', 'api'],
  data () {
    return {
      like: false,
      likePopTop: '-30px'
    }
  },
  methods: {
    onHeart () {
      axios.post(this.api, {
        id: this.item._id
      }).then(res => {
        if (res.data.code === 0) {
          this.like = true
          if (this.item.like == undefined) {
            this.$set(this.item, 'like', 1)
          } else {
            this.item.like++;
          }
          TweenLite.fromTo(
            this.$refs['myHeart'], 
            0.5, 
            { top: '0', opacity: 1 }, 
            { top: this.likePopTop, opacity: 0});
        } else {
          this.toast('like failed: ' + res.data.code)
        }
      }).catch(err => {
        this.toast('like failed: ' + err)
      })
    },
  }
}
</script>
