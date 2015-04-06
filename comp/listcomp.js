/// listComp
(function (window, document, lupo, $, undefined) {

    function addItem(scope) {
        var id = scope.model.list.length + 1,
            item = {
                id: id,
                firstname: scope.form.firstname.value,
                surname: scope.form.surname.value,
                age: scope.form.age.value
            };
        scope.form.firstname.value = '';
        scope.form.surname.value = '';
        scope.form.age.value = '';
        scope.model.list.push(item);
    }

    function deleteItem(scope, id) {
        var list = scope.model.list,
            item = lupo.getObjectItem(list, 'id', id),
            index = list.indexOf(item);
        list.splice(index, 1);
    }

    lupo.defineComponent('listComp', function (scope) {
        scope.view = 'app-view';
        scope.template = 'listcomp.html';
        scope.model = {};
        scope.form = {
            firstname: {
                value: ''
            },
            surname: {
                value: ''
            },
            age: {
                value: ''
            },
            addButton: {
                click: function (e) {
                    e.preventDefault();
                    addItem(scope);
                }
            }
        };
        scope.click = {
            removeItem: function (e, id) {
                e.preventDefault();
                deleteItem(scope, id);
            }
        };
    });

})(window, document, lupo, jQuery);