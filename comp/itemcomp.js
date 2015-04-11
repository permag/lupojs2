/// itemComp
(function (window, document, lupo, $, undefined) {

   lupo.defineComponent('itemComp', function (scope) {
        scope.view = 'app-view';
        scope.template = 'itemcomp.html';
        scope.model = {};
        scope.events = {};

        scope.init = function (inputOb) {
            if (inputOb.model && inputOb.id) {
                scope.model = lupo.utils.getObjectItem(inputOb.model.list, 'id', inputOb.id);
            }
        };
    });

})(window, document, lupo, jQuery);
