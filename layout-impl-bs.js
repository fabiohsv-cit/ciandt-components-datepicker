(function (factory) {
    if (typeof define === 'function') {
        define(['bootstrap-datetimepicker', 'angular-bootstrap'], factory);
    } else {
        if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
            module.exports = 'jedi.layout.impl';
            require('bootstrap-datetimepicker');
            require('angular-bootstrap');
        }
        return factory();
    }
}(function() {
	"use strict";

    angular.module('jedi.layout.impl', ['ui.bootstrap']).constant('jedi.layout.impl.Input', {
        elementClass: 'form-control',
        templates: {
            singleInput: '<div class="col-xs-{{jdXsSize}} col-sm-{{jdSmSize}} col-md-{{jdMdSize}} col-lg-{{jdLgSize}} jd-{{type}}">'+
                         '    <div class="form-group">'+
                         '         <label ng-if="showLabel" for="{{id}}" class="col-xs-{{jdXsLabelSize}} col-sm-{{jdSmLabelSize}} col-md-{{jdMdLabelSize}} col-lg-{{jdLgLabelSize}} {{jdLabelClass}} control-label"><jd-i18n>{{jdLabel}}</jd-i18n>{{showRequired}}</label>'+
                         '         <div class="col-xs-{{jdXsInputSize}} col-sm-{{jdSmInputSize}} col-md-{{jdMdInputSize}} col-lg-{{jdLgInputSize}} {{jdInputClass}}">'+
                         '            <ng-transclude></ng-transclude>'+
                         '            <small class="help-block" ng-if="showHelp" jd-i18n>{{jdHelp}}</small>'+
                         '         </div>'+
                         '    </div>'+
                         '</div>',
            multipleInput: '<div class="col-xs-{{jdXsSize}} col-sm-{{jdSmSize}} col-md-{{jdMdSize}} col-lg-{{jdLgSize}} jd-multi-{{type}}">'+
                           '    <div class="form-group">'+
                           '        <label ng-if="showLabel" class="col-xs-{{jdXsLabelSize}} col-sm-{{jdSmLabelSize}} col-md-{{jdMdLabelSize}} col-lg-{{jdLgLabelSize}} {{jdLabelClass}} control-label"><jd-i18n>{{jdGrouplabel}}</jd-i18n>{{showRequired}}</label>'+
                           '        <div class="col-xs-{{jdXsInputSize}} col-sm-{{jdSmInputSize}} col-md-{{jdMdInputSize}} col-lg-{{jdLgInputSize}} {{jdInputClass}}">'+
                           '            <label class="{{type}}-inline" ng-repeat>'+
                           '                <ng-transclude></ng-transclude>{{jdLabel}}'+
                           '            </label>'+
                           '            <small class="help-block" ng-if="showHelp" jd-i18n>{{jdHelp}}</small>'+
                           '        </div>'+
                           '    </div>'+
                           '</div>',
            oneInput: '<div class="col-xs-{{jdXsSize}} col-sm-{{jdSmSize}} col-md-{{jdMdSize}} col-lg-{{jdLgSize}} jd-{{type}}">'+
                      '    <div class="form-group">'+
                      '        <div class="col-xs-offset-{{jdXsLabelSize}} col-sm-offset-{{jdSmLabelSize}} col-md-offset-{{jdMdLabelSize}} col-lg-offset-{{jdLgLabelSize}} {{jdLabelClass}} col-xs-{{jdXsInputSize}} col-sm-{{jdSmInputSize}} col-md-{{jdMdInputSize}} col-lg-{{jdLgInputSize}} {{jdInputClass}}">'+
                      '            <div class="{{type}}">'+
                      '                <label>'+
                      '                    <ng-transclude></ng-transclude><jd-i18n>{{jdLabel}}</jd-i18n>{{showRequired}}'+
                      '                </label>'+
                      '            </div>'+
                      '            <small class="help-block" ng-if="showHelp" jd-i18n>{{jdHelp}}</small>'+
                      '        </div>'+
                      '    </div>'+
                      '</div>'
        }
    }).constant('jedi.layout.impl.Panel', {
        template: '<div class="{{jdPanel}}" ng-class="{\'jd-panel-disabled\': jdDisabled}">'+
                  '    <section class="panel panel-default">'+
                  '        <div class="panel-heading" ng-show="showTitle">'+
                  '            <strong><span ng-show="showTitleIcon" class="glyphicon {{jdTitleIcon}}"></span><jd-i18n>{{jdTitle}}</jd-i18n></strong>'+
                  '            <div class="pull-right"></div>'+                                                                    
                  '        </div>'+
                  '        <ng-transclude></ng-transclude>'+
                  '    </section>'+
                  '</div>',
        defaultSizeClass: 'col-lg-',
        selectorHeader: '.panel-heading',
        selectorHeaderRight: '.panel-heading-right',
        selectorHeaderPullRight: '.pull-right',
        selectorIcon: '.glyphicon',
        selectorFooter: '.panel-footer',
        defaultElementClass: 'panel-body form-horizontal',
        defaultFormClass: 'form-validation',
        defaultIcon: 'glyphicon-th',
        defaultToggleOpenIcon: 'glyphicon-chevron-right',
        defaultToggleCloseIcon: 'glyphicon-chevron-down',
        defaultBoxedClass: 'page',
        toggleIcon: function(panelContent, $target) {
            if (panelContent.is(':visible')) {
                $target.removeClass(this.defaultToggleOpenIcon);
                $target.addClass(this.defaultToggleCloseIcon);
            } else {
                $target.removeClass(this.defaultToggleCloseIcon);
                $target.addClass(this.defaultToggleOpenIcon);
            }
        }
    }).constant('jedi.layout.impl.ValidationTooltip', {
        open: function(element, message) {
            var _tooltip = element.data('bs.tooltip');
            if (!_tooltip) {
                element.tooltip({ trigger: 'manual', container: 'body' });
            }
            _tooltip = element.data('bs.tooltip');
            if (!_tooltip.tip().hasClass('in') || _tooltip.options.title != message) {
                _tooltip.options.title = message;
                if ((window.innerWidth || document.documentElement.clientWidth) < 995) {
                    _tooltip.options.placement = 'top';
                } else {
                    _tooltip.options.placement = 'right';
                }
                element.tooltip('show');
            }
        },
        close: function(element) {
            var _tooltip = element.data('bs.tooltip');
            if (_tooltip && _tooltip.tip().hasClass('in')) {
                element.tooltip('hide');
            }
        },
        destroy: function(element) {
            var _tooltip = element.data('bs.tooltip');
            if (_tooltip) {
                element.tooltip('destroy');
            }
        }
    }).constant('jedi.layout.impl.Dialogs', {
        alert: '<div jd-modal jd-title="{{alertTitle}}">' +
               '    <ul class="alert-message">' +
               '        <li class="{{ item.type }}" ng-repeat="item in items" jd-i18n>{{ item.message }}</li>' +
               '    </ul>' +
               '    <div class="modal-footer">' +
               '        <button class="btn btn-primary" ng-click="ok()" jd-i18n>{{ alertOkLabel }}</button>' +
               '    </div>' +
               '</div>',
        confirm: '<div jd-modal jd-title="{{confirmTitle}}" jd-hide-close-btn>' +
                 '    <p class="text-info alert-message" jd-i18n>{{message}}</p>' +
                 '    <div class="modal-footer">' +
                 '        <button class="btn btn-primary" ng-click="ok()" jd-i18n>{{ confirmYesLabel }}</button>' +
                 '        <button class="btn btn-primary" jd-dismiss-modal jd-i18n>{{ confirmNoLabel }}</button>' +
                 '    </div>' +
                 '</div>'
    }).constant('jedi.layout.impl.Breadcrumb', {
        template: '<ol class="breadcrumb hidden-xs">'+
                  '    <li class="active" ng-repeat="item in jdBreadcrumb track by $index + item" jd-i18n>{{item}}</li>'+
                  '</ol>'
    }).constant('jedi.layout.impl.Datepicker', {
        link: function(scope, element, attrs, ngModel, moment, $compile, $timeout, MaskService, ngMaskConfig, utilities, $log, DatepickerConfig) {
            var datepickerAttr = attrs.jdDatepicker;
            var options = {
                showTodayButton: true,
                showClear: true,
                showClose: true,
                useStrict: true,
                keepInvalid: true
            };
            var format;
            var maskFormat;
            var mask;
            var dateWrap;

            //Cria o input-group em volta do input
            dateWrap = utilities.wrapElement(element, DatepickerConfig.template, true);

            var setupDp = function setupDp() {
                //setup geral do datepicker
                options.locale = moment.locale();
                if ((datepickerAttr.toLowerCase() === "date-time") || (datepickerAttr.toLowerCase() === "datetime") || (datepickerAttr.toLowerCase() === "date.time")) {
                    options.format = 'L LT';
                    format = moment.localeData(moment.locale()).longDateFormat("L") + " " + moment.localeData().longDateFormat("LT");
                    options.useCurrent = 'minute';
                } else if ((datepickerAttr) === "time") {
                    options.format = 'LT';
                    format = moment.localeData(moment.locale()).longDateFormat("LT");
                    options.useCurrent = 'minute';
                } else if ((datepickerAttr === "") || (datepickerAttr === "date")) {
                    options.format = 'L';
                    format = moment.localeData(moment.locale()).longDateFormat("L");
                    options.useCurrent = 'day';
                } else {
                    format = datepickerAttr;
                    options.format = format;
                    options.useCurrent = 'minute';
                }

                // Para o ng-mask. Campos devem ser obrigatoriamente 'padded' (e.g. 02 ao invés de 2).
                maskFormat = format.replace(/DD/, '39').replace(/MM/, '19').replace(/YYYY/i, '2999').replace(/yy/i, '99').replace(/hh/i, '29').replace(/mm/, '59').replace(/ss/, '59');

                //placeholder usa o format
                element.attr('placeholder', format.toLowerCase());
                attrs.mask = maskFormat;

                //prepara e aplica a mascara de data, chamar mask() destroi a mascara já criada
                if (mask) {
                    mask();
                }
                mask = DatepickerConfig.mask(scope, element, attrs, MaskService, ngMaskConfig, $timeout, ngModel);

                //aplica o datepicker bootstrap
                if (dateWrap.data('DateTimePicker')) {
                    dateWrap.data('DateTimePicker').destroy();
                }
                dateWrap.datetimepicker(options);
                if (ngModel.$modelValue) {
                    element.val(ngModel.$formatters[1](ngModel.$modelValue));
                    dateWrap.data('DateTimePicker').date(ngModel.$modelValue);
                }
            };
            setupDp();


            scope.$on('jedi.i18n.LanguageChanged', setupDp);

            dateWrap.on('dp.change', function dpChange(e) {
                if (!e.date) {
                    ngModel.$setViewValue(null, 'dp.change');
                    return;
                }

                var dateValue;
                if (angular.isDate(e.date) && !isNaN(e.date)) {
                    dateValue = moment(dateValue);
                } else {
                    dateValue = e.date;
                }

                if (moment.isMoment(dateValue) && dateValue.isValid()) {
                    ngModel.$setViewValue(dateValue.format(format), 'dp.change');
                } else { //prever e tratar outros casos
                    $log.debug("data invalida no datepicker");
                }
            });

            ngModel.$parsers.push(function parseDate(viewValue) {
                var parsedValue;
                if (!viewValue) {
                    ngModel.$setValidity('datepicker', true);
                    ngModel.$setValidity('mask', true);
                    parsedValue = viewValue;
                } else if (moment.isMoment(viewValue) && viewValue.isValid()) {
                    ngModel.$setValidity('datepicker', true);
                    ngModel.$setValidity('mask', true);
                    parsedValue = viewValue;
                } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
                    ngModel.$setValidity('datepicker', true);
                    ngModel.$setValidity('mask', true);
                    parsedValue = viewValue;
                } else if (angular.isString(viewValue)) {
                    var date = moment(viewValue, format, true);
                    if (date.isValid()) {
                        ngModel.$setValidity('datepicker', true);
                        ngModel.$setValidity('mask', true);
                        parsedValue = date.toDate();
                    } else {
                        ngModel.$setValidity('datepicker', false);
                        parsedValue = viewValue;
                    }
                } else {
                    ngModel.$setValidity('datepicker', false);
                    parsedValue = viewValue;
                }

                if (parsedValue != dateWrap.data('DateTimePicker').date()) {
                    dateWrap.data('DateTimePicker').date(parsedValue);
                }

                return parsedValue;

            });

            var dateFormatter = function dateFormatter(value) {
                var date;
                if (!value) {
                    return value;
                } else if (moment.isMoment(value) && value.isValid()) {
                    return value.format(format);
                } else if (angular.isDate(value) && !isNaN(value)) {
                    date = moment(value);
                    return date.format(format);
                } else if (angular.isString(value)) {
                    date = moment(value, format, true);
                    if (date.isValid()) {
                        return date.format(format);
                    } else {
                        //Em alguns casos value é uma string de um objeto Date (date.toString()), e o moment não consegue realizar o parse
                        date = new Date(value);
                        var mDate = moment(date);
                        if (mDate.isValid()) {
                            return mDate.format(format);
                        } else {
                            ngModel.$setValidity('datepicker', false);
                            return value;
                        }
                    }
                } else {
                    return value;
                }
            };
            ngModel.$formatters.push(dateFormatter);

            //Seta min e max date para o Datepicker - possibilita que dois datepickers sejam usados linkados um ao outro
            if (attrs.jdMinDate) {
                scope.$watch(attrs.jdMinDate, function watchMinDate() {
                    var dt;

                    if ((scope.$eval(attrs.jdMinDate)) instanceof Date) {
                        dt = moment(scope.$eval(attrs.jdMinDate));
                    } else {
                        dt = moment(scope.$eval(attrs.jdMinDate), format, true);
                    }

                    if (dt.isValid()) {
                        dateWrap.data("DateTimePicker").minDate(dt);
                    } else {
                        if (dateWrap.data("DateTimePicker").minDate() !== false) {
                            dateWrap.data("DateTimePicker").minDate(false);
                        }
                    }
                });
            }

            if (attrs.jdMaxDate) {
                scope.$watch(attrs.jdMaxDate, function watchMaxDate() {
                    var dt;

                    if ((scope.$eval(attrs.jdMaxDate)) instanceof Date) {
                        dt = moment(scope.$eval(attrs.jdMaxDate));
                    } else {
                        dt = moment(scope.$eval(attrs.jdMaxDate), format, true);
                    }

                    if (dt.isValid()) {
                        dateWrap.data("DateTimePicker").maxDate(dt);
                    } else {
                        if (dateWrap.data("DateTimePicker").maxDate() !== false) {
                            dateWrap.data("DateTimePicker").maxDate(false);
                        }
                    }
                });
            }

            //Implementado para prevenir que o datepicker sobreponha o menu. 
            dateWrap.on('dp.show', function dpShowWidget(e) {
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

            // destroy
            // se escopo destruido remove eventos
            scope.$on('$destroy', function dpDestroy() {
                if (dateWrap) {
                    var dtPicker = dateWrap.data('DateTimePicker');
                    if (dtPicker) {
                        dtPicker.destroy();
                    }
                }
            });
            // se input destruido remove wrap
            element.on('$destroy', function elDestroy() {
                if (dateWrap) {
                    var w = dateWrap;
                    dateWrap = null;
                    w.remove();
                }
                scope.$destroy();
            });
        }
    });

}));