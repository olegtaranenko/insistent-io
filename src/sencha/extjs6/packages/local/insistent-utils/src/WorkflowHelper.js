/**
 * Collection of widely-used (in two or more independent places) methods.
 */
Ext.define('InsistentUtils.WorkflowHelper', {
    singleton: true,

    alternateClassName: 'Workflow',


    /**
     *
     * iOS bug, see http://stackoverflow.com/questions/27480368/show-values-in-disabled-selectfiled-on-ios
     *
     * @param me - the component
     * @param yes - to disable or not?
     */
    setMeDisabled: function(me, yes) {
        if (me.setReadOnly) {
            if (yes) {
                me.setReadOnly(true);
                me.setCls("x-item-disabled");
            }
            else {
                me.setReadOnly(false);
                me.setDisabled(false); // re-set Cls to enabled
            }
        }
        else if (me.setDisabled){
            me.setDisabled(yes);
        }

    },

    /**
     *
     * @param a
     * @param b
     * @returns {boolean}
     */
    dateEquals: function(a, b) {
        var fn = Ext.Date.format,
            fmt = 'Ymd',
            fmtA = fn(a, fmt),
            fmtB = fn(b, fmt);

        return fmtA === fmtB;
    },


    /**
     *
     * @param dDate
     * @returns {Date}
     */
    timelessDate: function(dDate) {
        if (dDate == 'undefined' || Workflow.isEmpty(dDate)) {
            return Ext.DateExtras.clearTime(new Date());
        }
        return Ext.DateExtras.clearTime(new Date(dDate));
    },


    /**
     *
     * @param string
     * @returns {string}
     */
    capitalize: function(string) {
        var re = /(^|[^\w])([a-z])/g,
            fn = function(m, a, b) {
                return a + b.toUpperCase();
            };
        return string.toLowerCase().replace(re, fn);
    },


    /*
     //TODO subject to optimize: better use Ext.Date#clearTime
     dateDiff: function(startDate, endDate) {

     var t1 = this.formatDateval(startDate, 'd-m-Y');
     var t2 = this.formatDateval(endDate, 'd-m-Y');
     var one_day = 1000 * 60 * 60 * 24;
     var x = t1.split("-");
     var y = t2.split("-");
     var date1 = new Date(x[2], (x[1] - 1), x[0]);
     var date2 = new Date(y[2], (y[1] - 1), y[0]);
     return Math.ceil((date2.getTime() - date1.getTime()) / (one_day));
     },

     */
    //TODO subject to optimize: better use Ext.Date#clearTime
    dateTimeDiff: function(startDate, endDate) {               // this expects dates in this format    d-m-Y H:i:s'
        var t1 = this.Left(startDate, 10);
        var t2 = this.Left(endDate, 10);
        var t3 = this.Right(startDate, 12);
        var t4 = this.Right(endDate, 12);
        var one_hour = 1000 * 60 * 60;
        var x = t1.split("-");
        var y = t2.split("-");
        var a = t3.split(":");
        var b = t4.split(":");
        var date1 = new Date(x[2], (x[1] - 1), x[0], a[0], a[1], a[2]);
        var date2 = new Date(y[2], (y[1] - 1), y[0], b[0], b[1], b[2]);
        return Number((date2.getTime() - date1.getTime()) / one_hour).toFixed(1);

    },


    /**
     *
     * @param datevalue
     * @param dateFormat
     * @returns {*}
     */
    formatDateval: function(datevalue, dateFormat) {
        var formatPattern = dateFormat || "j/n/Y";
        if (datevalue.getMonth) {
            dateformatval = Ext.Date.format(datevalue, formatPattern);
        } else {
            var year, month, day, dateformat, dateformatval;
            if (datevalue.indexOf("-") >= 0) {
                //datestring = datevalue;
                dateformat = datevalue.split("-");
                year = dateformat[0];
                month = dateformat[1] - 1;
                day = dateformat[2];

            } else if (datevalue.indexOf("/") >= 0) {
                dateformat = datevalue.split("/");
                year = dateformat[2];
                month = dateformat[1] - 1;
                day = dateformat[0];
            }
            if (month < 0) {
                month = 0;
            }
            dateformatval = new Date(year, month, day).format(formatPattern);
        }
        return dateformatval;
    },


    /**
     *
     * @param dDate
     * @returns {{Year: Number, Month: Number, Day: Number, Hour: Number, Minute: Number}}
     */
    breakDownDateTime: function(dDate) {
        var t1 = this.Left(dDate, 10);
        var t2 = this.Right(dDate, 12);
        var x = t1.split("-");
        var y = t2.split(":");
        return {
            Year: parseInt(x[0]),
            Month: parseInt(x[1] - 1),
            Day: parseInt(x[2]),
            Hour: parseInt(y[0]),
            Minute: parseInt(y[1])
        }
    },


    /**
     *
     * @param dDate
     * @returns {Date}
     */
    makeNewDate: function(dDate) {
        var t1 = this.Left(dDate, 10);
        var t2 = this.Right(dDate, 12);
        var x = t1.split("-");
        var y = t2.split(":");
        return new Date(parseInt(x[0]), parseInt(x[1] - 1), parseInt(x[2]), parseInt(y[0]), parseInt(y[1]), 0)
    },


    /**
     *
     * @param datetimevalue
     * @param dateFormat
     * @param doFormat
     * @returns {*}
     */
    formatDateTimeval: function(datetimevalue, dateFormat, doFormat) {
        if (!datetimevalue) {
            return null;
        }
        if (!Ext.isDefined(doFormat)) {
            doFormat = true;
        }

        var formatPattern = dateFormat || "j/n/Y", dateformatval, dateformat, timeformat, datevaluearray;
        if (Ext.isDate(datetimevalue)) {
            dateformatval = Ext.Date.format(datetimevalue, formatPattern);
        } else {
//        console.log(datetimevalue);
            if (!Ext.isDefined(datetimevalue)) {
                datetimevalue = new Date().format("Y-m-d H:i:s");
            }
            if (datetimevalue.indexOf("T") >= 0) {
                datevaluearray = datetimevalue.split("T")
            }
            else {
                datevaluearray = datetimevalue.split(" ")
            }
            var year, month, day, hour = 0, minute = 0, sec = 0, datevalue = datevaluearray[0], timevalue = datevaluearray[1];
//        console.log(datevalue, "datevalue");
            if (datevalue.indexOf("-") >= 0) {
                dateformat = datevalue.split("-");
                year = dateformat[0];
                month = dateformat[1] - 1;
                day = dateformat[2];
            }

            if (timevalue && timevalue.indexOf(":") >= 0) {
                timeformat = timevalue.split(":");
                hour = timeformat[0];
                minute = timeformat[1];
                sec = timeformat[2];
            }

            if (month < 0) {
                month = 0;
            }
//        console.log(doFormat);
            dateformatval = new Date(year, month, day, hour, minute, sec);
            if (doFormat == true) {
                dateformatval = Ext.Date.format(dateformatval, formatPattern);
            }
        }

        return dateformatval;
    },


    /**
     *
     */
    formatPamDate: (function() {
        const re = /[-T:\. ]+/;
        return function(dateval) {
            if (dateval == null || dateval == 'undefined') {
                return null;
            }
            var date = new Date(dateval);
            if (date != "Invalid Date") {  // please no ss ll zz
                return date;
            }

            var dateParts = dateval.split(re);

            if (dateParts.length > 1) {
                dateParts[1] = Number(dateParts[1] - 1);
            }

            switch (dateParts.length) {
                case 3:
                    return new Date(dateParts[0], dateParts[1], dateParts[2]);
                    break;

                case 6:
                    return new Date(dateParts[0], dateParts[1], dateParts[2], dateParts[3], dateParts[4], dateParts[5]);
                    break;

                case 7:
                    return new Date(dateParts[0], dateParts[1], dateParts[2], dateParts[3], dateParts[4], dateParts[5], dateParts[6]);
                    break;
                default :
                    return dateval;
            }
        }
    })(),


    /**
     *
     * @param dateval
     * @param format
     * @returns {String}
     */
    getDesiredDateFormatValue: function(dateval, format) {
        var formatval = (format) ? format : "Y-m-d",
            unifieddate = this.formatPamDate(dateval),
            formatFn = Ext.Date.format;

        return formatFn(new Date(unifieddate), formatval);
    },


    /**
     *
     * @param datevalue
     * @returns {*}
     */
    yearmonthFormat: function(datevalue) {
        if (datevalue.getMonth) {
            dateformatval = Ext.Date.format(datevalue, 'F / Y');
        }
        else {
            var dateformat, dateformatval, day, month, year, datestring;
            if (datevalue.indexOf("-") >= 0) {
                //datestring = datevalue;
                dateformat = datevalue.split("-");
                year = dateformat[0];
                month = dateformat[1] - 1;
                day = dateformat[2];

            } else if (datevalue.indexOf("/") >= 0) {
                dateformat = datevalue.split("/");
                year = dateformat[2];
                month = dateformat[1] - 1;
                day = dateformat[0];

            }
            if (month < 0) {
                month = 0;
            }
            dateformatval = new Date(year, month, day);
            dateformatval = Ext.Date.format(dateformatval, "F / Y");
        }
        return dateformatval;
    },


    /**
     *
     * @param str
     * @param n
     * @returns {string}
     */
    Left: function(str, n) {
        var ret = '';

        if (n > 0) {
            ret = String(str);
            if (n <= ret.length) {
                return ret.substring(0, n);
            }
        }

        return ret;
    },


    /**
     * @return {string}
     */
    Right: function(str, n) {
        var ret = '';
        if (n > 0) {
            ret = String(str);
            var length = ret.length;

            if (n < length) {
                return ret.substring(length, length - n);
            }
        }

        return ret;
    },


    s4: function() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    },


    /**
     *
     * @returns {*}
     * @constructor
     */
    URI: function() {
        var s4 = this.s4;
        return s4() + s4() + s4();
    },


    /**
     *
     * @returns {string}
     */
    guid: function() {
        var s4 = this.s4;
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },



    /**
     * In array of `configured` stores check whether store presents or not
     * Format of both every entry in configure and store can be:
     *  - just string: store alias
     *  - instantiated store (Ext.dataStore}
     *  - object with {alias: 'labrRecs}
     *  - object without alias but with {store: store}
     *
     *  PS... is subject for unit testing;
     * @param {Array} configured array of configured (or not) stores
     * @param {Store|String|Objec} store
     * @param {Controller|Boolean} [controller] Entity Controller or mode, false means Alias-Only mode
     * @returns {Object} configured object which contains alias, store and found index
     *      return.index 0-based index of store in configured array, -1 otherwise
     *      return.alias Alias of the store
     *      return.store Store instance, may be null, ever alias is not null
     *      If store is not found return is null.
     */
    lookInConfiguredStores: function(configured, store, controller) {
        var me = this,
            normalized = me.normalizedStoreConfig(store, controller),
            aliasOnly = !controller,
            found = false,
            ret = null,
            index = -1;

        Ext.each(configured, function(config, foundIndex) {
            var looked = me.normalizedStoreConfig(config, controller);

            if (me.compareNormalizedStores(looked, normalized, aliasOnly)) {
                found = true;
                index = foundIndex
            }
            return !found;
        });

        if (found) {
            normalized.index = index;
            ret = normalized
        }

        return ret;
    },


    compareNormalizedStores: function(l, r, aliasOnly) {
        return (l.alias && (l.alias === r.alias)) || (!aliasOnly && l.store && (l.store === r.store));
    },


    /**
     *
     * @param config
     * @param {Controller|Boolean} [controller] Entity Controller or mode, false means Alias-Only mode
     * @returns {Boolean}
     */
    normalizedStoreConfig: function(config, controller) {
        var me = this,
            directAlias = Ext.isString(config),
            sankAlias = Ext.isString(config.alias),
            tryAlias = directAlias || sankAlias,
            alias = tryAlias ? (directAlias ? config : config.alias) : null,
            sankStore = config.store,
            sankIsStore = sankStore && sankStore.isStore,
            storeDetected = config.isStore || sankIsStore,
            tryStore,
            ret = {};

        if (storeDetected) {
            config = sankStore || config;
        }

        if (controller) {
            var dao = controller.getDao();

            if (tryAlias && !storeDetected) {
                config = dao.getStoreInstance(config, {
                    createIfNotExists: false,
                    preventSelfCall: true
                }, controller);
                if (config && config.isStore) {
                    storeDetected = true;
                }
            }


            if (!tryAlias && storeDetected) {
                tryStore = dao.getListStore(controller);

                if (config === tryStore) {
                    alias = 'list';
                    tryAlias = true;
                }
            }

            if (!tryAlias && storeDetected) {
                // alias reverse ingeneering, based on model class name
                var Model = config.getModel(),
                    modelClass = Model.getName(),
                    point = modelClass.lastIndexOf('.'),
                    className = modelClass.substring(point + 1),
                    possibleAlias = (className.substr(0, 1).toLowerCase() + className.substr(1)).replace('Model', '');

                tryStore = dao.getStoreInstance(possibleAlias, {
                    createIfNotExists: false,
                    preventSelfCall: true,
                    callInHostDao: true
                }, controller);

                if (tryStore && tryStore.isStore) {
                    tryAlias = true;
                    alias = possibleAlias;
                }

                if (!tryAlias) {
                    var placeHolder = possibleAlias + 'Store';

                    if ((tryStore = dao[placeHolder]) && tryStore.isStore) {
                        tryAlias = true;
                        alias = possibleAlias;
                    }
                }
            }

        }

        if (!tryAlias && storeDetected) {
            alias = config.getStoreId();
            tryAlias = Boolean(alias);
        }

        if (tryAlias) {
            ret.alias = alias;
        }

        if (storeDetected) {
            ret.store = config;
        }

        return ret;
    },


    /**
     *
     * @param controller
     * @param daoStores
     * @returns {Array}
     */
    prepareDaoStores: function(controller, daoStores) {
        const unexpectedError = 'Unexpected error trying materialize dao store %s. Exception in method \'dao # %s\'()';
        var dao = controller.getDao(),
            configStores = [];

        Ext.each(daoStores, function(storeConfig) {
            var options = Ext.isObject(storeConfig) ? storeConfig : {alias: storeConfig},
                subModuleModel = storeConfig ? storeConfig.model : null,
                multiplyInstances = storeConfig ? storeConfig.multiplyInstances : false,
                alias = multiplyInstances ? options.daoAlias : options.alias,
                store;

            if (Ext.isString(alias)) {
                var methodName = 'get' + Ext.String.capitalize(alias) + 'Store',
                    fn = dao[methodName];

                if (Ext.isFunction(fn)) {
                    store = fn.call(dao, controller, subModuleModel);
                }

                if (!store) {
                    methodName = 'get' + Ext.String.capitalize(alias) + 'Instance';
                    var instanceFn = dao[methodName],
                        instanceOptions = Ext.isFunction(instanceFn) ? instanceFn.call(dao, controller) : null;

                    store = dao.getStoreInstance(alias, instanceOptions, controller);
                }
                if (!Ext.isArray(store)) {
                    if (store && (store.isStore || Ext.isString(store))) {
                        options.store = store;
                        configStores.push(options);
                    }
                } else {
                    configStores = configStores.concat(store);
                }
            } else {
                configStores.push(storeConfig);
            }
        });

        return configStores;
    },


    /**
     * Normalise stores' configurations. Assigns `parameters`, `dictionary` flag, stores' filtering
     * Note that it get cloned copy of `stores` array, rather then use it as a result
     *
     * @param {Object} config
     * @param {Array} config.stores array of configurations
     * @param {Object} config.params common stores' parameters
     * @param {Boolean} [config.dictionary] is store dictionary
     * @returns {Array} Array of normalized configurations, which are options to create
     *      {@link PocketPAM2.transaction.request.Store Store Request}
     */
    configureStores: function(config) {
        var stores = config.stores,
            params = config.params,
            dictionary = config.dictionary,
            dependsOn = config.dependsOn,
            noConfig = config.noConfig,
            len = stores.length,
            removeCandidates = [],
            ret = [];

        Ext.each(stores, function(storeConfig) {
            var options = {
                params: params,
                dependsOn: dependsOn || !dictionary,
                isDictionary: dictionary
            };

            if (Ext.isString(storeConfig) || storeConfig.isStore) {
                options.store = storeConfig;
            } else {
                var origParams = storeConfig.params;
                if (Ext.isObject(origParams)) {
                    Ext.apply(origParams, params);
                }
                options = Ext.applyIf(storeConfig, options);
            }
            if (!noConfig) {
                ret.push(options);
            } else {
                ret.push(options.store);
            }

            // try to find dublictes
            if (len > 1 && storeConfig.hostConfig) {
                Ext.each(stores, function(duplicate) {
                    if (duplicate == storeConfig) {
                        return;
                    }
                    if (duplicate.alias == storeConfig.alias) {
                        removeCandidates.push(duplicate);
                    }
                })
            }
        });

        for (var i = removeCandidates.length - 1; i >= 0; i--) {
            var duplicate = removeCandidates[i],
                removeIndex = ret.indexOf(duplicate);

            ret.splice(removeIndex, 1)
        }
        return ret;
    },


    /**
     * Set or remove red tick flag of (usually) top bottom icon button. Existed red tick is indicate about some special
     * state of button's entity. Ie. Job contains not empty Notes or Entity List is filtered (filter criteria are non empty) and so on.
     *
     * @param {Ext.Button|Object} button Eithere button instance or config object for button
     * @param {Boolean|Ext.data.Store} marked boolean value direct instructs seting button's UI.
     * If this parameter is store multi-filtering and usual stores there are different algorithms for detecting marking
     * For multi-filtering store it's important that exist any not null parameter criterion.
     * For usual stores important is compare current count to its total count. If there is the difference the store is
     * treated as filtered (or dirty) and button's mark is set.
     *
     * @param {Ext.Controller} [controller]
     */
    markButtonTick: function(button, marked, controller) {
        var me = this;

        if (marked && marked.isStore) {
            var store = marked,
                hasOutFiltered = store.getOutFiltered;

            if (hasOutFiltered) {
                marked = store.getOutFiltered(controller);
            } else {
                var totalCount = store.getTotalCount(),
                    count = store.getCount();

                marked = totalCount > count;
            }
        }

        var badgeText = marked ? Ext.String.htmlDecode('&#10003;') : null;
        if (button instanceof Ext.Button) {
            button.setBadgeText(badgeText);
        } else {
            button.badgeText = badgeText;
        }
    },


    iterateOverBitmask: function(bitmask, highBit, callback, scope) {
        var me = this;
        scope = scope || me;

        while (bitmask) {
            //noinspection JSBitwiseOperatorUsage
            if (bitmask & highBit) {
                var ret = me.callback(callback, scope, [highBit]);
                if (ret === false) {
                    break;
                }
            }
            bitmask &= ~highBit;
            highBit >>= 1;
        }
    },


    iterateBitmaskAll: function(bitmask, highBit, callback, scope) {
        var me = this;
        scope = scope || me;

        while (bitmask) {
            //noinspection JSBitwiseOperatorUsage
            var ret = me.callback(callback, scope, [highBit, Boolean(bitmask & highBit)]);
            if (ret === false) {
                break;
            }
            bitmask &= ~highBit;
            highBit >>= 1;
        }
    },


    /**
     *
     * @param {Number} bitmask
     * @param {Number} [highestBit]
     * @returns {*|PocketPAM2.global.Constants.CROP|CROP}
     */
    mostHighBit: function(bitmask, highestBit) {
        var bit = highestBit || $.CROP, // by default for CropDiary Activities
            done = !bitmask;

        while (!done) {
            //noinspection JSBitwiseOperatorUsage
            done = bitmask & bit;
            if (!done) {
                bit >>= 1;
            }
        }

        return bit;
    },


    /**
     *
     * @param content
     * @returns {*}
     */
    getContentStrings: function(content) {
        /*
         var me = this,
         strings = me._contentStrings;

         if (strings == null) {
         strings = me.generatePluralSingle(content);
         }
         */
        if (!content) {
            return content
        }
        return this.generatePluralSingle(content);
    },


    /**
     *
     * @param term
     * @returns {{}}
     */
    generatePluralSingle: function(term) {
        var strings = {},
        //            singular = term.toLowerCase(),
            singular = term,
            plural = Ext.util.Inflector.pluralize(singular),
            singularCaps = Ext.String.capitalize(singular),
            pluralCaps = Ext.String.capitalize(plural);

        Ext.apply(strings, {
            singular: singular,
            plural: plural,
            singularCaps: singularCaps,
            pluralCaps: pluralCaps
        });

        return strings;
    },




    /**
     * The iterator looks through the raw store, checks join table (or parameters) and call to callback, either for founded record or not founded ones.
     * Raw Store is a reflection the DB table content into plain Store. No grouping, joined columns from other table or any other transofrmation is not presumed.
     *
     * @param {Object} config
     * @param {Ext.data.Store} config.rawStore Raw Store, ie. for CD manu this is the ManuRecsStore
     * @param {Ext.data.Store|Object} config.joined
     * @param {Function} config.foundCb
     * @param {Function} config.notFoundCb
     * @param {Boolean} config.some Do return from the iterator if found first matched pair
     */
    leftJoinStoresIterator: function(config) {
        const separatorRe = /[;,\s]+/;

        var me = this,
            leftStore = config.leftStore,
            rightStore = config.rightStore,
            leftJoinColumns = config.leftJoinColumns,
            rightJoinColumns = config.rightJoinColumns,
            joinColumns = config.joinColumns,
            comparatorFn = config.comparatorFn,
            matchedCb = config.matchedCb,
            unMatchedCb = config.unMatchedCb,
            leftCb = config.leftCb,
//            some = config.some,
            scope = config.scope,
            leftGetterName = investigateGetterName(leftStore),
            rightGetterName = investigateGetterName(rightStore);

        if (Ext.isString(joinColumns)) {
            joinColumns = joinColumns.split(separatorRe);

            if (!leftJoinColumns) {
                leftJoinColumns = joinColumns;
            }

            if (!rightJoinColumns) {
                rightJoinColumns = joinColumns;
            }
        } else {
            if (!leftJoinColumns) {
                leftJoinColumns = joinColumns;
            }

            if (!rightJoinColumns) {
                rightJoinColumns = joinColumns;
            }
        }

        if (Ext.isString(leftJoinColumns)) {
            leftJoinColumns = leftJoinColumns.split(separatorRe);
        }

        if (Ext.isString(rightJoinColumns)) {
            rightJoinColumns = rightJoinColumns.split(separatorRe);
        }

        if (leftStore.isStore) {
            leftStore.each(leftStoreIterator);
        } else {
            Ext.each(leftStore, leftStoreIterator);
        }


        function leftStoreIterator(row, index) {
            var leftKeys = encodeJoinValues(row, true),
                found = false;

            if (rightStore.isStore) {
                rightStore.each(rightStoreIterator);
            } else {
                Ext.each(rightStore, rightStoreIterator);
            }

            if (!found) {
                Ext.callback(unMatchedCb, scope, [row, index]);
            }

            Ext.callback(leftCb, scope, [row, index]);
//            if (some) {
//                return !found;
//            }


            function rightStoreIterator(rightRow, rightIndex) {
                var rightKeys = encodeJoinValues(rightRow, false);

                if (matchJoins(leftKeys, rightKeys)) {
                    found = true;
                    Ext.callback(matchedCb, scope, [row, rightRow, index, rightIndex]);
                }
//                if (some) {
//                    return !found;
//                }
            }
        }


        function encodeJoinValues(item, left) {
            var columns = left ? leftJoinColumns : rightJoinColumns,
                getter = left ? leftGetterName : rightGetterName;

            if (comparatorFn) {
                return item;
            }

            var ret = [];

            Ext.each(columns, function(key, index) {
                var itemValue = item[getter](key);

                ret.push(itemValue);
            });
            return ret;
        }


        function matchJoins(left, right) {
            var matched = true;

            if (!comparatorFn) {
                for (var index = 0; index < left.length; index++) {
                    var leftValue = left[index],
                        rightValue = right[index];

                    matched = me.isEqual(leftValue, rightValue);

                    if (!matched) {
                        break;
                    }
                }
            } else {
                matched = comparatorFn.call(scope || me, left, right);
            }

            return matched;
        }


        function investigateGetterName(container) {
            var isArray = Ext.isArray(container),
                getter = 'get';

            if (isArray) {
                var firstElement = container[0],
                    isField = firstElement && firstElement.isField;

                if (isField) {
                    getter = 'getItemId'
                }
            }

            return getter;
        }
    },


    /**
     *
     * @param list
     * @param fn
     * @param scope
     */
    each: function(list, fn, scope) {
        if (list.isStore) {
            list.each(fn, scope)
        } else if (Ext.isArray(list)) {
            Ext.each(list, fn, scope);
        }
    },


    /**
     *
     * @param value
     * @returns {*}
     */
    convertHoursToInt: function(value) {
        if (!Ext.isNumeric(value) && Ext.isString(value) && value.length) {
            var recognizeRe = /(\d{1,2}):(\d{1,2})/,
                parsed = recognizeRe.exec(value);

            if (parsed) {
                var hours = parsed[1],
                    minutes = parsed[2],
                    hoursInt = Number(hours),
                    minutesInt = Number(minutes) / 60;

                value = Workflow.round(hoursInt + minutesInt, true);
            }
        }

        return value;
    },


    /**
     *
     * @param hours
     * @returns {*}
     */
    convertIntToHours: function(hours) {
        if (Ext.isNumber(hours)) {
            hours = Workflow.round(hours, true);
            var wholeHours = Math.floor(hours),
                minutes = Workflow.round((hours - wholeHours) * 60, true);

            hours = sprintf('%02d:%02d', wholeHours, minutes)
        }
        return hours;
    },


    /**
     * 'Deep' javascript object's comparison, arguments can be array or objects.
     * See http://stackoverflow.com/questions/1068834/object-comparison-in-javascript for more information.
     *
     * @param a
     * @param b
     * @private
     * @param depth prevent invinit recursion
     *
     * @returns {boolean}
     */
    areObjectsEqual: function(a, b, depth) {
        if (a === b) return true;
        if (depth >= 10) return false;
        // if both a and b are null or undefined and exactly the same

        if (!( a instanceof Object ) || !( b instanceof Object )) return false;
        // if they are not strictly equal, they both need to be Objects

        if (a.constructor !== b.constructor) return false;
        // they must have the exact same prototype chain, the closest we can do is
        // test there constructor.

        for (var p in a) {
            if (!a.hasOwnProperty(p)) continue;
            // other properties were tested using a.constructor === b.constructor

            if (!b.hasOwnProperty(p)) return false;
            // allows to compare a[ p ] and b[ p ] when set to undefined

            if (a[p] === b[p]) continue;
            // if they have the same strict value or identity then they are equal

            if (typeof( a[p] ) !== "object") return false;
            // Numbers, Strings, Functions, Booleans must be strictly equal

            if (!this.areObjectsEqual(a[p], b[p], (depth || 0) + 1)) return false;
            // Objects and Arrays must be tested recursively
        }

        for (p in b) {
            if (b.hasOwnProperty(p) && !a.hasOwnProperty(p)) return false;
            // allows a[ p ] to be set to undefined
        }
        return true;
    },


    /**
     * This method is being called to check 'shallow' equality of objects or primitive types
     * It does not check 'deep' Objects' equality.
     *
     * @param a
     * @param b
     * @param fuzzy
     * @returns {Boolean} true if both objects are treated as equal
     */
    isEqual: function(a, b, fuzzy) {
        var ret = null;
        if (Ext.isDate(a) && Ext.isDate(b)) {
            ret = a.getTime() === b.getTime();
        }
        if (fuzzy) {
            if (!a && !b) {
                return true;
            }
        }
        if (ret == null && (a == null || b == null) && (a == 0 || b == 0) && !(Ext.isBoolean(a) || Ext.isBoolean(b))) {
            ret = true;
        }
        if (ret == null && !(Ext.isObject(a) || Ext.isObject(b))) {
            ret = a == b;
        } else {
            ret = a === b;
        }
        return ret;
    },


    /**
     *
     * @param num
     * @param digits
     * @param rattle
     * @returns {*}
     */
    round: function(num, digits, rattle) {
        if (!num) {
            return num;
        }
        var rounded = num;

        if (Ext.isNumeric(digits)) {
            digits = digits || 0;
            rounded = Number(num).toFixed(digits);
            // if rounded == 0 but not-rounded > EPSILON give a chance to return least meaning digits
            if (num > $.EPSILON && rounded == 0) {
                rounded = mostMeaningDigit(num, digits);
            }
        } else if (digits === true || rattle === true) {
            rounded = truncRattle(num);
        }
        return Number(rounded);

        function mostMeaningDigit(n, digs) {
            var strnum = String(n),
                point = strnum.indexOf('.'),
                mostMeaningIndex = point + digs + 1,
                len = strnum.length;

            while (mostMeaningIndex < len) {
                if (strnum[mostMeaningIndex++] != '0') {
                    break;
                }
            }
            return Number(strnum.substring(0, mostMeaningIndex));
        }

        function truncRattle(n) {
            // EPSILON  - Difference between 1 and the least value greater than 1 that is representable.

            var strnum = String(n),
                epsilon = $.EPSILON,
                point = strnum.indexOf('.'),
                ret = n;

            if (point != -1) {
                var patterns = ['000', '999'];

                Ext.each(patterns, function(pattern) {
                    var fragmentIndex = strnum.indexOf(pattern, point + 1);
                    if (fragmentIndex != -1) {
                        var toFixedDigits = fragmentIndex - point - 1,
                            fixed = n.toFixed(toFixedDigits);

                        ret = Number(fixed);
                        if (Math.abs(ret - n) > epsilon) {
                            ret = n;
                        }
                    }
                });
            }
            return ret;
        }
    },


    /**
     *
     * @param dt
     * @param discreting
     * @returns {*}
     */
    roundToInterval: function(dt, discreting) {
        if (!Ext.isDate(dt)) {
            try {
                var original = dt;
                dt = new Date(dt);
            } catch (e) {
                return original;
            }
        }

        var minutes = dt.getMinutes(),
            wholeParts = minutes / discreting,
            rounded = Math.floor(wholeParts) * discreting;

        var year = dt.getFullYear();
        var month = dt.getMonth();
        var date = dt.getDate();
        var hours = dt.getHours();

        return new Date(year, month, date, hours, rounded);
    },


    /**
     *
     * @param selectionList
     * @param tallyField
     * @returns {number}
     */
    getTotalTally: function(selectionList, tallyField) {
        var me = this,
            ret = 0,
            field = tallyField;

        me.each(selectionList, function(rec) {
            ret += rec.get(field);
        });
        return ret;
    },


    /**
     *
     * @param fieldName
     * @param suffix
     * @returns {*}
     */
    stripDownSuffix: function(fieldName, suffix) {
        var me = this,
            ends = suffix || 'ID',
            stripLen = ends.length,
            ret = fieldName,
            isEnded = ret ? me.endsWith(ret, ends) : false;

        if (isEnded) {
            ret = ret.substr(0, ret.length - stripLen);
        }
        return ret;
    },


    figureOutModelAlias: function(Model) {
        var me = this,
            modelName = Model.getName(),
            lastPoint = modelName.lastIndexOf('.'),
            entityName = modelName.substring(lastPoint + 1),
            entity = me.stripDownSuffix(entityName, 'Model');

        return me.decapitalize(entity);
    },


    /**
     *
     * @param s
     * @param other
     * @returns {boolean}
     */
    boundsCheck: function(s, other) {
        if (s === null || s === undefined || other === null || other === undefined) {
            return false;
        }

        return other.length <= s.length;
    },


    /**
     * Checks if a string starts with a substring
     * @member PocketPAM2.global.WorkflowHelper
     * @param {String} s The original string
     * @param {String} start The substring to check
     * @param {Boolean} [ignoreCase=false] True to ignore the case in the comparison
     */
    startsWith: function(s, start, ignoreCase) {
        var result = this.boundsCheck(s, start);

        if (result) {
            if (ignoreCase) {
                s = s.toLowerCase();
                start = start.toLowerCase();
            }
            result = s.lastIndexOf(start, 0) === 0;
        }
        return result;
    },

    /**
     * Checks if a string ends with a substring
     * @member PocketPAM2.global.WorkflowHelper
     * @param {String} s The original string
     * @param {String} end The substring to check
     * @param {Boolean} [ignoreCase=false] True to ignore the case in the comparison
     */
    endsWith: function(s, end, ignoreCase) {
        var result = this.boundsCheck(s, end);

        if (result) {
            if (ignoreCase) {
                s = s.toLowerCase();
                end = end.toLowerCase();
            }
            result = s.indexOf(end, s.length - end.length) !== -1;
        }
        return result;
    },


    /**
     * De-capitalize the given string. (CamelCase ?)
     * @member PocketPAM2.global.WorkflowHelper
     * @param {String} string
     * @return {String}
     */
    decapitalize: function(string) {
        if (this.isEmpty(string)) {
            return string;
        }
        return string.charAt(0).toLowerCase() + string.substr(1);
    },


    /**
     *
     * @param obj
     * @param property
     * @returns {boolean|*}
     */
    isPropertyDefined: function(obj, property) {
        return typeof obj == 'object' && (obj.hasOwnProperty(property) || Object.prototype.toString.apply(obj[property]) != '[object Undefined]');
    },


    /**
     * Borrowd from Ext.Object.merge. Reason to 'fix' it - original does not merge Arrays' properties properly
     *
     * @param source
     * @returns {*}
     */
    merge: function(source) {
        var me = this,
            i = 1,
            ln = arguments.length,
            mergeFn = me.merge,
            cloneFn = Ext.clone,
            object, key, value, sourceKey;

        for (; i < ln; i++) {
            object = arguments[i];

            for (key in object) {
                value = object[key];
                if (value && value.constructor === Object) {
                    sourceKey = source[key];
                    if (sourceKey && sourceKey.constructor === Object) {
                        mergeFn(sourceKey, value);
                    } else {
                        source[key] = cloneFn(value);
                    }
                } else if (value && value.constructor === Array) {
                    sourceKey = source[key];
                    if (sourceKey && sourceKey.constructor === Array) {
                        source[key] = sourceKey.concat(value);
                    } else if (sourceKey && sourceKey.constructor === Object) {
                        // exotic case where array is merging to object.
                        // possible, but not practical
                        /*
                         for (var j = 0; j < value.length; j++) {
                         var property = value[j];

                         }
                         */
                    } else if (sourceKey) {
                        source[key] = [sourceKey].concat(value);
                    }
                } else {
                    source[key] = value;
                }
            }
        }

        return source;
    },


    /**
     * There is old implementation till March 7, 2015. It is a bit buggy and is used only for eventual fixing code
     * is based on its 'quirk' behaviour.
     *
     * DO NOT USE IN CODE!!! DO NOT REMOVE!!! DO NOT CHANGE!!!
     *
     * See Siesta tests/02_workflow.t.js
     *
     * @private
     * @deprecated
     */
    isEmptyQuirk: function(object, fn, scope) {
        var me = this;
        if (fn === false && object === 0) {
            // format #isEmpty(object, doNotTreatZeroAsEmpty
            return false;
        }
        if (Ext.isArray(object)) {
            return !object.length;
        }
        if (!Ext.isObject(object)) {
            if (object instanceof Date && Ext.isFunction(fn)) {
                return fn.call(scope || me, object);
            }
            return !object;
        }
        if (object.isStore) {
            return !object.getCount();
        }
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                if (fn) {
                    var value = object[key];
                    return fn.call(scope, key, value);
                } else {
                    return false;
                }
            }
        }
        return true;
    },


    /**
     * Expand functionality of {@link Ext#isEmpty} with followng aspects
     *  - Object is treated as empty if it has no properties, or callback fn|scope called for every property returns empty as true.
     *    Format of `fn` is *function fn(propertyName, propertyValue)*
     *  - in call isEmpty(number, false) - if number === 0 is treated not as empty - return `false`
     *  - if first argument is {@link Ext.data.Store} - on empty store returns `true`
     *  - Date with defined fn|scope is treated empty, if call of fn.call(scope, Date) returns true.
     *
     * @param {*|Function} object Any javascript object or function
     * @param {Boolean|Function} fn
     * @param scope
     * @returns {Boolean} `true` if object or value considered as empty.
     */
    isEmpty: function(object, fn, scope) {
        var me = this;
        // format #isEmpty(Number, doNotTreatZeroAsEmpty
        if (object === 0) {
            if (fn === false || fn === true) {
                return fn;
            } else if (fn === undefined) {
                // quirk fixation
                return true;
            }
        }

        // quirk fixation
        if (object === false) {
            if (fn === undefined) {
                return false;
            }

            if (fn === true) {
                return true;
            }
        }

        if (!Ext.isObject(object)) {
            if (Ext.isDate(object)) {
                if (Ext.isFunction(fn)) {
                    return fn.call(scope || me, object);
                }
                if (object.getTime() === $.NullDateTime) {
                    return true;
                }
            }
            if (fn === false && Ext.isArray(object)) {
                return false
            }
            return Ext.isEmpty.apply(Ext, arguments);
        }

        // here object should be Object
        if (fn === false) {
            return false;
        }
        if (object.isStore) {
            return !object.getCount();
        } else if (object === $.ModelFake) {
            return true;
        }

        var isEmpty = true;
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                var value = object[key];

                if (fn && Ext.isFunction(fn)) {
                    isEmpty = fn.call(scope | me, key, value);
                } else if (fn === true) {
                    isEmpty = Workflow.isEmpty(value, fn);
                } else {
                    isEmpty = false;
                }
            }
            if (!isEmpty) {
                break;
            }
        }
        return isEmpty;
    },


    /**
     * Same is the {@link Ext.callback} with only one discrepancy.
     * Ext.callback does not return value of callback, if delay: 0, this method does.
     *
     * Calls function after specified delay, or right away when delay == 0.
     * @param {Function} callback The callback to execute.
     * @param {Object} scope (optional) The scope to execute in.
     * @param {Array} args (optional) The arguments to pass to the function.
     * @param {Number} delay (optional) Pass a number to delay the call by a number of milliseconds.
     * @member Ext
     */
    callback: function(callback, scope, args, delay) {
        if (Ext.isFunction(callback)) {
            args = args || [];
            scope = scope || window;
            if (delay) {
                Ext.defer(callback, delay, scope, args);
            } else {
                return callback.apply(scope, args);
            }
        }
    },


    iterateAll: function() {
        var me = this,
            argLen = arguments.length,
            cb = arguments[argLen - 1];

        if (!Ext.isFunction(cb)) {
            // TODO throw exception or console error
            return;
        }

        for (var i = 0; i < arguments.length - 1; i++) {
            var obj = arguments[i];
            if (Ext.isArray(obj)) {
                Ext.Array.each(obj, cb);
            } else if (Ext.isObject(obj)) {
                for (var key in obj) {
                    // intended do not check hasOwnProperty...
                    //noinspection JSUnfilteredForInLoop
                    cb.call(obj, key, obj[key]);
                }
            }
        }
    },


    /**
     * Universal method (swiss-knife) to looking for record in store.
     * Often is using in raw stores, but can be useful anywhere.
     * The parameters can be single: property/value, or composite.
     * If composite, *options* object is the composite key. Additionally *keyFields* reduce composite key only to listed properties.
     *
     * If raw record is retained (found in Raw Store), the method returns one, null if not found
     *
     * @param {Ext.data.Store} store
     * @param {Object| String} options seach (composite) values or Field Name (for exact searching)
     * @param {String|Array|Object} [keyFields] comma-separated list of joined field or array of ones.
     * @returns {Ext.data.Model} model or `$.ModelFake` if not found
     */
    findByCompositeValues: function(store, options, keyFields) {
        var me = this;

        function findByKeys(item) {
            var found = true;

            Ext.each(keyFields, function(key) {
                found = me.isEqual(options[key], item.get(key), true);
                return found;
            });
            return found;
        }

        function findByOptions(item) {
            var found = true;

            Ext.Object.each(options, function(key) {
                found = me.isEqual(options[key], item.get(key), true);
                return found;
            });
            return found;
        }

        function retFn() {
            var fn;
            if (keyFields) {
                if (Ext.isString(keyFields)) {
                    keyFields = keyFields.split(',');
                }
                fn = findByKeys;
            } else {
                fn = findByOptions;
            }
            var reusedIndex = store.findBy(fn);

            return store.getAt(reusedIndex)
        }

        var ret;
        if (Ext.isString(options)) {
            var index = store.findExact(options, keyFields);
            ret = store.getAt(index);
        } else {
            ret = retFn();
        }
        return ret || $.ModelFake;
    },


    findById: function(source, id) {
        for (var i = 0; i < source.length; i++) {
            if (source[i].id === id) {
                return source[i];
            }
        }
        throw "Couldn't find object with id: " + id;
    },


    /**
     *
     * @param source
     * @returns {boolean}
     */
    anyItemsSelected: function(source) {
        var ret = false;
        for (var i = 0; i < source.length; i++) {
            if (source[i].Selected) {
                ret = true;
                break;
            }
        }
        return ret;
    },


    /**
     *
     * @param source
     */
    removeUnSelected: function(source) {
        var i, removedItems = [];
        for (i = source.length; i--;) {
            if (source[i].Selected == false) {
                source.splice(i, 1);
            }
        }
    },


    /**
     *
     * @param object
     * @param fn
     * @param scope
     */
    eachAll: function(object, fn, scope) {
        for (var property in object) {
            //noinspection JSUnfilteredForInLoop
            if (fn.call(scope || object, property, object[property], object) === false) {
                return;
            }
        }
    },


    /**
     *
     * @param stores
     * @param {Function|String} iterateFn callback function to check or Store Alias
     * @param {Controller|Object} options controller or options.controller
     * @param {Class} [scope] callback scope, Workflow if missed
     */
    iterateOverStoresWithRemove: function(stores, iterateFn, options, scope) {
        if (!stores) {
            return;
        }
        var me = this,
            controller = options && options.controller,
            ln = stores.length;

        if (!controller) {
            controller = options;
        }

        for (var index = ln - 1; index >= 0; index--) {
            var storeConfig = stores[index],
                normalized = me.normalizedStoreConfig(storeConfig, controller),
                doRemove = false;

            if (Ext.isFunction(iterateFn)) {
                doRemove = iterateFn.call(scope || me, normalized.alias, index, normalized.store)
            } else {
                doRemove = normalized.alias == iterateFn;
            }

            if (doRemove) {
                stores.splice(index, 1);
            }
        }
    },


    /**
     *
     * @param store
     * @param model
     * @param field
     * @returns {boolean}
     */
    findSimilar: function(store, model, field) {
        var me = this,
            ret = false,
            value = model.get(field);

        store.each(function(record) {
            if (record != model) {
                var recordValue = record.get(field);
                if (recordValue == value) {
                    ret = true;
                    return false;
                }
            }
            return true;
        });
        return ret;
    },


    /**
     *
     * @param store
     * @param tallyField
     * @param exclude
     * @returns {number}
     */
    getStoreTotalTally: function(store, tallyField, exclude) {
        var me = this,
            ret = 0,
            field = tallyField || 'Tally';

        store.each(function(rec, index) {
            if (exclude != null) {
                if (Ext.isNumber(exclude)) {
                    if (exclude == index) {
                        return;
                    }
                } else if (exclude.isModel) {
                    if (exclude == rec) {
                        return;
                    }
                }

            }
            ret += rec.get(field) || 0;
        }, me);
        return ret;

    },


// public
    /**
     *
     * @param store
     * @param options
     */
    performClientGrouping: function(store, options) {
        if (!options || options === true) {
            options = {};
        }
        // do client grouping
        var me = this,

            /**
             * @cfg all configuration value for clientGrouping. If set to true, iteration is over all elements. Note that it
             * is not properly sorted, if sorting is given via {@link sorters}. In this case need to provide correct soring in
             * proxy at server side, GROUP BY in sql
             * @type {Boolean}
             */
            iterateOverAll = options.all,
            first,
            last,
            prev = null,
            cur,
            Model = store.getModel(),
            init = Ext.apply(options, {
                Model: Model,
                singleGroup: false
            }),
            grouper = new me.Grouper(init);

//  <debug>
//        var startTime = new Date(),
//            counter = 0,
//            timestamp,
//            prevEtap = startTime;
//  </debug>

        var iterateeFn = function(cur, i, ln) {
            first = i == 0;
            last = i == ln - 1;

            if (!first && !grouper.checkEquivalence(prev, cur)) {
                grouper.commitGroup();
            }

            if (first || !grouper.checkEquivalence(prev, cur)) {
                grouper.initGroup(cur);
            } else {
                grouper.checkPreference(cur);
            }

            grouper.putInGroup(cur);
            if (last) {
                grouper.commitGroup();
            } else {
                prev = cur;
            }
//  <debug>
//            timestamp = new Date();
//            if (!(++counter % 100)) {
//                console.log (' ** %d, %d, %d', counter, timestamp - startTime, timestamp - prevEtap);
//                prevEtap = timestamp
//            }
//  </debug>

        };

        store.suspendEvents();

        if (iterateOverAll) {
            store.eachAll(iterateeFn);
        } else {
            store.each(iterateeFn);
        }

        store.resumeEvents(true);

        grouper.finishClientGrouping();
        grouper.finalize(store);

//  <debug>
//        timestamp = new Date();
//        console.log (' ** %d, %d, %d', counter, timestamp - startTime, timestamp - prevEtap);
//  </debug>

    },


    /**
     *
     * @param store
     * @param hydrateConfig
     * @param dao
     * @returns {PocketPAM2.global.WorkflowHelper.Grouper}
     */
// public
    getGroupStatistics: function(store, dao, hydrateConfig) {
        hydrateConfig = hydrateConfig || {};
        if (!hydrateConfig.data) {
            hydrateConfig.data = {};
        }
        var me = this,
            Model = store.getModel(),
            grouper = new me.Grouper({
                Model: Model,
                hydrateConfig: hydrateConfig,
                singleGroup: true,
                dao: dao
            });

        grouper.initGroup(null);
        store.each(function(cur) {
            grouper.checkPreference(cur);
            grouper.putInGroup(cur);
        });
        if (store.getCount() > 0) {
            grouper.commitGroup();
            grouper.finishClientGrouping();
        }

        return grouper;
    }


}, function(cls) {

    /**
     * Plain vanilla class for getting local grouping (as opposite to server groping - SELECT ... FROM ... GROUP BY).
     *
     * It is not intended to be public. It is used from two Workflow methods
     * {@link PocketPAM2.global.WorkflowHelper#performClientGrouping} and
     * {@link PocketPAM2.global.WorkflowHelper#getGroupStatistics}.
     *
     * As an input for first one should be supplied a plain list of RECS entries, say List of all CropRecs records.
     * The list should be sorted with JobNo, or any other group selector group.
     * As the result Grouper get out list with *bold* records, one per **JobNo**, other fields is being removed
     * This filtered list usually is a data soruce for {@link PocketPAM2.view.ContentListPanel Content's List Panel}
     *
     * Another class use case is choosing of the *bold* record if at the input get a group of records without doing
     * filtering. In principal if it would only this task, appropriate stores' sorting can perform the same, but
     * using Grouper allows do additional jobs, such getting aggregated functions of the set (count(), sum(), max()...)
     * from one side and from another side it also allows record's *hydrating*.
     *
     * Both modes are switching with {@link #singleGroup) setting.
     *
     * Grouper select a m
     *
     * @class PocketPAM2.global.WorkflowHelper.Grouper
     * @private
     * @constructor
     */
    var Grouper = cls.Grouper = function(init) {
        //
        var me = this;
        /**
         * @cfg {boolean} singleGroup true if no need to filter list (all records are
         */
        var singleGroup = me.singleGroup = init.singleGroup;
        var hydrateConfig = me.hydrateConfig = init.hydrateConfig;
        var Model = me.Model = init.Model;
        var criteria = me.criteria = {};
        var aggregates = me.aggregates = {};
        var aggregateInits = me.aggregateInits = {};
        var hashes = me.hashes = {};
        var enums = me.enums = {};
        var plains = me.plains = {};

        me.callback = init.callback;
        me.dao = init.dao;

        var callbackScope = init.scope || me;
        if (Ext.isString(me.callback)) {
            me.callback = callbackScope[me.callback];
        }
        me.scope = callbackScope;
        me.softDelete = init.softDelete;

        me.toDelete = [];

        var preferences = [],
            hydrating = !!hydrateConfig,
            fields = Model.getFields();

        if (hydrating) {
            Ext.apply(hydrateConfig, {
                stores: {}
            });
        }

        fields.each(function(field) {
            var fieldConfig = field.getInitialConfig(),
                groupBy = fieldConfig.groupBy,
                fieldName = field.getName();

            if (hydrating) {
                var lookupStore = fieldConfig.lookupStore;

                if (lookupStore) {
                    var lookupStores = hydrateConfig.stores,
                        lookupField = fieldConfig.lookupField,
                        lookup = lookupStores[lookupStore],
                        hydrateField = fieldConfig.hydrateField;

                    if (!lookup) {
                        lookup = lookupStores[lookupStore] = {
                            keys: {},
                            mapping: {}
                        };
                    }
                    lookup.keys[fieldName] = lookupField;
                    if (!hydrateField) {
                        hydrateField = cls.stripDownSuffix(fieldName);
                    }
                    lookup.mapping[hydrateField] = undefined;
                }
            }

            Ext.Object.each(groupBy, function(property, value) {
                //noinspection FallThroughInSwitchStatementJS
                switch (property) {
                    case 'preference':
                        preferences.push({name: fieldName, prio: value});
                        break;

                    case 'selectorField':
                        var compoundSelectorField = me[property];
                        if (compoundSelectorField) {
                            if (!Ext.isArray(compoundSelectorField)) {
                                me[property] = [compoundSelectorField]
                            }
                            me[property].push(fieldName);
                        } else {
                            me[property] = fieldName;
                        }
                        break;

                    case 'plainGroup':
                        plains[value] = true;
                        break;

                    case 'enumGroup':
                    case 'group':
                        if (Ext.isArray(value)) {
                            Ext.each(value, function(v) {
                                enums[v] = true;
                                initCriteria(v);
                            })
                        } else {
                            enums[value] = true;
                            initCriteria(value);
                        }
                        break;

                    case 'bitwise':
                    case 'boldBitwise':
                        if (!Ext.isString(value)) {
                            value = fieldName;
                        }
                        aggregates[fieldName] = aggregateInits[value] = 0;
                        break;

                    case 'count':
                    case 'sum':
                    case 'boldSum':
                        aggregates[fieldName] = aggregateInits[fieldName] = 0;
                        break;

                    case 'min':
                    case 'max':
                        aggregates[fieldName] = aggregateInits[fieldName] = null;
                        break;
                }

                function initCriteria(v) {
                    var exists = criteria[v];
                    if (!exists) {
                        criteria[v] = {};
                        hashes[v] = {};
                    }
                }
            })
        });

        Ext.Array.sort(preferences, function(a, b) {
            return b.prio - a.prio;
        });

        var flatPreferences = [],
            selectorField = me.selectorField;
        for (var i = 0; i < preferences.length; i++) {
            var item = preferences[i];
            flatPreferences.push(item.name);
        }
        me.preferences = flatPreferences;

        if (!selectorField && !singleGroup) {
            throw new Error('Grouping: NOT DEFINED \'selectorField\'!. CHECK THE CODE');
        }

        me.checkEquivalence = !Ext.isArray(selectorField) ?
            function(prev, cur) {
                return prev && prev.get(selectorField) == cur.get(selectorField);
            } :
            function(prev, cur) {
                var equals = true;
                Ext.each(selectorField, function(field) {
                    return (equals = (prev.get(field) == cur.get(field)));
                });
                return equals;
            };
    };

    var grouperProto = Grouper.prototype;

    var config = {
        initGroup: function(cur) {
            var me = this,
                aggregates = me.aggregates,
                aggregateInits = me.aggregateInits,
                hashes = me.hashes,
                enums = me.enums,
                plains = me.plains,
                hydrateConfig = me.hydrateConfig,
                hydrateData = hydrateConfig ? hydrateConfig.data : null;

            me.bold = cur;

            Ext.Object.each(enums, function(enumField) {
                enums[enumField] = [];
            });
            Ext.Object.each(plains, function(plainField) {
                plains[plainField] = [];
            });
            Ext.Object.each(hashes, function(hashKey) {
                hashes[hashKey] = {};
            });

            Ext.Object.each(aggregates, function(fieldName) {
                aggregates[fieldName] = aggregateInits[fieldName];
            });

            Ext.Object.each(hydrateData, function(fieldName) {
                hydrateData[fieldName] = undefined;
            });
        },


        putInGroup: function(cur) {
            var me = this,
                fields = cur.getFields(),
                singleGroup = me.singleGroup,
                criteria = me.criteria,
                aggregates = me.aggregates,
                hashes = me.hashes,
                enums = me.enums,
                plains = me.plains,
                toDelete = me.toDelete;

            fields.each(function(field) {
                var fieldConfig = field.getInitialConfig(),
                    groupBy = fieldConfig.groupBy,
                    fieldName = field.getName();

                Ext.Object.each(groupBy, function(property, value) {
                    var fieldValue = cur.get(fieldName),
                        oldValue = criteria[fieldName],
                        criterion;

                    switch (property) {
                        case 'plainGroup':
                            var plainGroup = plains[value];

                            Ext.Array.include(plainGroup, fieldValue);
                            break;
                        case 'enumGroup':
                        case 'group':
                            if (Ext.isArray(value)) {
                                Ext.each(value, function(v) {
                                    initCriterion(v);
                                })
                            } else {
                                initCriterion(value);
                            }
                            break;

                        case 'bitwise':
                        case 'boldBitwise':
                            if (!Ext.isString(value)) {
                                value = fieldName;
                            }
                            aggregates[value] |= fieldValue;
                            break;

                        case 'count':
                            aggregates[fieldName]++;
                            break;

                        case 'min':
                            if (oldValue == null || fieldValue < oldValue) {
                                aggregates[fieldName] = fieldValue;
                            }
                            break;

                        case 'max':
                            if (oldValue == null || fieldValue > oldValue) {
                                aggregates[fieldName] = fieldValue;
                            }
                            break;

                        case 'sum':
                            var addValue = Number(fieldValue);
                            if (!isNaN(addValue)) {
                                aggregates[fieldName] += addValue;
                            }
                            break;
                    }

                    function initCriterion(v) {
                        criterion = criteria[v];
                        criterion[fieldName] = fieldValue;
                    }
                });
            });

            Ext.Object.each(criteria, function(criterion, values) {
                var justAdded = me.put(hashes[criterion], values),
                    enumGroup = enums[criterion],
                    processEnum = enumGroup ? justAdded : false;

                if (processEnum) {
                    var clone = Ext.apply({}, values);
                    enumGroup.push(clone);
                }
            });

            if (singleGroup) {
                var hydrateConfig = me.hydrateConfig,
                    hydrateData = hydrateConfig.data,
                    totalCountField = hydrateConfig.totalCount;

                if (Ext.isArray(totalCountField)) {
                    totalCountField = totalCountField[0];
                }
                if (totalCountField) {
                    var value = hydrateData[totalCountField] || 0;

                    hydrateData[totalCountField] = ++value;
                }
            }
            toDelete.push(cur);
        },


        beforeGroupCommit: function() {
            var me = this,
                bold = me.bold,
                hydrateConfig = me.hydrateConfig,
                singleGroup = me.singleGroup,
                hydrating = !!hydrateConfig,
                fields = me.Model.getFields();

            if (!singleGroup) {
                fields.each(function(field) {
                    var fieldConfig = field.getInitialConfig(),
                        groupBy = fieldConfig.groupBy,
                        fieldName = field.getName(),
                        aggregates = me.aggregates,
                        hashes = me.hashes,
                        boldValue;

                    Ext.Object.each(groupBy, function(property, value) {
                        switch (property) {
                            case 'others':
                                var hash = hashes[value];

                                boldValue = me.getGroupCount(hash);
                                boldValue = boldValue - 1;
                                break;

                            case 'bitwise':
                            case 'boldBitwise':
                                if (!Ext.isString(value)) {
                                    value = fieldName;
                                }
                                bold.set(value, aggregates[value], true);
                                break;

                            case 'antiBold': // look record with
                            case 'boldSum':
                                var toDelete = me.toDelete,
                                    boldGroupName = groupBy.enumGroup,
                                    enums = me.enums,
                                // enumGroup contains all unique combination for SUM(DISTINCT) or for LOWEST(DISTINCT) [antiBold]
                                    distinctKeys = enums[boldGroupName],
                                    fieldValue = null,
                                    isAntiBold = property == 'antiBold';

                                boldValue = null;
                                // For every unique combination...
                                Ext.each(distinctKeys, function(keys) {
                                    var foundRecord;

                                    // ... search through all *deleted* items
                                    // At this time toDelete contains all groups elements, bold item will be removed from *toDelete* later.
                                    Ext.each(toDelete, function(deleted) {
                                        foundRecord = deleted;

                                        if (bold !== deleted) {
                                            if (me.checkEquivalence(deleted, bold)) {
                                                // deleted item is owned to the same group as the bold one (basically same JobNo)
                                                Ext.Object.each(keys, function(key, value) {
                                                    if (deleted.get(key) != value) {
                                                        foundRecord = null;
                                                        return false;
                                                    }
                                                });
                                            } else {
                                                foundRecord = null;
                                            }
                                        }
                                        return !foundRecord;
                                    });

                                    if (foundRecord) {
                                        if (isAntiBold) {
                                            fieldValue = foundRecord.get(fieldName);
                                            if (fieldValue < boldValue || boldValue === null) {
                                                boldValue = fieldValue;
                                            }
                                        } else {
                                            if (boldValue === null) {
                                                boldValue = foundRecord.get(fieldName);
                                            } else {
                                                boldValue += foundRecord.get(fieldName);
                                            }
                                        }
                                    }
                                });
                                break;

                            case 'count':
                            case 'sum':
                            case 'min':
                            case 'max':
                                boldValue = aggregates[fieldName];
                                break;

                        }
                    });
                    if (boldValue !== undefined) {
                        bold.set(fieldName, boldValue, true);
                    }

                });

                var enums = me.enums;

                Ext.Object.each(enums, function(enumField, group) {
                    bold.set(enumField, group, true);
                });
                var plains = me.plains;

                Ext.Object.each(plains, function(plainField, group) {
                    if (group.length > 1) {
                        bold.set(plainField, group, true);
                    }
                })
            } else if (hydrating) {
                var hydrateData = hydrateConfig.data,
                    lookupStores = hydrateConfig.stores,
                    dao = me.dao;

                Ext.Object.each(lookupStores, function(alias, lookupConfig) {
                    var store = dao ? dao.getLookupStore(alias) : Ext.getStore(alias),
                        keys = lookupConfig.keys,
                        lookupRecord = null;

                    if (store == null) {
                        console.warn('"%s" store taking part in model hydration. Looks like store does not loaded at this time, hydration can be wrong', alias);
                        return;
                    }

                    store.each(function(record) {
                        var found = true;
                        Ext.Object.each(keys, function(key, lookupKey) {
                            lookupKey = lookupKey || key;

                            if (record.get(lookupKey) != bold.get(key)) {
                                found = false;
                            }
                            return found;
                        });
                        if (found) {
                            lookupRecord = record;
                        }
                        return !lookupRecord;
                    });

                    if (lookupRecord) {
                        var mapping = lookupConfig.mapping;
                        Ext.Object.each(mapping, function(hydrateField) {
                            hydrateData[hydrateField] = lookupRecord.get(hydrateField);
                        });
                    }
                });

                Ext.Object.each(hydrateData, function(dataField, hydrateValue) {

                    if (hydrateValue === undefined) {
                        var fieldClass = determineFieldClass(dataField);

                        hydrateValue = hydrateField(dataField, fieldClass);
                        hydrateData[dataField] = hydrateValue;
                    }
                });
            }


            function determineFieldClass(dataField) {
                var ret = null;
                Ext.each(['bold', 'sum', 'count', 'others', 'totalCount'], function(type) {
                    var definitions = hydrateConfig[type];

                    Ext.each(definitions, function(definition) {
                        if (Ext.isObject(definition)) {
                            ret = dataField in definition;
                        } else {
                            ret = definition == dataField;
                        }
                        return !ret;
                    });

                    if (ret) {
                        ret = type;
                    }
                    return !ret;
                });
                return ret;
            }


            function hydrateField(dataField, fieldClass) {
                var fieldValue = undefined;
                switch (fieldClass) {
                    case 'bold':
                        var bold = me.bold;
                        fieldValue = bold ? bold.get(dataField) : undefined;
                        if (fieldValue === undefined) {
                        }
                        break;

                    case 'sum':
                        var aggregates = me.aggregates;
                        fieldValue = aggregates[dataField];
                        break;

                    case 'totalCount':
                        break;
                    case 'others':
                        var definitions = hydrateConfig[fieldClass];
                        var hashes = me.hashes;
                        Ext.each(definitions, function(definition) {
                            Ext.Object.each(definition, function(countField, countGroup) {
                                if (countField == dataField) {
                                    var hash = hashes[countGroup];
                                    fieldValue = Ext.Object.getSize(hash);
                                    return false;
                                }
                            });
                            return fieldValue === undefined;
                        });
                        break;
                }
                return fieldValue;
            }
        },

        /**
         *
         */
        commitGroup: function() {
            var me = this,
                bold = me.bold;

            if (!bold) {
                bold = me.bold = new me.Model();
            }

            var i = 0,
                toDelete = me.toDelete,
                index = Ext.Array.indexOf(toDelete, bold);

            me.beforeGroupCommit();

            if (index >= 0) {
                toDelete.splice(index, 1);
            }
        },


        /**
         *
         * @param hashGroup
         * @returns {number}
         */
        // private
        getGroupCount: function(hashGroup) {
            var count = 0;
            Ext.Object.each(hashGroup, function() {
                count++;
            });
            return count;
        },


        /**
         *
         * @returns {string}
         */
        // private
        getHash: function() {
            var args = arguments,
                i = 0, ln = args.length,
                ret = '', arg,
                hashDivider = '|';

            for (; i < ln; i++) {
                arg = args[i];
                if (ret.length > 0) {
                    ret += hashDivider;
                }
                ret += arg;
            }
            return ret;
        },


        // private
        /**
         * Add a new element to the group
         *
         * @param map
         * @param obj
         * @returns {boolean} true if was just added, false if *hash* of the #obj is already added
         */
        put: function(map, obj) {
            var me = this,
                args = [],
                hash;

            Ext.Object.each(obj, function(p) {
                var v = obj[p];
                args.push(v);
            });

            hash = me.getHash(args);
            var exists = map[hash];
            if (!exists) {
                map[hash] = true;
            }
            return !exists;
        },

        /**
         *
         * @param cur
         */
        checkPreference: function(cur) {
            var me = this,
                preferences = me.preferences,
                ret;

            Ext.each(preferences, function(fieldName) {
                ret = me.preferencePlainProperty(fieldName, cur);
                return ret === undefined;
            });

            if (ret === undefined) {
                //indifference
                ret = cur;
            }

            me.bold = ret;
        },


        /**
         *
         * @param prop
         * @param cur
         * @returns {*}
         */
        // private
        preferencePlainProperty: function(prop, cur) {
            var me = this,
                bold = me.bold,
                boldVal = bold ? bold.get(prop) : null,
                curVal = cur.get(prop);

            if (curVal === undefined || boldVal === undefined || (curVal == null && boldVal == null)) {
                return undefined;
            }

            if ((curVal == null) || (boldVal > curVal)) {
                return bold;
            } else if ((boldVal == null) || (boldVal < curVal)) {
                return cur;
            } else {
                return undefined;
            }

        },


        // callback
        finishClientGrouping: function() {

        },


        /**
         *
         * @param store
         */
        finalize: function(store) {
            var me = this,
                toDelete = me.toDelete,
                softDelete = me.softDelete;

            if (toDelete && toDelete.length && store) {
                var totalCount = store.getTotalCount(),
                    removeCount = toDelete.length;

                store.setTotalCount(totalCount - removeCount);
                if (!softDelete) {
                    store.remove(toDelete);
                } else {
                    store.suspendEvents();
                    Ext.each(toDelete, function(record) {
                        record.set(softDelete, true, true);
                    });
                    store.resumeEvents(true);

                    var filters = store.getFilters();
                    if (!Workflow.isEmpty(filters)) {
                        store.filter();
                    }
                }

            }
            Ext.callback(me.callback, me.scope, [store]);
        }
    };

    Ext.apply(grouperProto, config);
});
