<template lang="pug">
  div(ref="root-container")
    nav-menu.head.head-stick
    div.avatar-container
      avatar(:avatar-url="article.avatar ? article.avatar : null" bg-color="#eee" icon-color="#aaa")
      div.author {{ article.author ? article.author : 'annoymous' }}
    div.content-container
      div.time {{time}}
      div.content {{ article.content ? article.content : 'empty content'}}
      div.icon-container
        i(class="iconfont icon-share copy" :data-clipboard-text="shareLink")
        heart(:item="article" api="/api/article/like")
    div.hr
    div.comments-container(ref="comments-container")
      div.comments-title Comments ({{ total }})
      ul(ref="comment-list")
        li.comment-container(v-for="(item,index) in comments" :key="item._id" :ref="item._id")
          div.hr
          comment(:item="item")
      div.non-comment(v-if="comments.length === 0") Leave a comment?
    input-nav.input-nav(@send="onSend")
    refresh(@refresh="onRefresh")
</template>

<style lang="stylus" scoped>
@import '../style/systems.styl'

.hr
  height 1px
  background $hr-color
  margin-bottom 10px

.non-comment
  color #ccc

.comment-container
  margin 25px 0

.comments-title
  font-size 20px

.input-nav
  position fixed
  left 0
  right 0
  bottom 0

.iconfont
  font-size 25px
  color #aaa

.icon-heart
  margin 0 5px

.icon-container
  margin-top 25px

.avatar-container
  text-align center
  padding 15px

.author
  text-align center
  font-weight bold

.content-container
  padding 15px

.comments-container
  padding 15px
  padding-bottom 50px

.content
  font-size 20px

.time
  text-align right
  color #ccc
</style>

<script>
const axios = require('axios')
const moment = require('moment')
import NavMenu from '../component/NavMenu.vue'
import InputNav from '../component/InputNav.vue'
import Avatar from '../component/Avatar.vue'
import Comment from '../component/Comment.vue'
import Heart from '../component/Heart.vue'
import ScrollTopRefresh from '../component/ScrollTopRefresh.vue'
import { TweenLite } from "gsap/umd/TweenMax"

export default {
  components: {
    'nav-menu': NavMenu,
    'avatar': Avatar,
    'comment': Comment,
    'heart': Heart,
    'input-nav': InputNav,
    'refresh': ScrollTopRefresh
  },
  data () {
    return {
      article: {},
      shareLink: '',
      total: 0,
      comments: []
    }
  },
  computed: {
    articleId () {
      return this.$route.params.id
    },
    time () {
      return this.article.time ? moment(this.article.time).fromNow() : 'time'
    }
  },
  methods: {
    loadArticle () {
      axios.get(`/api/article/${this.articleId}`).then(res => {
        this.article = res.data
        this.total = this.article.comments_count
        this.shareLink = `${window.location.origin}/article/${this.article._id}`
        this.loadComments()
      }).catch(err => {
        this.toast("load error " + err)
      })
    },
    loadComments () {
      axios.get('/api/comments', {
        params: {
          article: this.articleId
        }
      }).then(res => {
        if (res.data) {
          this.comments = this.comments.concat(res.data)
          // scroll to comment
          this.$nextTick(function()  {
            if (this.$route.hash) {
              const targetId = this.$route.hash.replace('#', '')
              if (this.$refs[targetId]) {
                const ele = this.$refs[targetId][0]
                const rect = ele.getBoundingClientRect()
                window.scrollTo(0, rect.top - this.$store.state.navHeaderHeight)
              }
            }
          })
        } else {
          if (this.comments.length) {
            this.toast('no more comments.')
          }
        }
      }).catch(err => {
        this.toast("load error, please check your network.")
      })
    },
    commentArticle (comment) {
      axios.post(`/api/comments`, {
        article: this.articleId,
        comment
      }).then(res => {
        this.total++
        this.comments.unshift(res.data)
        this.toast('comment successfully!')
        this.$nextTick(function () {
          const f = this.$refs['comment-list'].firstChild
          TweenLite.fromTo(f, .5, { opacity: 0 }, { opacity: 1 })
        })
        this._scrollToCommentsTop()
      }).catch(err => {
        this.toast("comment error " + err)
      })
    },
    onSend (value) {
      this.commentArticle(value)
    },
    onRefresh () {
      this.toast('refresh successfully!')
      this._clear()
      this.loadArticle()
    },
    _scrollToCommentsTop () {
      const ele = this.$refs['comments-container']
      const rect = ele.getBoundingClientRect()
      window.scrollBy(0, rect.top - this.$store.state.navHeaderHeight)
    },
    _clear () {
      this.article = {}
      this.shareLink = ''
      this.total = 0
      this.comments.length = 0
    }
  },
  activated () {
    this.loadArticle()
  },
  deactivated () {
    this._clear()
  }
}
</script>
