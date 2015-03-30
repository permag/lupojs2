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
                    // sumbit: 'toggleForm' .... /// @todo add submit action function name and submit: function() {}
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
                'click #toggle-form': 'toggleForm'    /// @todo add 'xxx yyy': function() {}
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
