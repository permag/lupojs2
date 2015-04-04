/// testComp
lupo.defineComponent('testComp', function (scope) {

    scope.view = 'test-view';
    scope.template = 'testcomp.html';
    scope.model = {
        name: 'Mr. Smith',
        car: 'VW Golf'
    };
    scope.form = {
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
    };
    scope.events = {
        'click #toggle-form': 'toggleForm',
        'click .anonymous-func': function (e) {
            alert('Anonymous function expression.');
        }
    };
    scope.toggleForm = function (e) {
        scope.form.submit.disabled = !scope.form.submit.disabled;
        scope.form.inputCar.disabled = !scope.form.inputCar.disabled;
        scope.form.inputTest.disabled = !scope.form.inputTest.disabled;
    };
    // Override default render method.
    scope.render = function (ob) {
        if (ob.model) {
            scope.model = ob.model;
        }
        if (ob.view) {
            scope.view = ob.view;
        }
        lupo.render(scope);
    };

    // Return custom stuff
    return {hello: 'Hello!'};

});

