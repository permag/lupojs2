var lupo = lupo || {};

/// LIB
(function () {
    'use strict';

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
        formAllToView(compOb);
        formEventInit(compOb);
        doWatch(compOb, 'model', modelAllToView);
        doWatch(compOb, 'form', formAllToView);
    }

    function doWatch(compOb, prop, func) {
        var timer;
        if (!compOb[prop]) return;
        // watch properties
        watch(compOb, [prop], function () {
            // don't update all view element if one element has focus.
            if (compOb.viewEl.find('input, textarea').is(':focus')) return;
            window.clearTimeout(timer);
            timer = window.setTimeout(function () {
                func(compOb);
            }, 50);  // delay so func() wont be called once for each updated element, just once for all.
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
                    fn(e);  // call function name
                } else if (typeof eventFn === 'function') {
                    eventFn(e);  // call anonymous function expression
                }
            });
        });
    }

    function dataClick(compOb) {
        var funcName, cleanName, matches, arg = null, regExp = /\(([^)]+)\)/;
        $.each(compOb.viewEl.find('*'), function (key, elem) {
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

    function modelItemToView (compOb, currKey, target) {
        var value;
        if (compOb.model && currKey) {
            value = getPropertyValueByPath(compOb.model, currKey);
            // update val and html but not on target (input, textarea, ...)
            compOb.viewEl.find('[data-model="' + currKey + '"]').not(target).val(value).html(value);
        }
    }

    function modelAllToView(compOb) {
        var elem, propVal;
        $.each(compOb.viewEl.find('*'), function (key, value) {
            elem = $(value);
            if (elem.is(':focus')) return;  // dont change value of elem with focus
            if (compOb.model) {
                if (elem.attr('data-model')) {
                    propVal = getPropertyValueByPath(compOb.model, elem.attr('data-model'));
                    /// @todo update only if unchanged
                    elem.val(propVal).html(propVal);
                }
            }
        });
    }

    function formAllToView(compOb) {
        var elem, propVal;
        $.each(compOb.viewEl.find('*'), function (key, value) {
            elem = $(value);
            if (compOb.form) {
                if (elem.attr('data-form')) {
                    propVal = getPropertyValueByPath(compOb.form, elem.attr('data-form'));
                    elem.attr('disabled', propVal.disabled);
                    // dont add form text value if elem has model
                    if (!elem.attr('data-model')) {
                        elem.val(propVal.text).html(propVal.text);
                    }
                }
            }
        });
    }

    function formEventInit(compOb) {
        var elem, propVal;
        $.each(compOb.viewEl.find('*'), function (key, value) {
            elem = $(value);
            if (elem.attr('data-form')) {
                propVal = getPropertyValueByPath(compOb.form, elem.attr('data-form'));
                elem.unbind('click');
                // add click handlers to form.someObject.click
                if (typeof compOb[propVal.click] === 'function') {   // call function name
                    elem.click(function (e) {
                        e.preventDefault();
                        compOb[propVal.click](e);
                    });
                } else if (typeof propVal.click === 'function') {  // call anonymous function expression
                    elem.click(function (e) {
                        e.preventDefault();
                        propVal.click(e);
                    });
                }
            }
        });
    }

    function viewItemToModel (compOb) {
        var target, currKey, newValue;
        compOb.viewEl.find('input, textarea').bind('keyup', function (e) {
            e.preventDefault();
            target = $(e.target);
            currKey = target.attr('data-model');
            newValue = target.val();
            setPropertyValueByPath(compOb.model, currKey, newValue);
            modelItemToView(compOb, currKey, target, target);  // update one item only
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
        var pathElements = path.replace(/\[|\]/g, '.').replace(/\.+/g, '.').split(/\./),
            pathEnd = pathElements[pathElements.length - 1],
            pathRoot = (pathElements.slice(0, pathElements.length - 1).join('.')),
            currObj = obj;
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

    // get model item by property name and value
    lupo.getObjectItem = function (model, prop, val) {
        var i;
        for (i in model) {
            if (model.hasOwnProperty(i)) {
                if (model[i][prop] == val) {
                    return model[i];
                }
            }
        }
        return null;
    }

    var renderCache = {};
    lupo.render = function (compOb) {
        var view = compOb.view,
            template = compOb.template,
            model = compOb.model,
            rendered;
        compOb.viewEl = $('[data-view="' + view + '"]');

        if (renderCache[template]) {
            compOb.viewEl.html(renderCache[template]);
            run(compOb);
            return;
        }
        $.ajax({
            url: './view/' + template,
            type: 'GET'
        }).success(function (html) {
            rendered = lupoTemplate(html, {model: model})
            renderCache[template] = rendered;  // Cache
            compOb.viewEl.html(rendered);
            run(compOb);
        }).error(function (error) {
            console.log(error);
            console.log('Error rendering view.');
        });
    };

    lupo.router = function (routes) {
        router();
        $(window).on('hashchange', function () {
            router();
        });
        function router() {
            var hash = window.location.hash, route, func, hashArr, routeArr, i, len, params = [];
            for (route in routes) {
                func = routes[route];
                if (!routes.hasOwnProperty(route) && typeof func !== 'function') break;
                hashArr = hash.substring(hash.indexOf('/') + 1).split('/');
                routeArr = route.substring(route.indexOf('/') + 1).split('/');
                len = hashArr.length;
                if (len !== routeArr.length) continue;
                for (i = 0; i < len; i += 1) {
                    if (routeArr[i] !== hashArr[i] && routeArr[i].charAt(0) !== ':') break;
                    if (routeArr[i].charAt(0) === ':') params.push(hashArr[i]);
                    if (i === len - 1) func.apply(window, params);
                }
            }
        }
    };

})();
