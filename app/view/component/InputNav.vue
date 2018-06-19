<template lang="pug">
  div.container
    textarea(ref="myInput" placeholder="comment here" :rows="lines" v-model="currentValue", @input="onInput")
    div.c-btn.c-btn--white.c-btn--small.c-btn--round.c-btn--narrow(:class="[currentValue ? null : 'c-btn--disabled']" @click="onSend") Send
</template>

<style lang="stylus" scoped>
@import '../style/systems.styl'

textarea
  border solid 0
  border-bottom solid 1px #ccc
  width 100%
  font-size 20px
  resize none
  box-sizing border-box
  margin-right 10px

textarea:focus
  border-bottom solid 1px $theme-color

.container
  border-top solid 1px #ccc
  background white
  display flex
  align-items flex-end
  padding 10px
  box-shadow 0 0 2px 1px rgba(0,0,0,0.2)
</style>

<script>
export default {
  data () {
    return {
      currentValue: '',
      lines: 1
    }
  },
  mounted () {
    this._updateInputHeight()
  },
  deactivated () {
    this._clear()
  },
  methods: {
    onSend () {
      if (this.currentValue) {
        this.$emit('send', this.currentValue)
        this._clear()
      }
    },
    onInput () {
      this._updateInputHeight()
    },
    _updateInputHeight () {
      const ar = this.currentValue.match(/\n/mg)
      this.lines = 1 + (ar ? ar.length : 0)
    },
    _clear () {
      this.currentValue = ''
      this.lines = 1
    }
  }
}
</script>
