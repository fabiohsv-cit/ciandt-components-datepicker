    angular.module('jedi.layout.datepicker', ['jedi.utilities', 'ngMask']).constant('jedi.layout.datepicker.DatepickerConfig', {
        template: '<div class="input-group date">' +
        '   <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>' +
        '</div>',

        mask: function ($scope, $element, $attrs, MaskService, ngMaskConfig, $timeout, controller) {
            var _mask = $attrs.mask;
            var maskService = MaskService.create();
            var promise;

            promise = maskService.generateRegex({
                mask: $attrs.mask,
                // repeat mask expression n times
                repeat: undefined,
                // clean model value - without divisors
                clean: false,
                // limit length based on mask length
                limit: true,
                // how to act with a wrong value
                restrict: 'reject', //select, reject, accept
                // set validity mask
                validate: true,
                // default model value
                model: $attrs.ngModel,
                // default input value
                value: undefined
            });

            promise.then(function () {
                // get initial options
                var timeout;
                var options = maskService.getOptions();

                function parseViewValue(value) {
                    // set default value equal 0
                    value = value || '';

                    // para o caso do datepicker onde value é um Date e não uma string
                    if (value instanceof Date) {
                        return value;
                    }

                    // get view value object
                    var viewValue = maskService.getViewValue(value);

                    // get mask without question marks
                    var maskWithoutOptionals = options['maskWithoutOptionals'] || '';

                    // get view values capped
                    // used on view
                    var viewValueWithDivisors = viewValue.withDivisors(true);
                    // used on model
                    var viewValueWithoutDivisors = viewValue.withoutDivisors(true);

                    try {
                        // get current regex
                        var regex = maskService.getRegex(viewValueWithDivisors.length - 1);
                        var fullRegex = maskService.getRegex(maskWithoutOptionals.length - 1);

                        // current position is valid
                        var validCurrentPosition = regex.test(viewValueWithDivisors) || fullRegex.test(viewValueWithDivisors);

                        if (!validCurrentPosition) {
                            viewValue = maskService.removeWrongPositions(viewValueWithDivisors);
                            viewValueWithDivisors = viewValue.withDivisors(true);
                            viewValueWithoutDivisors = viewValue.withoutDivisors(true);
                        }

                        // Set validity
                        if (controller.$dirty) {
                            if (fullRegex.test(viewValueWithDivisors) || controller.$isEmpty(controller.$modelValue)) {
                                controller.$setValidity('mask', true);
                            } else {
                                controller.$setValidity('mask', false);
                            }
                        }
                        // Update view and model values
                        if (value !== viewValueWithDivisors) {
                            controller.$setViewValue(angular.copy(viewValueWithDivisors), 'input');
                            controller.$render();
                        }
                    } catch (e) {
                        $log.error('[mask - parseViewValue]');
                        throw e;
                    }
                    return viewValueWithDivisors;
                }
                var containParser = false;
                angular.forEach(controller.$parsers, function (parser) {
                    if (parser == parseViewValue.toString()) {
                        containParser = true;
                    }
                });

                if (!containParser) {
                    controller.$parsers.push(parseViewValue);
                }

                var inputHandler = function () {
                    timeout = $timeout(function () {
                        // Manual debounce to prevent multiple execution
                        $timeout.cancel(timeout);
                        parseViewValue($element.val());
                        $scope.$apply();
                    }, 100);
                };

                $element.on('click.dtMask input.dtMask paste.dtMask keyup.dtMask', inputHandler);

                // Register the watch to observe remote loading or promised data
                // Deregister calling returned function
                var watcher = $scope.$watch($attrs.ngModel, function (newValue, oldValue) {
                    if (angular.isDefined(newValue)) {
                        parseViewValue(newValue);
                        watcher();
                    }
                });
            });

            return function () {
                $element.off('.dtMask');
                _mask = null;
                maskService = null;
            };
        }
    }).directive('jdDatepicker', ['$compile', '$timeout', 'MaskService', 'ngMaskConfig', 'jedi.utilities.Utilities', '$log', 'jedi.layout.datepicker.DatepickerConfig', 'jedi.layout.impl.Datepicker', function ($compile, $timeout, MaskService, ngMaskConfig, utilities, $log, DatepickerConfig, Datepicker) {
        return {
            restrict: 'A',
            require: '^ngModel',
            link: function (scope, element, attrs, ngModel) {
                if (!element.is("input")) {
                    return false;
                }
                Datepicker.link(scope, element, attrs, ngModel, moment, $compile, $timeout, MaskService, ngMaskConfig, utilities, $log);
            }
        };
    }]);