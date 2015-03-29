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

    var myComp = lupo.comps.myComp();
    myComp.render(myModel);

    var testComp = lupo.comps.testComp();
    testComp.render();
});
