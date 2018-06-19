<template lang="pug">
  div
</template>

<script>
const throttle = require('lodash.throttle')

export default {
  data () {
    return {
      throttleWrapper: null,
      loadmoreTriggerDistance: 50,
      lastScrollY: 0
    }
  },
  methods: {
    onScroll () {
      const scrollDown = window.scrollY > this.lastScrollY
      this.lastScrollY = window.scrollY
      this.$emit('scrollChanged', this.lastScrollY)
      if (!scrollDown) {
        return
      }
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - this.loadmoreTriggerDistance) {
        this.$emit('loadmore')
      }
    }
  },
  activated () {
    this.throttleWrapper = throttle(this.onScroll, 100)
    window.addEventListener('scroll', this.throttleWrapper)
  },
  deactivated () {
    window.removeEventListener('scroll', this.throttleWrapper)
    this.throttleWrapper = null
  }
}
</script>
