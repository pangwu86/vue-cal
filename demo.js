var VueMonthMixin = Vue.extend({
    template: "#vcal-month-mixin",
    mixins: [VueCal.Mixin.Month],
    methods: {
        hi: function () {
            console.log('hi');
        },
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
            props: ['day', 'vcal', 'items'],
            methods: {}
        }
    },
    ready: function () {
        this.hi();
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
        'vcal-year-mixin': VueMonthMixin,
        'vcal-week': VueCal.Week
    }
});