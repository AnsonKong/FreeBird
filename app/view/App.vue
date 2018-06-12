<template lang="pug">
  div
    keep-alive
      router-view
    div.toast(ref="myToast" :class="[toastActive ? 'toast-active' : null]") {{toastMsg}}
</template>

<style lang="stylus" scoped>

.head
  left 0
  right 0
  top 0
  z-index 1

.toast
  padding 10px
  background rgba(111, 169, 179, 0.8)
  position fixed
  left 0
  top 0
  border-radius 5px
  opacity 0
  visibility hidden
  transition visibility 0.5s, opacity 0.5s
  color white

.toast-active
  opacity 1
  visibility visible

</style>

<style lang="stylus" src="./style/index.styl">
</style>

<script>
import { EventBus } from './event-bus.js'
import NavMenu from './component/NavMenu.vue'

export default {
  components: {
    'nav-menu': NavMenu
  },
  mounted () {
    EventBus.$on('toast', this.onToast)
  },
  methods: {
    onToast (msg) {
      console.log("onToast:" + msg)
      this.toastMsg = msg
      this.toastActive = true
      clearTimeout(this.toastFlag)
      this.$nextTick(function () {
        const rect = this.$refs['myToast'].getBoundingClientRect()
        this.$refs['myToast'].style.left = `${(window.innerWidth - rect.width)/2}px`
        this.$refs['myToast'].style.top = `${(window.innerHeight - rect.height)/2}px`
      })
      this.toastFlag = setTimeout(() => {
        this.toastActive = false
      }, this.toastTime)
    }
  },
  data () {
    return {
      toastMsg: null,
      toastActive: false,
      toastTime: 2000,
      toastFlag: -1
    }
  }
}
</script>
