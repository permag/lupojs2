// Test model, global for testing.
var testModel = {
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

lupo.defineApp('myApp', function (config) {
    // Components
    var myComp = lupo.component.myComp(),
        testComp = lupo.component.testComp(),
        listComp = lupo.component.listComp(),
        itemComp = lupo.component.itemComp();

    // Routes
    config.router({
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
            // console.log('before routing');
        }
    });

    // Route functions
    function myCompRoute() {
        myComp.run({model: testModel, view: 'app-view'});
    }

    function testCompRoute() {
        testComp.run({view: 'app-view'});
    }

    function listCompRoute() {
        listComp.run({model: listModel});
    }

    function itemCompRoute(id) {
        itemComp.run({model: listModel, id: id});
    }
});
