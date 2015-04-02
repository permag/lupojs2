$(function () {
    /// APP
    var myComp = lupo.comps.myComp(),
        testComp = lupo.comps.testComp(),
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
    };

    // Routes
    lupo.router({
        '/': function() {
            myCompRoute();
        },
        '/mycomp': myCompRoute,
        '/testcomp': testCompRoute
    });

    // Route functions
    function myCompRoute() {
        myComp.render({model: testModel, view: 'app-view'});
    }

    function testCompRoute() {
        testComp.render({view: 'app-view'});
    }
});
