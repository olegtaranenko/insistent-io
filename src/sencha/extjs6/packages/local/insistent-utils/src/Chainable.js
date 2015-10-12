/**
 *   This class borrows base idea from {@link Ext.mixin.Mixin} to extend functionality of mixed classes.
 *   In both is used function overriding, see more {@link Class.override}. If function in mixed (host) Class is overridden,
 *   it is still accessible in the closure. This trick is been exploited to create of different combination both mixin and mixed
 *   function execution.
 *   For example, more interesting case if subsequent execution first host function (with return) then executing mixin
 *   function.
 *
 *   This is pretty similar to useful construction like
 *          function bar() {
 *              var me = this,
 *                  ret = me.callParent(arguments),
 *
 *              // more action
 *              return ret;
 *          }
 *   but there is calling mixin function rather than base overridden function from parent class.
 *
 */
Ext.define('InsistentUtils.Chainable', {
    requires: [
        'InsistentUtils.WorkflowHelper'
    ],

    config: {
        hostResults: null
    },


    /**
     * For proper communication with mixin and first host request of overloaded function
     *
     * @param {Arguments|String} fnName
     * @returns {String} propertyName
     */
    $buildResultProperty: function(fnName) {
        if (Object.prototype.toString.call(fnName) == '[object Arguments]') {
            fnName = fnName.callee.$name;
        }
        return fnName;
    },


    $queryHostResults: function(argsObject) {
        var me = this,
            resultObj = this.getHostResults();

        if (!resultObj) {
            // try the simplest implementation, whether it will work...
            resultObj = {};
            me.setHostResults(resultObj);
        }

        return resultObj;
    },


    $pullHostResult: function() {
        var me = this,
            resultObj = me.$queryHostResults(arguments),
            resultProperty = me.$buildResultProperty.apply(me, arguments);

//  <debug>
        if (resultProperty == 'validateFn') {
            console.debug('%s#$pullHostResult() for "validateFn": %s', this.$className, resultObj[resultProperty], resultObj);
        }
//  </debug>

        return resultObj[resultProperty];
    },


    $pushHostResult: function(value, fnName) {
        var me = this,
            args = Array.prototype.slice.call(arguments, 1),
            resultObj = me.$queryHostResults(args),
            resultProperty = me.$buildResultProperty.apply(me, args);
//  <debug>
        if (resultProperty == 'validateFn') {
            console.debug('%s#$pushHostResult(%s) for "validateFn"', this.$className, value, resultObj);
        }
//  </debug>
        resultObj[resultProperty] = value;
    },


    $truncateMethodResult: function(methodName) {
        var me = this,
            resultProperty;

        if (Ext.isString(methodName)) {
            resultProperty = methodName;
        } else {
            resultProperty = me.$buildResultProperty.apply(me, arguments);
        }

        if (resultProperty) {
            me.$truncateHostResults([resultProperty]);
        }
    },


    $truncateHostResults: function(mixinMethodQualifiers) {
        var resultObj = this.getHostResults(),
            argsLen = arguments.length;

//  <debug>
        if (mixinMethodQualifiers) {
//             console.debug('%s#$truncateHostResults(%s)', this.$className, mixinMethodQualifiers, resultObj);
        }
//  </debug>

        if (resultObj) {
            var len = mixinMethodQualifiers && mixinMethodQualifiers.length;

            if (len) {
                for (var i = 0; i < len; i++) {
                    var methodName = mixinMethodQualifiers[i];

                    delete resultObj[methodName];
                }
            } else {
                Ext.Object.each(resultObj, function(methodName) {
                    delete resultObj[methodName];
                })
            }
        }
    },


    onClassExtended: function(cls, data) {
        var mixinConfig = data.mixinConfig,
            chainableConfig = data.chainableConfig || {},
            parentClassMixinConfig = cls.superclass.mixinConfig,
            parentChainableConfig = cls.superclass.chainableConfig;

        if (chainableConfig || parentChainableConfig) {
            if (parentChainableConfig) {
                chainableConfig = Ext.merge({}, parentChainableConfig, chainableConfig);
            }

            if (!data.chainableConfig) {
                data.chainableConfig = chainableConfig;
            }
        }

        if (mixinConfig || parentClassMixinConfig) {
            if (parentClassMixinConfig) {
                mixinConfig = data.mixinConfig = Ext.merge({}, parentClassMixinConfig, mixinConfig);
            }

            data.mixinId = mixinConfig.id;

            /*
             interceptBefore = Sencha METHOD OF EXT.FUNCTION()...
             Adds behavior to an existing method that is executed before the original behavior of the function.
             */
            Ext.Function.interceptBefore(data, 'onClassMixedIn', function(targetClass) {
                var mixin = this.prototype;

                if (!Workflow.isEmpty(chainableConfig)) {
                    targetClass.addConfig(chainableConfig, true);
                }

                // First executes class function with return, then put return value as first argument & call mixin function with return
                // No preventable logic, as it done in {@link Ext.mixin.Mixin}
                if ('returnAfter' in mixinConfig) {
                    Ext.Object.each(mixinConfig.returnAfter, function(from, to) {
                        if (to === true) {
                            to = from;
                        }
                        var prev = this[to];
                        if (prev == null) {
                            prev = this[to] = function() {};
                            prev.$results = {};
                        }
                        targetClass.override(to, function() {
                            var callOverriddenFn = this.callOverridden || this.prototype.callOverridden,
                                fromFn = mixin[from] || mixin.self[from],
                                ret = this.$pullHostResult(to);

                            if (ret === undefined) {
                                ret = callOverriddenFn ? callOverriddenFn.call(this, arguments) : undefined;
                                this.$pushHostResult(ret, to);
                            }

                            if (fromFn) {
                                return fromFn.apply(this, arguments);
                            } else {
                                return ret;
                            }
                        });
                    }, targetClass);
                }

                // First executes mixin function with return, then calls class function with return
                // Signature of mixin function is same as class one.
                // No preventable logic (as it done in {@link Ext.mixin.Mixin}
                // If class function is defined overall return is from this function, return of first (mixin function) call is dismissed.
                if ('returnBefore' in mixinConfig) {
                    Ext.Object.each(mixinConfig.returnBefore, function(from, to) {
                        if (to === true) {
                            to = from;
                        }
                        targetClass.override(to, function() {
                            var callOverriddenFn = this.callOverridden || this.prototype.callOverridden,
                                fromFn = mixin[from] || mixin.self[from],
                                ret = fromFn ? fromFn.apply(this, arguments) : undefined;

                            if (callOverriddenFn) {
                                var retMain = callOverriddenFn.call(this, arguments);

                                if (retMain != undefined) {
                                    ret = retMain;
                                }
                            }

                            return ret;
                        });
                    });
                }

                // call to class function, then mixin one.
                // No return
                if ('voidAfter' in mixinConfig) {
                    Ext.Object.each(mixinConfig.voidAfter, function(from, to) {
                        if (to === true) {
                            to = from;
                        }
                        targetClass.override(to, function() {
                            var callOverriddenFn = this.callOverridden || this.prototype.callOverridden,
                                fromFn = mixin[from] || mixin.self[from];

                            if (callOverriddenFn) {
                                callOverriddenFn.call(this, arguments);
                            }
                            if (fromFn) {
                                fromFn.apply(this, arguments);
                            }
                        });
                    });
                }

                // call to mixin function, then class one.
                // No return
                if ('voidBefore' in mixinConfig) {
                    Ext.Object.each(mixinConfig.voidBefore, function(from, to) {
                        if (to === true) {
                            to = from;
                        }
                        targetClass.override(to, function() {
                            var callOverriddenFn = this.callOverridden || this.prototype.callOverridden,
                                fromFn = mixin[from] || mixin.self[from];

                            if (fromFn) {
                                fromFn.apply(this, arguments);
                            }
                            if (callOverriddenFn) {
                                callOverriddenFn.call(this, arguments);
                            }
                        });
                    });
                }

                // just call mixin function (with or without return), no call to class function
                if ('returnMixin' in mixinConfig) {
                    Ext.Object.each(mixinConfig.returnMixin, function(from, to) {
                        if (to === true) {
                            to = from;
                        }
                        targetClass.override(to, function() {
                            var classFn = (this[to] || this.self[to]).$previous,
                                mixinFn = mixin[from] || mixin.self[from];

                            if (classFn) {
                                // Keep function itself, not result.
                                // Mixin method can call it if requires.
                                this.$pushHostResult(classFn, from);
                            }
                            return mixinFn.apply(this, arguments);
                        });
                    });
                }

                // call to class function then call to mixin one (with or without return)
                // returns (if any) class result, if it is undefined, returns mixin result
                if ('returnClass' in mixinConfig) {
                    Ext.Object.each(mixinConfig.returnClass, function(from, to) {
                        if (to === true) {
                            to = from;
                        }
                        targetClass.override(to, function() {
                            var callOverriddenFn = this.callOverridden || this.prototype.callOverridden,
                                fromFn = mixin[from] || mixin.self[from],
                                ret, mixinRet;

                            if (fromFn) {
                                ret = fromFn.apply(this, arguments);
                            }
                            if (callOverriddenFn) {
                                mixinRet = callOverriddenFn.call(this, arguments);
                            }

                            if (ret === undefined) {
                                ret = mixinRet;
                            }
                            return ret;
                        });
                    });
                }

            });
        }
    }
});
