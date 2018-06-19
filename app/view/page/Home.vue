<template lang="pug">
  div.container
    nav-menu.head.head-stick
    div(ref="myContainer")
      div(ref="article-list")
        subject(v-for="(item, index) in items", :key="item._id", :item="item")
      router-link(to="/article/create")
        div.write-btn
          i(class="iconfont icon-edit")
      div.empty-container(v-if="items.length === 0") ooh! it's empty, any thoughts?
    refresh(@refresh="onRefresh")
    loadmore(@loadmore="onLoadMore" @scrollChanged="onScrollChanged")
</template>

<style lang="stylus" scoped>
$btn-width = 50px

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
import ScrollBottomLoadMore from '../component/ScrollBottomLoadMore.vue'
import ScrollTopRefresh from '../component/ScrollTopRefresh.vue'
import { TweenLite } from "gsap/umd/TweenMax"
import { EventBus } from '../event-bus.js'
import axios from 'axios'

export default {
  components: {
    'nav-menu': NavMenu,
    'subject': Subject,
    'loadmore': ScrollBottomLoadMore,
    'refresh': ScrollTopRefresh
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    loadData () {
      if (this.loading) {
        this.toast('loading more data, please wait.')
        return
      }
      this.loading = true
      axios.get('/api/articles', {
        params: {
          since: this.since,
          count: this.count
        }
      }).then(res => {
        const newData = res.data
        if (newData.length) {
          if (this.items.length === 0) {
            TweenLite.fromTo(this.$refs['article-list'], 1, { opacity: 0 }, { opacity: 1 })
          }
          this.items = this.items.concat(res.data)
          // get last item's time
          this.since = this.items[this.items.length - 1].time
        } else {
          this.toast('no more data.')
        }
        this.loading = false
      }).catch(err => {
        this.toast("load error, please check your network.")
        this.loading = false
      })
    },
    onRefresh () {
      this.toast('refresh successfully!')
      this._clear()
      this.loadData()
    },
    _clear () {
      this.since = null
      this.items.length = 0
      this.lastScrollY = 0
    },
    onNewArticle (doc) {
      this.lastScrollY = 0
      this.items.unshift(doc)
      this.$nextTick(function () {
        const f = this.$refs['article-list'].firstChild
        TweenLite.fromTo(f, .5, { opacity: 0 }, { opacity: 1 })
      })
    },
    onLoadMore () {
      this.loadData()
    },
    onScrollChanged (value) {
      this.lastScrollY = value
    }
  },
  mounted () {
    this.loadData()
    EventBus.$on('newArticle', this.onNewArticle)
  },
  activated () {
    window.scrollTo(0, this.lastScrollY)
  },
  data () {
    return {
      since: null,
      count: 10,
      items: [],
      lastScrollY: 0,
      loading: false
    }
  }
}
</script>
