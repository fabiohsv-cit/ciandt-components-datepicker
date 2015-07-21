'use strict';

define(['angular'], function () {

    angular.module('ciandt.components.layout.modal', []).constant('ciandt.components.layout.modal.ModalConfig', {
        headerTpl: '<div class="panel-heading modal-header">{{titleTpl}}{{closeBtnTpl}}</div>',
        closeBtnTpl: '<span class="glyphicon glyphicon-remove close"></span>',
        titleTpl: '<strong><span class="glyphicon glyphicon-th"></span><i18n>{{appTitle}}</i18n></strong>',
        defaultBodyClass: 'modal-body form-horizontal',
        defaultFormClass: 'form-validation',
        defaultTableClass: 'table-dynamic'
    }).directive('appModal', ['ciandt.components.layout.modal.ModalConfig', '$interpolate', '$timeout', function (ModalConfig, $interpolate, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.before($interpolate(ModalConfig.headerTpl)(angular.extend({
                    closeBtnTpl: (!attrs.appHideCloseBtn && attrs.appHideCloseBtn != '' ? $interpolate(ModalConfig.closeBtnTpl)(angular.extend({}, attrs, scope)) : undefined),
                    titleTpl: (attrs.appTitle ? $interpolate(ModalConfig.titleTpl)(angular.extend({}, attrs, scope)) : undefined)
                }, attrs, scope)));

                element.addClass(ModalConfig.defaultBodyClass);

                if (element.is('form')) {
                    element.addClass(ModalConfig.defaultFormClass);
                    if (!attrs.name && attrs.appTitle) {
                        element.attr('name', attrs.appTitle);
                    }
                    if (angular.isUndefined(attrs.novalidate)) {
                        element.attr('novalidate', '');
                    }
                    $timeout(function () {
                        // seta foco no primeiro elemento do form
                        jQuery(":input:visible:enabled", element).not('[readonly]').filter(':first').focus();
                    }, 10);
                }

                if (ModalConfig.defaultTableClass) {
                    var table = element.find('table.table');
                    if (table.length > 0 && !element.hasClass(ModalConfig.defaultTableClass)) {
                        element.addClass(ModalConfig.defaultTableClass);
                    }
                }

                element.parent().find('.modal-header span.close,[app-dismiss-modal]').on('click', function () {
                    if (scope.$dismiss) {
                        scope.$dismiss();
                    } else
                        if (scope.$parent.$dismiss) {
                            scope.$parent.$dismiss();
                        }
                    return false;
                });

                var footer = element.find('.modal-footer');
                if (footer.length > 0) {
                    element.after(footer);
                }
            }
        }
    }]);

});