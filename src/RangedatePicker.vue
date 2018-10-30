<template>
	<div class="calendar-root">
		<div class="vue-rangedate-picker-input-date" @click="toggleCalendar()"> {{getRange('start')}} - {{getRange('end')}}</div>
		<div class="calendar" :class="{'calendar-thin' : !diario, 'calendar-large': diario}" v-if="isOpen">
			<div class="calendar-head">
				<h2>{{captions.title}}</h2>
				<i class="close" @click="toggleCalendar()">&times</i>
			</div>
			<div class="calendar-range">
				<ul class="calendar_preset">
					<li
						class="calendar_preset-ranges"
						v-for="(item, idx) in finalPresetRanges"
						:key="idx"
						@click="updatePreset(item)"
						:class="{'active-preset': presetActive === item.active}">
						{{item.label}}
					</li>
					
				</ul>
			</div>

			<div class="calendar-wrap periodo-diario" v-if="diario">
				<div class="calendar_month_left" v-if="showMonth">
					<div class="months-text">
						<i class="left" @click="goPrevMonth"></i>
						{{monthsLocale[activeMonthStart] +' '+ activeYearStart}}</div>
						<ul  :class="s.daysWeeks">
							<li v-for="item in shortDaysLocale" :key="item">{{item}}</li>
						</ul>
						<ul v-for="r in 6" :class="[s.days]" :key="r">
							<li :class="[{[s.daysSelected]: isDateSelected(r, i, 'first', startMonthDay, endMonthDate),
							[s.daysInRange]: isDateInRange(r, i, 'first', startMonthDay, endMonthDate),
							[s.dateDisabled]: isDateDisabled(r, i, activeMonthStart, activeYearStart)}]" 
								v-for="i in numOfDays" :key="i" v-html="getDayCell(r, i, startMonthDay, endMonthDate)"
								@click="selectFirstItem(r, i)"></li>
						</ul>
				</div>
				<div class="calendar_month_right">
					<div class="months-text">
						{{monthsLocale[startNextActiveMonth] +' '+ activeYearEnd}}
						<i class="right" @click="goNextMonth"></i>
					</div>
					<ul :class="s.daysWeeks">
							<li v-for="item in shortDaysLocale" :key="item">{{item}}</li>
					</ul>
					<ul v-for="r in 6" :class="[s.days]" :key="r">
						<li :class="[{[s.daysSelected]: isDateSelected(r, i, 'second', startNextMonthDay, endNextMonthDate),
						[s.daysInRange]: isDateInRange(r, i, 'second', startNextMonthDay, endNextMonthDate),
						[s.dateDisabled]: isDateDisabled(r, i, startNextActiveMonth, activeYearEnd)}]"
								v-for="i in numOfDays" :key="i" v-html="getDayCell(r, i, startNextMonthDay, endNextMonthDate)"
									@click="selectSecondItem(r, i)"></li>
					</ul>
				</div>
			</div>
			<div class="calendar-wrap periodo-mensal-anual" v-if="mensal"> 
				<div class="calendar_select_year">
					<label for="">Ano</label>
					<select v-model="selectedYearFromMensalPeriod">
						<option v-for="ano in getYearInterval()" :key="ano">{{ano}}</option>
					</select>
				</div>
				<div class="calendar_mont">
					<div class="range-month-year"  v-for="i in shortMonths.length" :key="i-1" @click="selectMes(i-1)" 
					:class="[{[s.monthsYearsSelected]: isMonthSelected(i-1),
						[s.monthsYearsInRange]: isMonthInRange(i-1),
						[s.monthsYearsDisabled]: isMonthDisabled(i-1)}]" > {{shortMonths[i-1]}}</div>
				</div>
			</div>
			<div class="calendar-wrap periodo-mensal-anual" v-if="anual"> 
				<div class="calendar_year">
					<div class="range-month-year"  v-for="i in getYearInterval().length" :key="i-1" @click="selectYear(i-1)" 
					:class="[{[s.monthsYearsSelected]: isYearSelected(i-1),
						[s.monthsYearsInRange]: isYearInRange(i-1)}]" > {{getYearInterval()[i-1]}}</div>
				</div>
			</div>
			<div class="calendar-wrap calendar-foot">
				<button type="button" class="calendar-btn btn-apply" @click="setDateValue()">{{captions.ok_button}}</button>
				<button type="button" class="calendar-btn btn-clear" @click="clearDateValue()">{{captions.clear_button}}</button>
			</div>
			
		</div>
	</div>
</template>

<script src="./js/rangedate-picker.js"></script>

<style lang="css" scoped>
.vue-rangedate-picker-input-date {
	display: block;
	font-size: 14px;
	width: 230px;
	cursor: pointer;
	padding: 10px;
	border-radius: 5px;
	border: 1px solid #E0E0E0;
}

.vue-rangedate-picker-input-date::after {
	content: "▼";
	float: right;
	font-size: smaller;
	color: #E0E0E0;
}

.active-preset {
	border: 1px solid #0096d9;
	color: #0096d9;
	border-radius: 3px;
}

.months-text {
	text-align: center;
	font-weight: bold;
}

.months-text .left {
	float: left;
	cursor: pointer;
	width: 16px;
	height: 16px;
	background-image: url("data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMxLjQ5NCAzMS40OTQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMxLjQ5NCAzMS40OTQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPHBhdGggZD0iTTEwLjI3Myw1LjAwOWMwLjQ0NC0wLjQ0NCwxLjE0My0wLjQ0NCwxLjU4NywwYzAuNDI5LDAuNDI5LDAuNDI5LDEuMTQzLDAsMS41NzFsLTguMDQ3LDguMDQ3aDI2LjU1NCAgYzAuNjE5LDAsMS4xMjcsMC40OTIsMS4xMjcsMS4xMTFjMCwwLjYxOS0wLjUwOCwxLjEyNy0xLjEyNywxLjEyN0gzLjgxM2w4LjA0Nyw4LjAzMmMwLjQyOSwwLjQ0NCwwLjQyOSwxLjE1OSwwLDEuNTg3ICBjLTAuNDQ0LDAuNDQ0LTEuMTQzLDAuNDQ0LTEuNTg3LDBsLTkuOTUyLTkuOTUyYy0wLjQyOS0wLjQyOS0wLjQyOS0xLjE0MywwLTEuNTcxTDEwLjI3Myw1LjAwOXoiIGZpbGw9IiMwMDZERjAiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==");
}

.months-text .right {
	float: right;
	cursor: pointer;
	width: 16px;
	height: 16px;
	background-image: url("data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMxLjQ5IDMxLjQ5IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMS40OSAzMS40OTsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiPgo8cGF0aCBkPSJNMjEuMjA1LDUuMDA3Yy0wLjQyOS0wLjQ0NC0xLjE0My0wLjQ0NC0xLjU4NywwYy0wLjQyOSwwLjQyOS0wLjQyOSwxLjE0MywwLDEuNTcxbDguMDQ3LDguMDQ3SDEuMTExICBDMC40OTIsMTQuNjI2LDAsMTUuMTE4LDAsMTUuNzM3YzAsMC42MTksMC40OTIsMS4xMjcsMS4xMTEsMS4xMjdoMjYuNTU0bC04LjA0Nyw4LjAzMmMtMC40MjksMC40NDQtMC40MjksMS4xNTksMCwxLjU4NyAgYzAuNDQ0LDAuNDQ0LDEuMTU5LDAuNDQ0LDEuNTg3LDBsOS45NTItOS45NTJjMC40NDQtMC40MjksMC40NDQtMS4xNDMsMC0xLjU3MUwyMS4yMDUsNS4wMDd6IiBmaWxsPSIjMDA2REYwIi8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=");
}

.calendar-root,
.calendar-title {
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.calendar-right-to-left {
	margin-left: -460px;
}

.calendar {
	display: block;
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-size: 12px;
	box-shadow: -3px 4px 12px -1px #ccc;
	background: #fff;
	position: absolute;
	z-index: 9;
}

.calendar-thin {
	width: 400px;
}

.calendar-large {
	width: 700px;
	height: 300px;
}

.calendar-head h2 {
	padding: 20px 0 0 20px;
	font-size: 14px;
	margin: 0;
}

.calendar-foot {
	width: 100%;
}

.calendar-foot > button {
	display: inline-block;
	margin: 0 10px 10px 10px
}

.close:hover {
	cursor: pointer;
}

.close {
	float: right;
	padding: 0 10px;
	margin-top: -35px;
	font-size: 32px;
	font-weight: normal;
}

.calendar ul {
	list-style-type: none;
}

.calendar-wrap {
	display: inline-block;
	float: left;
}

.periodo-diario {
	width: 75%;
}

.periodo-mensal-anual {
	width: 70%;
}

.calendar-range {
	float: left;
	padding: 0 12px;
	border-right: 1px solid #ccc;
	margin-top: 15px;
}

.calendar_month_left,
.calendar_month_right {
	float: left;
	width: 43%;
	padding: 10px;
	margin: 5px;
}

.calendar_weeks {
	margin: 0;
	padding: 10px 0;
	width: auto;
}

.calendar_weeks li {
	display: inline-block;
	width: 13.6%;
	color: #999;
	text-align: center;
}

.calendar_days {
	margin: 0;
	padding: 0;
}

.calendar_days li {
	display: inline-block;
	width: 13.6%;
	color: #333;
	text-align: center;
	cursor: pointer;
	line-height: 2em;
}

.calendar_preset li {
	line-height: 2.6em;
	width: auto;
	display: block;
}

.calendar_days li:hover {
	background: #eee;
	color: #000;
}
li.calendar_days--disabled{
	cursor: default;
	color: #ccc;
	pointer-events: none;
}

.calendar_months_years_disabled {
	cursor: default;
	color: #ccc;
	pointer-events: none;
}

li.calendar_days_selected, .calendar_months_years_selected {
	background: rgb(55, 82, 109, .8);
	color: #fff;
}

li.calendar_days_in-range, .calendar_months_years_in_range {
	background: #86BBD8;
	color: #fff;
}

.calendar_preset {
	padding: 0;
}

.calendar_preset li.calendar_preset-ranges {
	padding: 0 30px 0 10px;
	margin-bottom: 5px;
	cursor: pointer;
	margin-top: 1px;
}

.calendar_preset li.calendar_preset-ranges:hover {
	background: #eee;
}

.calendar-btn{
	border: none;
	padding: 5px;
	font-size: 14px;
	border-radius: 3px;
	cursor:pointer;
}

.btn-clear {
	float: right;
	color:#86BBD8;
	background: #EEEEEE;
}

.btn-apply {
	background: #86BBD8;
	color: #fff;
	float: left;
}

.range-month-year {
	font-size: 15px;
	padding: 3px 5px;
	width: 22%;
	float: left;
	cursor: pointer;
	text-align: center;
}

.range-month-year:hover {
	background: #eee;
	color: #000;
}

.calendar_select_year {
	width: 100%;
	text-align: center;
	font-size: 14px;
	padding-bottom: 5px;
	border-bottom: 1px solid #ccc;
	margin-bottom: 5px;
}

.calendar_select_year > select {
	background: #eee;
	border: none;
	border-radius: 3px;
	padding: 5px;
}

.calendar_year {
	height: 100px;
	overflow: auto;
	margin-top: 15px;
}

</style>
