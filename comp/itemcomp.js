/// itemComp
(function (window, document, lupo, $, undefined) {

    lupo.comps.itemComp = function () {
        var scope = {};
        scope.view = 'app-view';
        scope.template = 'itemcomp.html';
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
