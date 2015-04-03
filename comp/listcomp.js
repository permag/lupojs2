/// listComp
(function (window, document, lupo, $, undefined) {

    lupo.comps.listComp = function () {
        var scope = {};
        scope.view = 'app-view';
        scope.template = 'listcomp.html';
        scope.model = {};
        scope.events = {};

        scope.render = function (ob) {
            if (ob.model) {
                scope.model = ob.model;
            }
            lupo.render(scope);
        };
        return {render: scope.render};
    };
})(window, document, lupo, jQuery);