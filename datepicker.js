﻿'use strict';

define(['moment', 'ng-jedi-utilities', 'angular-ngMask', 'bootstrap-datetimepicker'], function () {

    angular.module('jedi.layout.datepicker', ['jedi.utilities', 'ngMask']).constant('jedi.layout.datepicker.DatepickerConfig', {
        template: '<div class="input-group date">' +
			      '	<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>' +
			      '</div>'
    }).directive('jdDatepicker', ['$compile', '$timeout', 'jedi.utilities.Utilities', '$log', 'jedi.layout.datepicker.DatepickerConfig', function ($compile, $timeout, utilities, $log, DatepickerConfig) {
        return {
            restrict: 'A',
            require: '?^ngModel',
            link: function (scope, element, attrs, ngModel) {
                var datepickerAttr = attrs.jdDatepicker;

                if (!ngModel) {
                    $log.error('A diretiva Datepicker necessita de um ngModel. Diretiva não carregada.');
                    return false;
                }

                var dateWrap = utilities.wrapElement(element, DatepickerConfig.template, true);

                var options = {
                    showTodayButton: true,
                    showClear: true,
                    showClose: true,
                    useStrict: true,
                    keepInvalid: true
                }

                var format;

                if ((datepickerAttr) == "date-time") {
                    options['format'] = 'L LT';
                    format = moment.localeData().longDateFormat("L") + " " + moment.localeData().longDateFormat("LT");
                    options['useCurrent'] = 'minute';
                } else if ((datepickerAttr) == "time") {
                    options['format'] = 'LT';
                    format = moment.localeData().longDateFormat("LT");
                    options['useCurrent'] = 'minute';
                } else if ((datepickerAttr == "") || (datepickerAttr == "date")) {
                    options['format'] = 'L';
                    format = moment.localeData().longDateFormat("L");
                    options['useCurrent'] = 'day';
                } else {
                    format = datepickerAttr;
                    options['format'] = format;
                    options['useCurrent'] = 'minute';
                }

                // Para o ng-mask. Campos devem ser obrigatoriamente 'padded' (e.g. 02 ao invés de 2).
                var mask = format.replace(/DD/, '39').replace(/MM/, '19').replace(/YYYY/i, '2999').replace(/yy/i, '99').replace(/hh/i, '29').replace(/mm/, '59').replace(/ss/, '59');

                //placeholder usa o format
                element.attr('placeholder', format.toLowerCase());
                element.attr('mask', mask);

                //ng-mask requer uso do $compile
                element.removeAttr('jd-datepicker');
                $compile(element)(scope);

                dateWrap.datetimepicker(options);

                dateWrap.on('dp.change', function (e) {
                    var dateValue = moment(e.date, format, true);
                    if (!dateValue.isValid()) {
                        scope.$eval(attrs.ngModel + "=value", { value: null }); //retorna null caso a data sejá inválida
                    } else {
                        scope.$eval(attrs.ngModel + "=value", { value: dateValue.toDate() });
                    }
                });

                // para compatibilidade do datepicker com o ngMask
                ngModel.$options = {
                    updateOn: 'blur',
                    allowInvalid: true
                };

                var parseDate = function (viewValue) {
                    if (!viewValue) {
                        ngModel.$setValidity('datepicker', true);
                        ngModel.$setValidity('mask', true);
                        $timeout(function () {
                            ngModel.$setPristine();
                        }, 0, false);
                        return viewValue;
                    } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
                        ngModel.$setValidity('datepicker', true);
                        ngModel.$setValidity('mask', true);
                        return viewValue;
                    } else if (angular.isString(viewValue)) {
                        var date = moment(viewValue, format, true);
                        if (!(date.isValid())) {
                            ngModel.$setValidity('datepicker', false);
                            return undefined;
                        } else {
                            ngModel.$setValidity('datepicker', true);
                            ngModel.$setValidity('mask', true);
                            setView();
                            return date.toDate();
                        }
                    } else {
                        ngModel.$setValidity('datepicker', false);
                        return undefined;
                    }
                }
                ngModel.$parsers.push(parseDate);

                var setView = function () {
                    if (ngModel.$modelValue) {

                        if (ngModel.$modelValue == "Invalid Date") {
                            ngModel.$modelValue = '';
                        }

                        if (ngModel.$modelValue != ngModel.$viewValue) { // Por incompatibilidade do Ng-mask o user pode digitar um digito a mais, 
                            ngModel.$viewValue = ngModel.$modelValue;    // atrapalhando o viewValue, porem sem atrapalhar o modelValue, isso corrige
                        }

                        var date

                        if ((ngModel.$modelValue instanceof Date) && (!isNaN(ngModel.$modelValue))) {
                            date = moment(ngModel.$modelValue)
                        } else {
                            date = moment(ngModel.$modelValue, format, true);
                        }

                        if (!date.isValid()) {
                            if (ngModel.$viewValue != element.val()) {
                                ngModel.$viewValue = element.val();
                            }
                            date = ngModel.$viewValue;
                            setTimeout(function () {
                                element.val(date);
                            }, 1);

                        } else {
                            setTimeout(function () {
                                element.val(date.format(format));
                            }, 1);
                        }
                    } else if (element.val() != "") {
                        ngModel.$modelValue = element.val();
                        ngModel.$viewValue = element.val();
                    } else {
                        ngModel.$viewValue = "";
                        setTimeout(function () {
                            element.val(ngModel.$viewValue);
                        }, 1);
                        ngModel.$setValidity('datepicker', true);
                        ngModel.$setValidity('mask', true);
                    }
                };
                ngModel.$render = setView;
                element.on('blur', setView);
                
                //Seta min e max date para o Datepicker - possibilita que dois datepickers sejam usados linkados um ao outro
                if (attrs.jdMinDate) {
                    scope.$watch(attrs.jdMinDate, function (newValue, oldValue) {
                        var dt;

                        if ((scope.$eval(attrs.jdMinDate)) instanceof Date) {
                            dt = moment(scope.$eval(attrs.jdMinDate));
                        } else {
                            dt = moment(scope.$eval(attrs.jdMinDate), format, true);
                        }

                        if (dt.isValid()) {
                            dateWrap.data("DateTimePicker").minDate(dt);
                        } else {
                            if (dateWrap.data("DateTimePicker").minDate() != false) {
                                dateWrap.data("DateTimePicker").minDate(false);
                            }
                        }
                    });
                }

                if (attrs.jdMaxDate) {
                    scope.$watch(attrs.jdMaxDate, function (newValue, oldValue) {
                        var dt;

                        if ((scope.$eval(attrs.jdMaxDate)) instanceof Date) {
                            dt = moment(scope.$eval(attrs.jdMaxDate));
                        } else {
                            dt = moment(scope.$eval(attrs.jdMaxDate), format, true);
                        }

                        if (dt.isValid()) {
                            dateWrap.data("DateTimePicker").maxDate(dt);
                        } else {
                            if (dateWrap.data("DateTimePicker").maxDate() != false) {
                                dateWrap.data("DateTimePicker").maxDate(false);
                            }
                        }
                    });
                }

                //Implementado para prevenir que o datepicker sobreponha o menu. 
                dateWrap.on('dp.show', function (e) {
                    var widget = $(e.currentTarget).children("div.bootstrap-datetimepicker-widget");
                    var panel = widget.parents('.form-group').parent();
                    if (widget.length > 0 && panel.length > 0) {
                        //Testa se o widget está acima do inicio do painel principal da tela
                        if (widget.offset().top < panel.offset().top) {
                            widget.removeClass('top');
                            widget.addClass('bottom');
                            widget.attr('style', 'display: block; top: 26px; bottom: auto; left: 0px; right: auto;');
                        }
                    }
                });
            }
        };
    }]);

});