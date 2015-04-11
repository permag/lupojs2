var lupo = lupo || {};

/// LIB
(function (window, document, $, undefined) {
    'use strict';

    var renderCache = {},
        templateCache = {},
        currentTemplate,
        watchTimer,
        actionTimer,
        watchObject = {};

    lupo.app = {};
    lupo.component = {};
    lupo.utils = {};


    function run(scope) {
        if (scope.events) {
            events(scope);
        }
        if (scope.click) {
            dataClick(scope);
        }
        // sync
        viewItemToModel(scope);
        viewItemToForm(scope);
        modelAllToView(scope);
        formAllToView(scope);
        formEventInit(scope);

        if (!watchObject[scope.template]) {
            doWatch(scope, 'model', modelAllToView);
            doWatch(scope, 'form', formAllToView);
            watchObject[scope.template] = true;  // mark these object watched, by its template.
        }
    }

    function doWatch(scope, prop, func) {
        if (!scope[prop]) return;
        // watch properties
        watch(scope, [prop], function (prop, action, newvalue, oldvalue) {
            console.log('action: ' + action);
            // don't update all view element if one element has focus.
            if (scope.viewEl.find('input, textarea').is(':focus')) return;
            window.clearTimeout(watchTimer);
            watchTimer = window.setTimeout(function () {
                console.log('Watching: ' + prop);
                // if push/pop/splice on model lists.
                if (action === 'push' || action === 'pop' || action === 'splice') {

                    renderCache[scope.template] = null;  // clear cache
                    if (scope.template === currentTemplate) {
                        // only re-render view if it's current one.
                        var inp = scope.inputOb();
                        console.log("RERUN");
                        scope.run(inp);  // pass original function params
                    }

                } else {
                    func(scope);
                }
            }, 50);  // delay so func() wont be called once for each updated element, just once for all.
        });
    }

    function events(scope) {
        var evEl, fn;
        $.each(scope.events, function (key, eventFn) {
            evEl = key.split(' ');
            $(evEl[1]).bind(evEl[0], function (e) {
                e.preventDefault();
                fn = scope[eventFn];
                if (typeof fn === 'function') {
                    fn.call(scope, e);  // call function name
                } else if (typeof eventFn === 'function') {
                    eventFn.call(scope, e);  // call anonymous function expression
                }
            });
        });
    }

    function dataClick(scope) {
        var funcName, cleanName, matches, arg = null, regExp = /\(([^)]+)\)/;
        $.each(scope.viewEl.find('[data-click]'), function (key, elem) {
            if ($(elem).attr('data-click')) {
                funcName = $(elem).attr('data-click');
                matches = regExp.exec(funcName);
                // matches[1] contains the value between the parentheses
                if (matches) {
                    arg = matches[1];
                }
                cleanName = funcName.split('(')[0];
                if (typeof scope.click[cleanName] === 'function') {
                    (function (elem, cleanName, arg) {
                        $(elem).click(function (e) {
                            e.preventDefault();
                            scope.click[cleanName](e, arg);
                        });
                    })(elem, cleanName, arg);
                }
            }
        });
    }

    function modelItemToView (scope, currKey, target) {
        var value;
        if (scope.model && currKey) {
            value = getPropertyValueByPath(scope.model, currKey);
            // update val and html but not on target (input, textarea, ...)
            scope.viewEl.find('[data-model="' + currKey + '"]').not(target).val(value).html(value);
        }
    }

    function modelAllToView(scope) {
        var elem, propVal;
        $.each(scope.viewEl.find('[data-model]'), function (key, value) {
            elem = $(value);
            if (elem.is(':focus')) return;  // dont change value of elem with focus
            if (scope.model) {
                if (elem.attr('data-model')) {
                    propVal = getPropertyValueByPath(scope.model, elem.attr('data-model'));
                    if (typeof propVal !== 'undefined') {
                        /// @todo update only if unchanged
                        elem.val(propVal).html(propVal);
                    }
                }
            }
        });
    }

    function formAllToView(scope) {
        var elem, propVal;
        $.each(scope.viewEl.find('[data-form]'), function (key, value) {
            elem = $(value);
            if (scope.form) {
                if (elem.attr('data-form')) {
                    propVal = getPropertyValueByPath(scope.form, elem.attr('data-form'));
                    if (typeof propVal === 'undefined') return;
                    if (typeof propVal.disabled !== 'undefined') {
                        elem.attr('disabled', propVal.disabled);
                    }
                    // dont add form text value if elem has model
                    if (!elem.attr('data-model')) {
                        if (typeof propVal.value !== 'undefined') {
                            elem.val(propVal.value).html(propVal.value);
                        }
                    }
                }
            }
        });
    }

    function formEventInit(scope) {
        var elem, propVal, inputs = scope.viewEl.find('input, textarea');
        $.each(scope.viewEl.find('[data-form]'), function (key, value) {
            elem = $(value);
            if (elem.attr('data-form')) {
                propVal = getPropertyValueByPath(scope.form, elem.attr('data-form'));
                if (typeof propVal === 'undefined') return;
                elem.unbind('click');
                // add click handlers to form.someObject.click
                if (typeof scope[propVal.click] === 'function') {   // call function name
                    elem.click(function (e) {
                        e.preventDefault();
                        inputs.blur();  // remove focus
                        scope[propVal.click](e);
                    });
                } else if (typeof propVal.click === 'function') {  // call anonymous function expression
                    elem.click(function (e) {
                        e.preventDefault();
                        inputs.blur();  // remove focus
                        propVal.click(e);
                    });
                }
            }
        });
    }

    function viewItemToModel (scope) {
        var target, currKey, newValue, time,
            elems = scope.viewEl.find('input[data-model], textarea[data-model]');
        elems.unbind('keyup');
        elems.bind('keyup', function (e) {
            e.preventDefault();
            window.clearTimeout(time);
            time = window.setTimeout(function () {  // limit nr of events on fast typing
                target = $(e.target);
                currKey = target.attr('data-model');
                newValue = target.val();
                setPropertyValueByPath(scope.model, currKey, newValue);
                modelItemToView(scope, currKey, target, target);  // update one item only
            }, 10);
        });
    }

    function viewItemToForm (scope) {
        var target, currKey, newValue, elems = scope.viewEl.find('input[data-form], textarea[data-form]');
        elems.unbind('blur');
        elems.bind('blur', function (e) {
            e.preventDefault();
            target = $(e.target);
            currKey = target.attr('data-form');
            if (typeof currKey === 'undefined') return;
            if (typeof scope.form[currKey].value !== 'undefined') {
                scope.form[currKey].value = target.val();
            }
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

    function lupoTemplate(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          templateCache[str] = templateCache[str] ||
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

    lupo.render = function (scope) {
        console.log('render');
        var view = scope.view,
            template = scope.template,
            model = scope.model,
            rendered;
        currentTemplate = template;
        scope.viewEl = $('[data-view="' + view + '"]');

        if (renderCache[template]) {
            scope.viewEl.html(renderCache[template]);
            run(scope);
            return;
        }
        $.ajax({
            url: './templates/' + template,
            type: 'GET'
        }).success(function (html) {
            rendered = lupoTemplate(html, {model: model})
            renderCache[template] = rendered;  // Cache
            scope.viewEl.html(rendered);
            run(scope);
        }).error(function (error) {
            console.log('Error rendering view.');
        });
    };

    lupo.router = function (routes, ob) {
        ob = ob || {};
        routeEvent(ob, 'before');
        route();

        $(window).on('hashchange', function () {
            routeEvent(ob, 'before');
            route();
        });

        function routeEvent(ob, prop) {
            if (!ob[prop]) return;
            else if (typeof ob[prop] === 'function') ob[prop]();
        }

        function route() {
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
                    if (i === len - 1) func.apply(this, params);
                }
            }
        }
    };

    lupo.defineComponent = function (compName, fn) {
        var inputOb = {};
        // build default comp object, which may be overrided by each comp.
        var scope = {
            model: {},
            run: function (ob) {
                inputOb = ob;
                if (ob.model) scope.model = ob.model;
                if (ob.view) scope.view = ob.view;
                if (scope.model) {
                    if (typeof scope.init !== 'undefined') {
                        scope.init(ob);
                    }
                    lupo.render(scope);
                }
            },
            inputOb: function () {
                return inputOb;
            }
        };

        lupo.component[compName] = function () {
            var customReturns = fn.call(this, scope),  // execute component and store return ob.
                ret = {};
            // if no return in comp, return run method.
            if (typeof customReturns === 'undefined' || !customReturns) {
                ret = {run: scope.run};
            } else {
                // if comp has return, but not returning run method,
                // add run method to return.
                if (typeof customReturns.run === 'undefined') {
                    ret = customReturns;
                    ret.run = scope.run;
                }
                // comp has return and is returning run method.
                ret = customReturns;
            }
            return ret;
        };
    };

    lupo.defineApp = function (appName, fn) {
        var that = this;

        $(function () {
            // define app callback config param
            fn.call(that, {router: lupo.router});
        });

        // app instance
        lupo.app[appName] = {};
        return lupo.app[appName];
    };


    //
    // Utils
    //

    // get model item by property name and value
    lupo.utils.getObjectItem = function (model, prop, val) {
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

}(window, document, jQuery));
