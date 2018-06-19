<template lang="pug">
  div.container
    nav-menu.head
    textarea.area(placeholder="How do you feel today?" rows="10" ref="myInput" v-model="currentValue")
    div.tip(v-if="!user") you're not logined, your message will be sent anonymously.
    div.btn-container
      div.c-btn.c-btn--small.c-btn--white.c-btn--round.c-btn--narrow.send-btn(:class="[currentValue ? null : 'c-btn--disabled']" @click="onSend") Send
</template>

<style lang="stylus" scoped>
@import '../style/systems.styl'

.tip
  padding 5px
  color #ccc
  font-size 12px

.area
  border-radius 5px
  border-color #eee
  resize none
  width 100%
  box-sizing border-box
  padding 5px

.area:focus
  border-color $theme-color

.btn-container
  float right

.send-btn
  margin-top 5px
  margin-right 5px
</style>

<script>
import NavMenu from '../component/NavMenu.vue'
import { EventBus } from '../event-bus.js'
const axios = require('axios')

export default {
  components: {
    'nav-menu': NavMenu
  },
  data () {
    return {
      currentValue: ''
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  activated () {
    this.$refs['myInput'].focus()
  },
  methods: {
    onSend () {
      if (!this.currentValue) {
        return
      }
      axios.post('/api/articles', {
        content: this.currentValue,
        userAgent: navigator.userAgent
      }).then(res => {
        this.currentValue = ''
        this.toast('successfully sent!')
        this.$router.push('/')
        EventBus.$emit('newArticle', res.data)
      }).catch(err => {
        this.toast('send failed, ' + err)
      })
    }
  }
}
</script>
