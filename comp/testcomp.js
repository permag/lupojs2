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
                    disabled: false,
                    text: 'Submit form',
                    // click: 'toggleForm'
                    click: function (e) {alert('Submit')}
                },
                inputCar: {
                    disabled: false
                },
                inputTest: {
                    disabled: false,
                    text: 'Hello'
                }
            },
            events: {
                'click #toggle-form': 'toggleForm',
                'click .anonymous-func': function (e) {
                    alert('Anonymous function expression.');
                }
            },
            toggleForm: function (e) {
                comp.form.submit.disabled = !comp.form.submit.disabled;
                comp.form.inputCar.disabled = !comp.form.inputCar.disabled;
                comp.form.inputTest.disabled = !comp.form.inputTest.disabled;
            },
            render: function (model) {
                if (model) {
                    comp.model = model;
                }
                lupo.render(comp);
            }
        };
        return {render: comp.render};
    };
})(window, lupo, jQuery);
