<template lang="pug">
  div
    nav-menu.head
    div(ref="myContainer")
      subject(v-for="(item, index) in items", :key="index", :item="item")
      router-link(to="/article/create")
        div.write-btn
          i(class="iconfont icon-edit")
      div.empty-container(v-if="items.length === 0") ooh! it's empty, any thoughts?
</template>

<style lang="stylus" scoped>
$btn-width = 50px

.head
  position sticky
  left 0
  right 0
  top 0
  z-index 1

.empty-container
  text-align center
  color #ccc
  font-size 20px
  padding-top 10px

.write-btn
  position fixed
  bottom 30px
  right 30px
  width $btn-width
  height $btn-width
  background rgb(111, 169, 179)
  text-align center
  border-radius $btn-width
  line-height $btn-width
  box-shadow 0 0 2px 1px rgba(0, 0, 0, 0.2)

.iconfont
  color white
  font-size 30px
</style>

<script>
import NavMenu from '../component/NavMenu.vue'
import Subject from '../component/Subject.vue'
import { EventBus } from '../event-bus.js'
import axios from 'axios'
const throttle = require('lodash.throttle')

export default {
  components: {
    'nav-menu': NavMenu,
    'subject': Subject
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    onScroll () {
      const scrollDown = window.scrollY > this.lastScrollY
      this.lastScrollY = window.scrollY
      if (!scrollDown) {
        return
      }
      const rect = this.$refs['myContainer'].getBoundingClientRect()
      if (rect.top - this.loadmoreTriggerDistance <= window.innerHeight - rect.height) {
        this.loadData()
      }
    },
    loadData () {
      if (this.loading) {
        this.toast('loading more data, please wait.')
        return
      }
      this.loading = true
      axios.get('/articles', {
        params: {
          start: this.start,
          count: this.count
        }
      }).then(res => {
        const newData = res.data
        if (newData.length) {
          this.start += this.count
          this.items = this.items.concat(res.data)
        } else {
          this.toast('no more data.')
        }
        this.loading = false
      }).catch(err => {
        this.toast("load error, please check your network.")
        this.loading = false
      })
    },
    reset () {
      this.start = 0
      this.items.length = 0
      this.lastScrollY = 0
    },
    onRefresh () {
      this.reset()
      this.loadData()
    }
  },
  mounted () {
    // console.log('home mounted')
    this.loadData()
    EventBus.$on('refreshHome', this.onRefresh)
  },
  activated () {
    // console.log('home activated')
    this.throttleWrapper = throttle(this.onScroll, 200)
    window.addEventListener('scroll', this.throttleWrapper)
    window.scrollTo(0, this.lastScrollY)
  },
  deactivated () {
    // console.log('home deactivated')
    window.removeEventListener('scroll', this.throttleWrapper)
    this.throttleWrapper = null
  },
  data () {
    return {
      start: 0,
      count: 10,
      items: [],
      throttleWrapper: null,
      lastScrollY: 0,
      loadmoreTriggerDistance: 50,
      loading: false
    }
  }
}
</script>
