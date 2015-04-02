$(function () {
    /// APP
    var myModel = {
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

    lupo.router({
        '/': function(){
            alert('This is the root.')
        },
        '/mycomp': myCompRoute,
        '/testcomp': testCompRoute
    });

    function myCompRoute() {
        var myComp = lupo.comps.myComp();
        myComp.render({model: myModel, view: 'app-view'});
    }

    function testCompRoute() {
        var testComp = lupo.comps.testComp();
        testComp.render({view: 'app-view'});
    }

});
