/// itemComp
(function (window, document, lupo, $, undefined) {

    lupo.component.itemComp = function () {
        var scope = {};
        scope.view = 'app-view';
        scope.template = 'itemcomp.html';
        scope.model = {};
        scope.events = {};

        scope.render = function (ob) {
            if (ob.model && ob.id) {
                scope.model = lupo.getObjectItem(ob.model.list, 'id', ob.id);
                lupo.render(scope);
            }
        };
        return {render: scope.render};
    };

})(window, document, lupo, jQuery);
