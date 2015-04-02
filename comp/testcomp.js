/// testComp
(function (window, lupo, $, undefined) {

    lupo.comps.testComp = function () {
        var scope = {
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
                    disabled: false
                }
            },
            events: {
                'click #toggle-form': 'toggleForm',
                'click .anonymous-func': function (e) {
                    alert('Anonymous function expression.');
                }
            },
            toggleForm: function (e) {
                scope.form.submit.disabled = !scope.form.submit.disabled;
                scope.form.inputCar.disabled = !scope.form.inputCar.disabled;
                scope.form.inputTest.disabled = !scope.form.inputTest.disabled;
            },
            render: function (ob) {
                if (ob.model) {
                    scope.model = ob.model;
                }
                if (ob.view) {
                    scope.view = ob.view;
                }
                lupo.render(scope);
            }
        };
        return {render: scope.render};
    };
})(window, lupo, jQuery);
