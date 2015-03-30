var lupo = lupo || {};

/// LIB
(function () {

    lupo.comps = {};

    function run(compOb) {
        if (compOb.events) {
            events(compOb);
        }
        if (compOb.click) {
            dataClick(compOb);
        }
        // sync
        viewItemToModel(compOb);
        modelAllToView(compOb);
        watchModel(compOb);
    }

    function watchModel(compOb) {
        var keys = [];
        // watch all comp properties
        $.each(compOb, function (key) {
            keys.push(key);
        });
        watch(compOb, keys, function () {
            modelAllToView(compOb);
        });
    }

    function events(compOb) {
        var evEl, fn;
        $.each(compOb.events, function (key, eventFn) {   
            evEl = key.split(' ');
            $(evEl[1]).bind(evEl[0], function (e) {
                e.preventDefault();
                fn = compOb[eventFn];
                if (typeof fn === 'function') {
                    fn(e);
                }
            });
        });
    }

    function dataClick(compOb) {
        var view = $('[data-view="' + compOb.view + '"]'),
            funcName, cleanName, regExp, matches, arg = null;
        regExp = /\(([^)]+)\)/;
        $.each(view.find('*'), function (key, elem) {
            if ($(elem).attr('data-click')) {
                funcName = $(elem).attr('data-click');
                matches = regExp.exec(funcName);
                // matches[1] contains the value between the parentheses
                if (matches) {
                    arg = matches[1];
                }
                cleanName = funcName.split('(')[0];
                if (typeof compOb.click[cleanName] === 'function') {
                    $(elem).click(function (e) {
                        e.preventDefault();
                        compOb.click[cleanName](e, arg);
                    });
                }
            }
        });
    }

    function dataModel(compOb, elem) {
        var currProp;
        if (elem.attr('data-model')) {
            currProp = getPropertyValueByPath(compOb.model, $(elem).attr('data-model'));
            elem.val(currProp).html(currProp);
        }
    }

    function dataForm(compOb, elem) {
        var currProp;
        if (elem.attr('data-form')) {
            currProp = getPropertyValueByPath(compOb.form, elem.attr('data-form'));
            elem.attr('disabled', currProp.disabled);
            // dont add form text value if elem has model
            if (!elem.attr('data-model')) {
                elem.val(currProp.text).html(currProp.text);
            }
        }
    }

    function modelItemToView (compOb, currKey) {
        var view, value;
        if (compOb.model) {
            view = $('[data-view="' + compOb.view + '"]');
            value = getPropertyValueByPath(compOb.model, currKey);
            view.find('[data-model="' + currKey + '"]').val(value).html(value);
        }
    }

    function modelAllToView(compOb) {
        var view = $('[data-view="' + compOb.view + '"]'),
            elem;
        $.each(view.find('*'), function (key, value) {
            elem = $(value);
            if (compOb.model) {
                dataModel(compOb, elem);
            }
            if (compOb.form) {
                dataForm(compOb, elem);
            }
        });
    }

    function viewItemToModel (compOb) {
        var view = $('[data-view="' + compOb.view + '"]'),
            target, currKey, newValue;
        view.find('input, textarea').bind('keyup', function (e) {
            e.preventDefault();
            target = $(e.target);
            currKey = target.attr('data-model');
            newValue = target.val();
            setPropertyValueByPath(compOb.model, currKey, newValue);
            // modelItemToView(compOb, currKey);  // update one item only
        });
    }

    function getPropertyValueByPath(obj, path) {
        path = path.split(/[\[\]\.]+/);
        if (path[path.length - 1] === '') {
            path.pop();
        }
        while (path.length && (obj = obj[path.shift()]));
        return obj;
    }

    function setPropertyValueByPath(obj, path, value) {
        if (!path) return;
        var pathElements = path.replace(/\[|\]/g, '.').replace(/\.+/g, '.').split(/\./)
        pathEnd = pathElements[pathElements.length - 1]
        pathRoot = (pathElements.slice(0, pathElements.length - 1).join('.'))
        var currObj = obj;
        for (var i = 0; i < pathElements.length; i++) {

            if (typeof (currObj[pathElements[i]]) === 'undefined') {
                currObj[pathElements[i]] = {};
            }
            currObj = currObj[pathElements[i]];
        }
        getPropertyValueByPath(obj, pathRoot)[pathEnd] = value;
        return true;
    }

    var cache = {};
    function lupoTemplate(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          cache[str] = cache[str] ||
            lupoTemplate(document.getElementById(str).innerHTML) :

          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
           
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
           
            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    }

    var renderCache = {};
    lupo.render = function (compOb, data) {
        var view = compOb.view,
            template = compOb.template,
            viewEl = $('[data-view="' + view + '"]'),
            model = data || compOb.model,
            rendered;
        if (renderCache[template]) {
            viewEl.html(renderCache[template]);
            run(compOb);
            return;
        }
        $.ajax({
            url: './view/' + template,
            type: 'GET'
        }).success(function (html) {
            rendered = lupoTemplate(html, {model: model})
            renderCache[template] = rendered;  // Cache
            viewEl.html(rendered);
            run(compOb);
        }).error(function (error) {
            console.log(error);
            console.log('Error rendering view.');
        });
    };

})();
