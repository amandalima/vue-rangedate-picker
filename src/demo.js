// /** Lines below are already loaded in /test/helpers/entry.js
// import Vue from 'vue'
// import plugin from './index'
// import 'babel-polyfill' // promise and etc ...
//
// Vue.config.productionTip = false
// Vue.use(plugin)
//
// window.Vue = Vue
// Vue.config.debug = true
// */

import VueRangeDatePicker from './RangedatePicker.vue'

new window.Vue({
  el: 'app',
  template: `<div id="demo">
<div>
<strong>Full form</strong>
<vue-rangedate-picker></vue-rangedate-picker>
</div>
</div>`,
  components: { VueRangeDatePicker }
})
