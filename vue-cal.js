(function () {

    // *********************************** 基础方法

    function getDayStr(date) {
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var mstr = m < 10 ? ("0" + m) : m;
        var dstr = d < 10 ? ("0" + d) : d;
        return "" + date.getFullYear() + "-" + mstr + "-" + dstr;
    }

    function getMonthStr(date) {
        var m = date.getMonth() + 1;
        var mstr = m < 10 ? "0" + m : m;
        return "" + date.getFullYear() + "-" + mstr;
    }

    function getDayEntity(y, m, d, currMonth) {
        var entity = {
            'year': y,
            'month': m,
            'day': d
        };
        var mstr = m < 10 ? "0" + m : m;
        var dstr = d < 10 ? "0" + d : d;
        entity.text = entity.year + "-" + mstr + "-" + dstr;
        if (currMonth) {
            entity.inMonth = (m == currMonth);
        }
        return entity;
    }

    function getMonday(date, flag) {
        if (typeof  date == "string") {
            date = new Date(date);
        }
        var day = date.getDay() - 1;
        if (day == -1) {
            day = 6;
        }
        var start = new Date(date - 0 + -day * 86400000);
        // 下一周
        if (flag > 0) {
            start = new Date(start - 0 + 7 * 86400000);
        }
        // 前一周
        else if (flag < 0) {
            start = new Date(start - 0 + -7 * 86400000);
        }
        // 本周
        else {
            // nothing
        }
        return start;
    }

    function getWeekDays(date) {
        if (typeof date == "string") {
            date = new Date(date);
        }
        var month = date.getMonth() + 1;
        var day = date.getDay() - 1;
        if (day == -1) {
            day = 6;
        }
        var start = new Date(date - 0 + -day * 86400000)
        var arr = [];
        for (var i = 0; i < 7; i++) {
            arr.push(getDayEntity(start.getFullYear(), start.getMonth() + 1, start.getDate()))
            start = new Date(start - 0 + 86400000)
        }
        return arr;
    }

    function getMonthDays(year, month, noMatrix) {
        year = parseInt(year);
        month = parseInt(month);
        var time = new Date(year, month - 1, 1);  // 本月第一天
        var lastMonth = month - 1;
        var nextMonth = month + 1;
        var lastYear = year;
        var nextYear = year;
        // 1月份
        if (month == 1) {
            lastYear = year - 1;
            nextYear = year;
            lastMonth = 12;
            nextMonth = 2;
        }
        // 12月
        else if (month == 12) {
            nextYear = year + 1;
            lastMonth = 11;
            nextMonth = 1;
        }
        // 上月, 本月, 下月
        var maxNumber = 42
        var r1 = [],
            r2 = [],
            r3 = [];
        var lastFix = time.getDay() - 1;
        lastFix = lastFix < 0 ? lastFix + 7 : lastFix; // 上个月需要显示的
        var maxDate = new Date(year, month, 0).getDate();  //当前月份的
        var lastMaxDate = new Date(year, month - 1, 0).getDate(); //上个月份最大天数
        var nextFix = maxNumber - maxDate - lastFix; // 下个月需要显示的
        var i, t;
        for (i = 0; i < maxDate; i++) {
            r2[i] = getDayEntity(year, month, i + 1, month);
        }
        // 仅仅本月
        if (noMatrix) {
            return r2;
        }
        // 一般日历显示用
        else {
            for (i = 0; i < lastFix; i++) {
                t = lastMaxDate - lastFix + i + 1;
                r1[i] = getDayEntity(lastYear, lastMonth, t, month);
            }
            for (i = 0; i < nextFix; i++) {
                r3[i] = getDayEntity(nextYear, nextMonth, i + 1, month);
            }
            return r1.concat(r2, r3);
        }
    }

    function getMonthDaysMatrix(year, month) {
        var mdays = getMonthDays(year, month);
        var arr = [];
        for (i = 0; i < 6; i++) {
            arr.push(mdays.splice(0, 7))
        }
        return arr;
    }


    function getYearDays(year) {
        return _getYearDays(year, false);
    }

    function getYearDaysM(year) {
        return _getYearDays(year, true);
    }

    function _getYearDays(year, asMatrix) {
        year = parseInt(year);
        var arr = [];
        for (var i = 1; i <= 12; i++) {
            arr.push(asMatrix ? getMonthDaysMatrix(year, i) : getMonthDays(year, i));
        }
        return arr;
    }


    // *********************************** vue组件
    var MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    var WEEKS = ['一', '二', '三', '四', '五', '六', '日'];
    var HOURS = [];
    for (var i = 0; i < 24; i++) {
        HOURS.push(i + "")
    }

    // 月视图
    var VueCalMonthMixin = {
        props: ['date'],
        data: function () {
            var y = this.date.getFullYear();
            var m = this.date.getMonth() + 1;
            return {
                wtips: WEEKS,
                mdays: getMonthDaysMatrix(y, m),
                vcal: {
                    year: y,
                    month: m,
                    info: getMonthStr(this.date),
                    sel: "",
                    currday: getDayStr(new Date()),
                }
            }
        },
        methods: {
            refreshVcal: function (date) {
                this.vcal.year = date.getFullYear();
                this.vcal.month = date.getMonth() + 1;
                this.refreshVcalInfo();
            },
            refreshVcalInfo: function () {
                var mstr = this.vcal.month < 10 ? "0" + this.vcal.month : this.vcal.month;
                this.vcal.info = this.vcal.year + "-" + mstr;
                this.vcal.currday = getDayStr(new Date());
                this.vcal.sel = "";
                console.log(this.vcal.currday);
            },
            refreshCal: function () {
                this.mdays = getMonthDaysMatrix(this.vcal.year, this.vcal.month);
            },
            toPrev: function () {
                if (this.vcal.month == 1) {
                    this.vcal.month = 12;
                    this.vcal.year -= 1;
                } else {
                    this.vcal.month -= 1;
                }
                this.refreshVcalInfo();
                this.refreshCal();
            },
            toNext: function () {
                if (this.vcal.month == 12) {
                    this.vcal.month = 1;
                    this.vcal.year += 1;
                } else {
                    this.vcal.month += 1;
                }
                this.refreshVcalInfo();
                this.refreshCal();
            },
            toToday: function () {
                this.refreshVcal(new Date());
                this.refreshCal();
            },
            selDay: function (day) {
                if (day.inMonth) {
                    this.vcal.sel = day.text;
                }
            }
        }
    };

    var VueCalMonth = Vue.extend({
        template: `
            <div class="vcal">
                <div class="vcal-header">
                    <div class="vcal-info">{{vcal.info}}</div>
                    <div class="vcal-btns">
                        <span @click="toPrev"><</span>
                        <span @click="toToday">Today</span>
                        <span @click="toNext">></span>
                    </div>
                </div>
                <div class="vcal-body">
                    <div class="vcal-month-entity">
                        <div class="header">
                            <div class="vcal-matrix-entity week-tip" v-for="(index, wn) in wtips">{{wn}}</div>
                        </div>
                        <div class="container">
                            <div class="row" v-for="(ri, rdays) in mdays">
                                <div class="vcal-matrix-entity day-entity"
                                    @click="selDay(day)"
                                    v-bind:class="{'ds-outmonth': !day.inMonth, 'ds-today': day.text == vcal.currday, 'ds-select': vcal.sel == day.text}"
                                    v-for="(di, day) in rdays">
                                    <div class="day-tip">{{day.day}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        mixins: [VueCalMonthMixin]
    });

    // 年视图
    var VueCalYearMixin = {
        props: ['date'],
        data: function () {
            var y = this.date.getFullYear();
            return {
                mtips: MONTHS,
                wtips: WEEKS,
                ydays: getYearDaysM(y),
                vcal: {
                    year: y,
                    info: "" + y,
                    sel: "",
                    currday: getDayStr(new Date()),
                }
            }
        },
        methods: {
            refreshVcalInfo: function () {
                this.vcal.info = this.vcal.year;
                this.vcal.currday = getDayStr(new Date());
                this.vcal.sel = "";
            },
            refreshCal: function () {
                this.ydays = getYearDaysM(this.vcal.year);
            },
            toPrev: function () {
                this.vcal.year -= 1;
                this.refreshVcalInfo();
                this.refreshCal();
            },
            toNext: function () {
                this.vcal.year += 1;
                this.refreshVcalInfo();
                this.refreshCal();
            },
            toToday: function () {
                this.vcal.year = new Date().getFullYear();
                this.refreshVcalInfo();
                this.refreshCal();
            },
            selDay: function (day) {
                if (day.inMonth) {
                    this.vcal.sel = day.text;
                }
            }
        }
    };

    var VueCalYear = Vue.extend({
        template: `
            <div class="vcal">
                <div class="vcal-header">
                    <div class="vcal-info">{{vcal.info}}</div>
                    <div class="vcal-btns">
                        <span @click="toPrev"><</span>
                        <span @click="toToday">Today</span>
                        <span @click="toNext">></span>
                    </div>
                </div>
                <div class="vcal-body">
                    <div class="vcal-year-entity">
                        <div class="vcal-year-month-wrap" v-for="(yi, mdays) in ydays">
                            <div class="header">
                                {{mtips[yi]}}
                            </div>
                            <div class="container">
                                <div class="vcal-month-entity">
                                    <div class="header">
                                        <div class="vcal-matrix-entity week-tip" v-for="(index, wn) in wtips">{{wn}}</div>
                                    </div>
                                    <div class="container">
                                        <div class="row" v-for="(ri, rdays) in mdays">
                                            <div class="vcal-matrix-entity day-entity"
                                                @click="selDay(day)"
                                                v-bind:class="{'ds-outmonth': !day.inMonth, 'ds-today': day.text == vcal.currday, 'ds-select': vcal.sel == day.text}"
                                                v-for="(di, day) in rdays">
                                                <div class="day-tip">{{day.day}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        mixins: [VueCalYearMixin]
    });

    // 周视图
    var VueCalWeek = Vue.extend({
        template: "#vcal-week",
        props: ['date'],
        data: function () {
            return {
                wtips: WEEKS,
                wdays: getWeekDays(this.date),
                vcal: {
                    sel: "",
                    currday: getDayStr(new Date()),
                }
            }
        },
        methods: {
            refreshVcalInfo: function () {
                this.vcal.info = this.vcal.year;
                this.vcal.currday = getDayStr(new Date());
                this.vcal.sel = "";
            },
            refreshCal: function () {
                this.wdays = getWeekDays(this.vcal.year);
            },
            toPrev: function () {
                this.vcal.year -= 1;
                this.refreshVcalInfo();
                this.refreshCal();
            },
            toNext: function () {
                this.vcal.year += 1;
                this.refreshVcalInfo();
                this.refreshCal();
            },
            toToday: function () {
                this.vcal.year = new Date().getFullYear();
                this.refreshVcalInfo();
                this.refreshCal();
            },
            selDay: function (day) {
                if (day.inMonth) {
                    this.vcal.sel = day.text;
                }
            }
        }
    });


    window.VueCal = {
        // function
        yearDays: getYearDays,
        yearDaysM: getYearDaysM,
        monthDays: getMonthDays,
        monthDaysM: getMonthDaysMatrix,
        weekDays: getWeekDays,
        monday: getMonday,
        // mixin
        Mixin: {
            Month: VueCalMonthMixin,
            Year: VueCalYearMixin
        },
        // component
        Month: VueCalMonth,
        Year: VueCalYear,
        Week: VueCalWeek
    };
})();