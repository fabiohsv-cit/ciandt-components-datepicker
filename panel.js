'use strict';

define(['ciandt-components-utilities'], function () {

    angular.module('ciandt.components.layout.panel', ['ciandt.components.utilities']).constant('ciandt.components.layout.panel.PanelConfig', {
        defaultElementClass: 'panel-body form-horizontal',
        defaultFormClass: 'form-validation',
        wrapSizeTpl: '<div class="col-lg-{{appPanel}}"></div>',
        containerFilter: '.content-container',
        useBoxedPage: true,
        boxedPageTpl: '<div class="page"></div>',
        bodyTpl: '<section class="panel panel-default"></section>',
        headerTpl: '<div class="panel-heading">' +
                   '  <strong><span class="glyphicon glyphicon-th"></span>{{appTitle}}</strong>' +
                   '</div>'
    }).directive('appPanel', ['ciandt.components.utilities.Utilities', 'ciandt.components.layout.panel.PanelConfig', '$interpolate', function (utilities, PanelConfig, $interpolate) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                // centralizar painel, usar classes: col-md-8 col-md-offset-2
                element.addClass(PanelConfig.defaultElementClass);

                if (element.is('form')) {
                    element.addClass(PanelConfig.defaultFormClass);
                    if (!attrs.name && attrs.appTitle) {
                        element.attr('name', attrs.appTitle);
                    }
                    if (angular.isUndefined(attrs.novalidate)) {
                        element.attr('novalidate', '');
                    }
                }

                var wrapper = utilities.wrapElement(element, $interpolate(PanelConfig.bodyTpl)(angular.extend({}, attrs, scope)));

                if (attrs.appTitle) {
                    wrapper.prepend($interpolate(PanelConfig.headerTpl)(angular.extend({}, attrs, scope)));
                }

                if (attrs.appPanel) {
                    // define painel menor que o padrão 100%
                    utilities.wrapElement(wrapper, $interpolate(PanelConfig.wrapSizeTpl)(angular.extend({}, attrs, scope)));
                } else
                if (PanelConfig.useBoxedPage && wrapper.parent().is(PanelConfig.containerFilter)) {
                    // cria div page caso o parent seja o container
                    utilities.wrapElement(wrapper, $interpolate(PanelConfig.boxedPageTpl)(angular.extend({}, attrs, scope)));
                }
            }
        }
    }]);

});