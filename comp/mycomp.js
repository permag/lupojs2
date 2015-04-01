/// myComp
(function (window, lupo, $, undefined) {

    function printModelInConsole (e, scope) {
        console.log(scope.model);
    }

    lupo.comps.myComp = function () {
        var scope = {};
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
        scope.render = function (model) {
            if (model) {
                scope.model = model;
            }
            lupo.render(scope);
        };
        return {render: scope.render};
    };
})(window, lupo, jQuery);