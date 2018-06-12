<template lang="pug">
  div.container
    nav-menu.head
    textarea.area(placeholder="How do you feel today?" rows="10" ref="myInput")
    div.tip(v-if="!user") you're not logined, your message will be sent anonymously.
    div.btn-container
      router-link.c-btn.c-btn--small.c-btn--white.c-btn--round.c-btn--narrow.send-btn(to="/") Back
      div.c-btn.c-btn--small.c-btn--white.c-btn--round.c-btn--narrow.send-btn(@click="onSend") Send
</template>

<style lang="stylus" scoped>

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
  mounted () {
    // console.log('write mounted')
  },
  activated () {
    // console.log('write activated')
  },
  deactivated () {
    // console.log('write deactivated')
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    async onSend () {
      const content = this.$refs['myInput'].value
      if (!content) {
        this.toast('please write something')
        return
      }
      axios.post('/articles', {
        content,
        userAgent: navigator.userAgent
      }).then(res => {
        if (res.data.code === 0) {
          this.$refs['myInput'].value = ''
          this.toast('successfully sent!')
          this.$router.push('/')
          EventBus.$emit('refreshHome')
        } else {
          this.toast('send failed')
        }
      }).catch(err => {
        this.toast('send failed, ' + err)
      })
    }
  }
}
</script>
