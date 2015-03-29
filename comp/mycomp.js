/// myComp
(function (window, lupo, $, undefined) {

    function printModelInConsole (e, comp) {
        console.log(comp.model);
    }

    lupo.comps.myComp = function () {
        var comp = {
            view: 'app-view',
            template: 'mycomp.html',
            model: {},
            events: {
                'click #print-model-console': 'printModelInConsole'
            },
            click: {
                sayHey: function (e, arg) {
                    alert('sayHey! ' + arg);
                }
            },
            printModelInConsole: function (e) {
                printModelInConsole(e, comp);
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