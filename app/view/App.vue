<template lang="pug">
  div.container
    keep-alive
      router-view
    div.toast(ref="myToast" :class="[toastActive ? 'toast-active' : null]") {{toastMsg}}
</template>

<style lang="stylus" scoped>

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
  max-width 80%

.toast-active
  opacity 1
  visibility visible
</style>

<style lang="stylus" src="./style/index.styl">
</style>

<script>
import { EventBus } from './event-bus.js'
import NavMenu from './component/NavMenu.vue'
import { detectNotification, unscribe } from './notification-detect'
import ClipboardJS from 'clipboard'

export default {
  components: {
    'nav-menu': NavMenu
  },
  mounted () {
    EventBus.$on('toast', this.onToast)
    this._initClipboard()
    if (this.user) {
      detectNotification()
    } else {
      unscribe()
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    onToast (msg) {
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
    },
    _initClipboard () {
      var clipboard = new ClipboardJS('.copy');
      clipboard.on('success', (e) => {
        console.info('copied to clipboard:', e.text);
        this.toast('copied successfully!')
      });

      clipboard.on('error', function(e) {
        this.toast('copied failed!')
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
      });
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
