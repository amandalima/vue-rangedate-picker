import fecha from 'fecha'

const defaultConfig = {}
const defaultI18n = 'ID'
const availableMonths = {
  EN: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November',
    'December'],
  PT: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'outubro', 'Novembro', 'Dezembro'],
  ID: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November',
    'Desember']
}

const shortMonths = {
  EN: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  PT: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  ID: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
}

const availableShortDays = {
  EN: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  PT: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
  ID: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
}

const presetRangeLabel = {
  EN: {
    periodomensal: 'Mensal',
    periododiario: 'Diário',
    periodoanual: 'Anual'
  },
  PT: {
    periodomensal: 'Mensal',
    periododiario: 'Diário',
    periodoanual: 'Anual'
  },
  ID: {
    periodomensal: 'Mensal',
    periododiario: 'Diário',
    periodoanual: 'Anual'
  }
}

const defaultCaptions = {
  'title': 'Escolha um intervalo',
  'ok_button': 'Aplicar',
  'clear_button': 'Limpar'
}

const defaultStyle = {
  daysWeeks: 'calendar_weeks',
  days: 'calendar_days',
  daysSelected: 'calendar_days_selected',
  daysInRange: 'calendar_days_in-range',
  firstDate: 'calendar_month_left',
  secondDate: 'calendar_month_right',
  presetRanges: 'calendar_preset-ranges',
  dateDisabled: 'calendar_days--disabled',
  monthsYearsSelected: 'calendar_months_years_selected',
  monthsYearsInRange: 'calendar_months_years_in_range',
  monthsYearsDisabled: 'calendar_months_years_disabled'
}

const defaultPresets = function (i18n = defaultI18n) {
  return {
    periodomensal: function () {
      return {
        label: presetRangeLabel[i18n].periodomensal,
        active: 'mensal',
        mensal: true,
        diario: false,
        anual: false
      }
    },
    periododiario: function () {
      return {
        label: presetRangeLabel[i18n].periododiario,
        active: 'diario',
        mensal: false,
        diario: true,
        anual: false
      }
    },
    periodoanual: function () {
      return {
        label: presetRangeLabel[i18n].periodoanual,
        active: 'anual',
        mensal: false,
        diario: false,
        anual: true
      }
    }
  }
}
export default {
  name: 'vue-rangedate-picker',
  props: {
    configs: {
      type: Object,
      default: () => defaultConfig
    },
    i18n: {
      type: String,
      default: defaultI18n
    },
    months: {
      type: Array,
      default: () => null
    },
    shortDays: {
      type: Array,
      default: () => null
    },
    // options for captions are: title, ok_button
    captions: {
      type: Object,
      default: () => defaultCaptions
    },
    format: {
      type: String,
      default: 'DD MMM YYYY'
    },
    styles: {
      type: Object,
      default: () => {}
    },
    initRange: {
      type: Object,
      default: () => null
    },
    startActiveMonth: {
      type: Number,
      default: new Date().getMonth()
    },
    startActiveYear: {
      type: Number,
      default: new Date().getFullYear()
    },
    presetRanges: {
      type: Object,
      default: () => null
    },
    righttoleft: {
      type: String,
      default: 'false'
    },
    anoInicial: {
      type: String,
      default: '1900'
    }
  },
  data () {
    return {
      dateRange: {},
      numOfDays: 7,
      isFirstChoice: true,
      isOpen: false,
      presetActive: 'mensal',
      showMonth: false,
      activeMonthStart: this.startActiveMonth,
      activeYearStart: this.startActiveYear,
      activeYearEnd: this.startActiveYear,
      diario: false,
      mensal: true,
      anual: false,
      selectedYearFromMensalPeriod: '',
      yearsArray: [],
      monthRange: {
        start: '',
        end: ''
      },
      yearRange: {
        start: '',
        end: ''
      }
    }
  },
  created () {
    if (this.activeMonthStart === 11) {
      this.activeYearEnd = this.activeYearStart + 1
    }
    this.selectedYearFromMensalPeriod = this.getAtualYear()
    this.yearsArray = this.getYearInterval()
  },
  watch: {
    startNextActiveMonth: function (value) {
      if (value === 0) this.activeYearEnd = this.activeYearStart + 1
    }
  },
  computed: {
    monthsLocale: function () {
      return this.months || availableMonths[this.i18n]
    },
    shortMonths: function () {
      return shortMonths[this.i18n]
    },
    shortDaysLocale: function () {
      return this.shortDays || availableShortDays[this.i18n]
    },
    s: function () {
      return Object.assign({}, defaultStyle, this.style)
    },
    startMonthDay: function () {
      return new Date(this.activeYearStart, this.activeMonthStart, 1).getDay()
    },
    startNextMonthDay: function () {
      return new Date(this.activeYearStart, this.startNextActiveMonth, 1).getDay()
    },
    endMonthDate: function () {
      return new Date(this.activeYearEnd, this.startNextActiveMonth, 0).getDate()
    },
    endNextMonthDate: function () {
      return new Date(this.activeYearEnd, this.activeMonthStart + 2, 0).getDate()
    },
    startNextActiveMonth: function () {
      return this.activeMonthStart >= 11 ? 0 : this.activeMonthStart + 1
    },
    finalPresetRanges: function () {
      const tmp = {}
      const presets = this.presetRanges || defaultPresets(this.i18n)
      for (const i in presets) {
        const item = presets[i]
        let plainItem = item
        if (typeof item === 'function') {
          plainItem = item()
        }
        tmp[i] = plainItem
      }
      return tmp
    },
    isRighttoLeft: function () {
      return this.righttoleft === 'true'
    }
  },
  methods: {
    toggleCalendar: function () {
      this.isOpen = !this.isOpen
      this.showMonth = !this.showMonth
      return
    },
    getDateString: function (date, format = this.format) {
      if (!date) {
        return null
      }
      const dateparse = new Date(Date.parse(date))
      return fecha.format(new Date(dateparse.getFullYear(), dateparse.getMonth(), dateparse.getDate() - 1), format)
    },
    getRange: function (range) {
      if (this.mensal) {
        if (range === 'end' && this.monthRange.end !== '') {
          return this.shortMonths[this.monthRange[range]] + ' ' + this.selectedYearFromMensalPeriod
        }
        return this.shortMonths[this.monthRange[range]]
      } else if (this.diario) {
        return this.getDateString(this.dateRange[range])
      } else if (this.anual) {
        return this.yearsArray[this.yearRange[range]]
      }
    },
    getFinalRangeFromMonth: function () {
      const range = {}
      range.start = new Date(this.selectedYearFromMensalPeriod, this.monthRange.start, 1, null, null, null, null)
      if (this.monthRange.end === '') {
        range.end = new Date(this.selectedYearFromMensalPeriod, this.monthRange.start + 1, 0, null, null, null, null)
      } else {
        range.end = new Date(this.selectedYearFromMensalPeriod, this.monthRange.end + 1, 0, null, null, null, null)
      }
      return range
    },
    getFinalRangeFromYear: function () {
      const range = {}
      const endYear = parseInt(this.yearsArray[this.yearRange.end]) + 1
      range.start = new Date(this.yearsArray[this.yearRange.start], 0, 1, null, null, null, null)
      if (this.yearRange.end === '') {
        range.end = new Date(parseInt(this.yearsArray[this.yearRange.start]) + 1, 0, 0, null, null, null, null)
      } else {
        range.end = new Date(endYear, 0, 0, null, null, null, null)
      }
      return range
    },
    getDayIndexInMonth: function (r, i, startMonthDay) {
      const date = (this.numOfDays * (r - 1)) + i
      return date - startMonthDay
    },
    getDayCell (r, i, startMonthDay, endMonthDate) {
      const result = this.getDayIndexInMonth(r, i, startMonthDay)
      // bound by > 0 and < last day of month
      return result > 0 && result <= endMonthDate ? result : '&nbsp;'
    },
    getNewDateRange (result, activeMonth, activeYear) {
      const newData = {}
      let key = 'start'
      if (!this.isFirstChoice) {
        key = 'end'
      } else {
        newData['end'] = null
      }
      const resultDate = new Date(activeYear, activeMonth, result)
      if (!this.isFirstChoice && resultDate < this.dateRange.start) {
        this.isFirstChoice = false
        return { start: resultDate }
      }

      // toggle first choice
      this.isFirstChoice = !this.isFirstChoice
      newData[key] = resultDate
      return newData
    },
    selectFirstItem (r, i) {
      const result = this.getDayIndexInMonth(r, i, this.startMonthDay) + 1
      this.dateRange = Object.assign({}, this.dateRange, this.getNewDateRange(result, this.activeMonthStart,
      this.activeYearStart))
      if (this.dateRange.start && this.dateRange.end) {
        this.presetActive = ''
      }
    },
    selectSecondItem (r, i) {
      const result = this.getDayIndexInMonth(r, i, this.startNextMonthDay) + 1
      this.dateRange = Object.assign({}, this.dateRange, this.getNewDateRange(result, this.startNextActiveMonth,
      this.activeYearEnd))
      if (this.dateRange.start && this.dateRange.end) {
        this.presetActive = ''
      }
    },
    selectMes (pos) {
      if (this.monthRange.start === '') {
        this.monthRange.start = pos
      } else if (this.monthRange.start >= pos || this.monthRange.end !== '') {
        this.monthRange.start = pos
        this.monthRange.end = ''
      } else {
        this.monthRange.end = pos
      }
    },
    isDateSelected (r, i, key, startMonthDay, endMonthDate) {
      const result = this.getDayIndexInMonth(r, i, startMonthDay) + 1
      if (result < 2 || result > endMonthDate + 1) return false

      let currDate = null
      if (key === 'first') {
        currDate = new Date(this.activeYearStart, this.activeMonthStart, result)
      } else {
        currDate = new Date(this.activeYearEnd, this.startNextActiveMonth, result)
      }
      return (this.dateRange.start && this.dateRange.start.getTime() === currDate.getTime()) ||
        (this.dateRange.end && this.dateRange.end.getTime() === currDate.getTime())
    },
    isDateInRange (r, i, key, startMonthDay, endMonthDate) {
      const result = this.getDayIndexInMonth(r, i, startMonthDay) + 1
      if (result < 2 || result > endMonthDate + 1) return false

      let currDate = null
      if (key === 'first') {
        currDate = new Date(this.activeYearStart, this.activeMonthStart, result)
      } else {
        currDate = new Date(this.activeYearEnd, this.startNextActiveMonth, result)
      }
      return (this.dateRange.start && this.dateRange.start.getTime() < currDate.getTime()) &&
        (this.dateRange.end && this.dateRange.end.getTime() > currDate.getTime())
    },
    isDateDisabled (r, i, startMonthDay, endMonthDate) {
      const result = this.getDayIndexInMonth(r, i, startMonthDay)
      // bound by > 0 and < last day of month
      return !(result > 0 && result <= endMonthDate)
    },
    goPrevMonth () {
      const prevMonth = new Date(this.activeYearStart, this.activeMonthStart, 0)
      this.activeMonthStart = prevMonth.getMonth()
      this.activeYearStart = prevMonth.getFullYear()
      this.activeYearEnd = prevMonth.getFullYear()
    },
    goNextMonth () {
      const nextMonth = new Date(this.activeYearEnd, this.startNextActiveMonth, 1)
      this.activeMonthStart = nextMonth.getMonth()
      this.activeYearStart = nextMonth.getFullYear()
      this.activeYearEnd = nextMonth.getFullYear()
    },
    updatePreset (item) {
      this.presetActive = item.active
      this.mensal = item.mensal
      this.anual = item.anual
      this.diario = item.diario
    },
    setDateValue: function () {
      if (this.mensal && this.monthRange.start !== '') {
        this.$emit('selected', this.getFinalRangeFromMonth())
        this.$emit('periodo', 'MENSAL')
      }
      if (this.diario) {
        this.$emit('selected', this.dateRange)
        this.$emit('periodo', 'DIARIO')
      }
      if (this.anual && this.yearRange.start !== '') {
        this.$emit('selected', this.getFinalRangeFromYear())
        this.$emit('periodo', 'ANUAL')
      }
      this.toggleCalendar()
    },
    clearDateValue: function () {
      this.monthRange.start = ''
      this.monthRange.end = ''
      this.dateRange = {}
      this.yearRange.start = ''
      this.yearRange.end = ''
      this.$emit('selected', {})
      this.$emit('periodo', '')
    },
    isMonthSelected: function (pos) {
      if (this.monthRange.start === pos || this.monthRange.end === pos) {
        return true
      } else {
        return false
      }
    },
    isMonthInRange: function (pos) {
      if (this.monthRange.start === '' || this.monthRange.end === '') {
        return false
      } else if (this.monthRange.start < pos && this.monthRange.end > pos) {
        return true
      }
    },
    isMonthDisabled: function (pos) {
      const date = new Date()
      if (this.selectedYearFromMensalPeriod.toString() === date.getFullYear().toString() && pos > date.getMonth()) {
        return true
      }
      return false
    },
    isYearSelected: function (year) {
      if (this.yearRange.start === year || this.yearRange.end === year) {
        return true
      } else {
        return false
      }
    },
    isYearInRange: function (year) {
      if (this.yearRange.start === '' || this.yearRange.end === '') {
        return false
      } else if (this.yearRange.start < year && this.yearRange.end > year) {
        return true
      }
    },
    getAtualYear: function () {
      const date = new Date()
      return date.getFullYear()
    },
    getYearInterval: function () {
      const interval = []
      for (let i = this.anoInicial; i <= this.getAtualYear(); i++) {
        interval.push(i.toString())
      }
      return interval
    },
    selectYear: function (pos) {
      if (this.yearRange.start === '') {
        this.yearRange.start = pos
      } else if (this.yearRange.start >= pos || this.yearRange.end !== '') {
        this.yearRange.start = pos
        this.yearRange.end = ''
      } else {
        this.yearRange.end = pos
      }
    }
  }
}
