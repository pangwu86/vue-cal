var VueMonthMixin = Vue.extend({
    template: "#vcal-month-mixin",
    mixins: [VueCal.Mixin.Month],
    methods: {
        testItems: function (day) {
            var arr = [];
            if (day.inMonth) {
                arr.push('1');
            }
            if (day.day % 3 == 0) {
                arr.push('2');
            }
            if (day.day % 5 == 0) {
                arr.push('3');
            }
            return arr;
        }
    },
    components: {
        'vcal-month-dayrender': {
            template: "#vcal-month-dayrender",
            props: ['day', 'vcal', 'items']
        }
    }
});


var VueYearMixin = Vue.extend({
    template: "#vcal-year-mixin",
    mixins: [VueCal.Mixin.Year],
    methods: {
        testItems: function (day) {
            var arr = [];
            if (day.inMonth) {
                arr.push('1');
                arr.push('1');
                arr.push('1');
                arr.push('1');
                arr.push('1');
            }
            if (day.day % 3 == 0) {
                arr.push('2');
                arr.push('2');
                arr.push('2');
                arr.push('2');
                arr.push('2');
            }
            if (day.day % 5 == 0) {
                arr.push('3');
                arr.push('3');
                arr.push('3');
                arr.push('3');
                arr.push('3');
            }
            if (Math.random() < 0.3) {
                arr = [];
            }
            return arr;
        }
    },
    components: {
        'vcal-year-dayrender': {
            template: "#vcal-year-dayrender",
            props: ['day', 'vcal', 'items'],
            methods: {}
        }
    }
});


var VueWeekMixin = Vue.extend({
    template: "#vcal-week-mixin",
    mixins: [VueCal.Mixin.Week],
    methods: {
        testItems: function (day) {
            var arr = [];
            if (day.day % 3 == 0) {
                arr.push('2');
                arr.push('3');
            }
            if (day.day % 5 == 0) {
                arr.push('4');
                arr.push('5');
                arr.push('6');
            }
            if (Math.random() < 0.3) {
                arr = [];
            }
            return arr;
        }
    },
    components: {
        'vcal-week-dayrender': {
            template: "#vcal-week-dayrender",
            props: ['day', 'vcal', 'items']
        }
    }
});


var demoMonth = new Vue({
    el: 'body',
    data: {
        date: new Date()
    },
    ready: function () {
    },
    components: {
        'vcal-month': VueCal.Month,
        'vcal-month-mixin': VueMonthMixin,
        'vcal-year': VueCal.Year,
        'vcal-year-mixin': VueYearMixin,
        'vcal-week': VueCal.Week,
        'vcal-week-mixin': VueWeekMixin
    }
});