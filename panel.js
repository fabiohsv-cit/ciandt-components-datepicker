'use strict';

define(['ng-jedi-utilities'], function () {

    angular.module('jedi.layout.panel', ['jedi.utilities']).constant('jedi.layout.panel.PanelConfig', {
        defaultElementClass: 'panel-body form-horizontal',
        defaultFormClass: 'form-validation',
        wrapSizeTpl: '<div class="col-lg-{{jdPanel}}"></div>',
        containerFilter: '.content-container',
        useBoxedPage: true,
        boxedPageTpl: '<div class="page"></div>',
        bodyTpl: '<section class="panel panel-default"></section>',
        headerTpl: '<div class="panel-heading">' +
                   '  <strong>{{jdIcon}}<jd-i18n>{{jdTitle}}</jd-i18n></strong>' +
                   '</div>',
        iconTpl: '<span class="glyphicon {{jdTitleIcon}}"></span>'
    }).directive('jdPanel', ['jedi.utilities.Utilities', 'jedi.layout.panel.PanelConfig', '$interpolate', '$compile', function (utilities, PanelConfig, $interpolate, $compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                // centralizar painel, usar classes: col-md-8 col-md-offset-2
                element.addClass(PanelConfig.defaultElementClass);

                if (element.is('form')) {
                    element.addClass(PanelConfig.defaultFormClass);
                    if (!attrs.name && attrs.jdTitle) {
                        element.attr('name', attrs.jdTitle);
                    }
                    if (angular.isUndefined(attrs.novalidate)) {
                        element.attr('novalidate', '');
                    }
                }

                var wrapper = utilities.wrapElement(element, $interpolate(PanelConfig.bodyTpl)(angular.extend({}, attrs, scope)));

                if (typeof attrs.jdToggle != 'undefined') {
                    attrs.jdTitleIcon = attrs.jdToggle.toLowerCase().trim() == 'false' ? 'glyphicon-chevron-right' : 'glyphicon-chevron-down';
                }

                if (!attrs.jdTitleIcon) {
                    attrs.jdTitleIcon = 'glyphicon-th';
                }

                attrs.jdIcon = $interpolate(PanelConfig.iconTpl)(angular.extend({}, attrs, scope));

                if (attrs.jdTitle) {
                    wrapper.prepend($interpolate(PanelConfig.headerTpl)(angular.extend({}, attrs, scope)));
                }

                if (attrs.jdPanel) {
                    // define painel menor que o padrão 100%
                    utilities.wrapElement(wrapper, $interpolate(PanelConfig.wrapSizeTpl)(angular.extend({}, attrs, scope)));
                } else
                if (PanelConfig.useBoxedPage && wrapper.parent().is(PanelConfig.containerFilter)) {
                    // cria div page caso o parent seja o container
                    utilities.wrapElement(wrapper, $interpolate(PanelConfig.boxedPageTpl)(angular.extend({}, attrs, scope)));
                }

                var i18n = element.parents('.panel:first').find('.panel-heading jd-i18n,.panel-heading [jd-i18n]');
                if (i18n.length > 0) {
                    $compile(i18n)(scope);
                }

                if (typeof attrs.jdToggle != 'undefined') {
                    element.parents('.panel:first').find('.panel-heading *').addClass('toggleable').click(function(e) {
                        var $target = jQuery(e.target).parents('.panel-heading').find('.glyphicon');
                        if (element.toggle().is(':visible')) {
                            $target.removeClass('glyphicon-chevron-right');
                            $target.addClass('glyphicon-chevron-down');
                        } else {
                            $target.removeClass('glyphicon-chevron-down');
                            $target.addClass('glyphicon-chevron-right');
                        }
                        e.stopPropagation();
                        return false;
                    });

                    if (attrs.jdToggle.toLowerCase().trim() == 'false') {
                        element.hide();
                    }
                }
            }
        }
    }]);

});