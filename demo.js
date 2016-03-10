var VueMonthMixin = Vue.extend({
    template: "#vcal-month-mixin",
    mixins: [VueCal.Mixin.Month],
    methods: {
        rNum: function (day) {
            return Math.floor(Math.random(day) * 1);
        }
    },
    components: {
        'vcal-month-dayrender' : {
            template: "#vcal-month-dayrender",
            props: ['day'],
            methods: {}
        }
    },
    ready: function () {
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