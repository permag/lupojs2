/// myComp
(function (window, lupo, $, undefined) {

    function printModelInConsole (e, comp) {
        console.log(comp.model);
    }

    lupo.comps.myComp = function () {
        var comp = {};
        comp.view = 'app-view';
        comp.template = 'mycomp.html';
        comp.model = {};
        comp.events = {
            'click #print-model-console': 'printModelInConsole'
        };
        comp.click = {
            sayHey: function (e, arg) {
                alert('sayHey! ' + arg);
            }
        };
        comp.printModelInConsole = function (e) {
            printModelInConsole(e, comp);
        };
        comp.render = function (model) {
            if (model) {
                comp.model = model;
            }
            lupo.render(comp);
        };
        return {render: comp.render};
    };
})(window, lupo, jQuery);