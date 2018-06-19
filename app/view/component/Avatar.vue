<template lang="pug">
  div.avatar(:style="avatarStyleObj")
    i.iconfont.icon-user(v-if="!avatarUrl" :style="iconStyleObj")
</template>

<style lang="stylus" scoped>
.iconfont
  font-size 25px

.avatar
  display inline-block
  text-align center
  background-size cover
</style>


<script>
export default {
  props: {
    'avatar-url': {
      type: String
    }, 
    'bg-color': {
      type: String
    }, 
    'icon-color': {
      type: String
    }, 
    'round': {
      type: Boolean,
      default: true
    },
    'avatar-width': {
      type: String,
      default: '50px'
    }
  },
  computed: {
    avatarStyleObj () {
      return {
        'background-image': this.avatarUrl ? `url(${this.avatarUrl})` : null,
        'background-color': this.bgColor || 'white',
        'width': this.avatarWidth,
        'height': this.avatarWidth,
        'line-height': this.avatarWidth,
        'border-radius': this.round ? this.avatarWidth : null
      }
    },
    iconStyleObj () {
      return {
        'color': this.iconColor || 'rgb(111, 169, 179)'
      }
    }
  }
}
</script>
