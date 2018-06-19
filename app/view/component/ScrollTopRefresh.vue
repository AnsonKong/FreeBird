<template lang="pug">
  div.container(:class="[active ? 'container-active' : null]")
    div.icon-container(ref="myContainer")
      i.iconfont.icon-reload(ref="myIcon" :style="{ transform: `rotate(${360 * currentDistance / maxDistance}deg)` }")
</template>

<style lang="stylus" scoped>
@import '../style/systems.styl'

$round-width = 50px

.icon-reload
  font-size 30px
  line-height $round-width
  color rgb(111, 169, 179)
  display inline-block

.container
  position fixed
  background rgba(0,0,0,0.2)
  left 0
  right 0
  top 0
  bottom 0
  visibility hidden

.container-active
  visibility visible

.icon-container
  width $round-width
  height $round-width
  border-radius $round-width
  background white
  position absolute
  top $nav-header-height
  left calc(50% - 25px)
  text-align center
</style>


<script>
const throttle = require('lodash.throttle')
const scrollUtil = require('../util/ScrollUtil.js')
import { TweenLite } from "gsap/umd/TweenMax"

export default {
  data () {
    return {
      initY: this.$store.state.navHeaderHeight - 50,
      maxDistance: 200,
      refreshDistance: 150,
      transitionDuration: 0.5,
      active: false,
      startY: 0,
      moveY: 0,
      touchEnabled: false,
      doRefresh: false,
      currentDistance: 0,
    }
  },
  methods: {
    onTouchStart (e) {
      this.touchEnabled = true
      if (window.scrollY === 0 && e.touches.length === 1) {
        this.startY = e.touches[0].clientY
        window.addEventListener('touchmove', this.onTouchMove)
      }
    },
    onMouseStart (e) {
      if (!this.touchEnabled && window.scrollY === 0) {
        this.startY = e.clientY
        document.body.addEventListener('mousemove', this.onMouseMove)
      }
    },
    onMouseMove (e) {
      if (!this.touchEnabled) {
        this.moveY = e.clientY
        this._moveCalculate()
      }
    },
    onTouchMove (e) {
      if (this.startY && e.touches.length === 1) {
        this.moveY = e.touches[0].clientY
        this._moveCalculate()
      }
    },
    _moveCalculate () {
      const distance = this.moveY - this.startY
      if (this.active) {
        this.currentDistance = Math.min(this.maxDistance, this.initY + distance)
        this.doRefresh = (this.currentDistance > this.refreshDistance)

        this.$refs['myContainer'].style['top'] = this.currentDistance + 'px'
        this.$refs['myIcon'].style['opacity'] = this.doRefresh ? 1 : 0.5
      } else {
        if (distance > 0) {
          this._start()
        } else {
          this._cancel()
        }
      }
      
    },
    onEnd (e) {
      const ease = Circ.easeOut
      TweenLite.to(this.$refs['myContainer'], this.transitionDuration, { top: `${this.initY}px`, ease, onComplete: () => {
        if (this.doRefresh) {
          this.$emit('refresh')
        }
        this._cancel()
      } })
      TweenLite.to(this.$data, this.transitionDuration, { currentDistance: 0, ease })
    },
    _start () {
      this.active = true
      scrollUtil.stopScroll()
      if (this.touchEnabled) {
        window.addEventListener('touchend', this.onEnd)
      } else {
        window.addEventListener('mouseup', this.onEnd)
      }
    },
    _cancel () {
      this.active = false
      this.startY = 0
      this.moveY = 0
      this.doRefresh = false
      scrollUtil.startScroll()
      window.removeEventListener('touchend', this.onEnd)
      window.removeEventListener('touchmove', this.onTouchMove)

      window.removeEventListener('mouseup', this.onEnd)
      document.body.removeEventListener('mousemove', this.onMouseMove)
    }
  },
  activated () {
    window.addEventListener('touchstart', this.onTouchStart)
    window.addEventListener('mousedown', this.onMouseStart)
  },
  deactivated () {
    window.removeEventListener('touchstart', this.onTouchStart)
    window.removeEventListener('mousedown', this.onMouseStart)
    this._cancel()
  }
}
</script>
