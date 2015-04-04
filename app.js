var model;
$(function () {
    /// APP
    var myComp = lupo.comps.myComp(),
        testComp = lupo.comps.testComp(),
        listComp = lupo.comps.listComp(),
        itemComp = lupo.comps.itemComp(),
        testModel = {
            firstname: 'John',
            surname: 'Smith',
            description: '<h3>A short text...</h3>',
            list: [
                {item: 'item 1'},
                {item: 'item 2'},
                {item: 'item 3'}
            ],
            deep: {
                ob: {
                    list: [
                        {article: 'article 1'},
                        {article: 'article 2'},
                        {article: 'article 3'}
                    ]
                }
            }
        },
        listModel = {
            list: [
                {
                    id: 1,
                    firstname: 'Homer',
                    surname: 'Simpson',
                    age: 33
                },
                {
                    id: 2,
                    firstname: 'Peter',
                    surname: 'Griffin',
                    age: 41
                }
            ]
        };

    /////// make global for testing
    model = listModel;

    // Routes
    lupo.router({
        '/': function() {
            myCompRoute();
        },
        '/mycomp': myCompRoute,
        '/testcomp': testCompRoute,
        '/list': listCompRoute,
        '/item/:id': itemCompRoute
    },
    {
        before: function () {
            console.log('before routing');
        }
    });

    // Route functions
    function myCompRoute() {
        myComp.render({model: testModel, view: 'app-view'});
    }

    function testCompRoute() {
        testComp.render({view: 'app-view'});
    }

    function listCompRoute() {
        listComp.render({model: listModel});
    }

    function itemCompRoute(id) {
        itemComp.render({model: listModel, id: id});
    }
});
