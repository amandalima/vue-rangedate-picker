VueRangedatePicker.default.install(Vue)

var app = new Vue({
  el: '#app',
  data () {
    return {
      selectedDate: {
        start: '',
        end: ''
      },
      periodo: ''
    }
  },
  methods: {
    onDateSelected: function (daterange) {
      this.selectedDate = daterange
    },
    periodoSelecionado: function (periodo) {
      this.periodo = periodo
    }
  }
})
