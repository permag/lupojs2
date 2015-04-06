/// testComp
lupo.defineComponent('testComp', function (scope) {
    scope.view = 'test-view';
    scope.template = 'testcomp.html';
    scope.model = {
        name: 'Mr. Smith',
        car: 'VW Golf'
    };
    scope.form = {
        name: {
            disabled: false
        },
        car: {
            disabled: false
        },
        submit: {
            disabled: false,
            value: 'Submit form',
            // click: 'toggleForm'
            click: function (e) {alert('Submit');}
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
        scope.form.car.disabled = !scope.form.car.disabled;
        scope.form.name.disabled = !scope.form.name.disabled;
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