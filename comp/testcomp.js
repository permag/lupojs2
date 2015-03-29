/// testComp
(function (window, lupo, $, undefined) {

    lupo.comps.testComp = function () {
        var comp = {
            view: 'test-view',
            template: 'testcomp.html',
            model: {
                name: 'Mr. Smith',
                car: 'VW Golf'
            },
            form: {
                submit: {
                    disabled: true,
                    text: 'Submit form'
                },
                inputCar: {
                    disabled: true
                },
                inputTest: {
                    disabled: false,
                    text: 'Hello'
                }
            },
            events: {
                'click #test': 'test'
            },
            test: function (e) {
                alert("test");
            },
            render: function (model) {
                if (model) {
                    comp.model = model;
                }
                lupo.render(comp);
            }
        };
        return comp;
    };
})(window, lupo, jQuery);
