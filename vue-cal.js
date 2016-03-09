(function () {

    //{
    //    year: 2016,
    //    month: 2,
    //    day: 12,
    //    text: "2016-01-02",
    //    inMonth: true
    //}

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
            entity.inMonth = m == currMonth;
        }
        return entity;
    }

    function getNextMonday(date) {
        if (typeof  date == String) {
            date = new Date(date);
        }
    }

    function getWeekDays(date) {
        if (typeof  date == "string") {
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


    window.VueCal = {
        yearDays: getYearDays,
        yearDaysM: getYearDaysM,
        monthDays: getMonthDays,
        monthDaysM: getMonthDaysMatrix,
        weekDays: getWeekDays
    };
})();