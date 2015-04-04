/// myComp
(function (window, document, lupo, $, undefined) {

    function printModelInConsole (e, scope) {
        console.log(scope.model);
    }

    lupo.defineComponent('myComp', function (scope) {
        scope.view = 'app-view';
        scope.template = 'mycomp.html';
        scope.model = {};
        scope.events = {
            'click #print-model-console': 'printModelInConsole'
        };
        scope.click = {
            sayHey: function (e, arg) {
                alert('sayHey! ' + arg);
            }
        };
        scope.printModelInConsole = function (e) {
            printModelInConsole(e, scope);
        };
        scope.render = function (ob) {
            if (ob.model) {
                scope.model = ob.model;
            }
            if (ob.view) {
                scope.view = ob.view;
            }
            lupo.render(scope);
        };
    });

})(window, document, lupo, jQuery);