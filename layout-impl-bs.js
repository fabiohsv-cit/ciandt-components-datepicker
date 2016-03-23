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
    });

}));