    angular.module('jedi.layout.panel', ['jedi.utilities']).constant('jedi.layout.panel.PanelConfig', {
        defaultPanelHeadingRightClass: 'panel-heading-right',
        templateUrl: 'assets/libs/ng-jedi-layout/panel.html',
        uiImplementations: {
            bootstrap: {
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
            },
            materialize: {
                template: '<div class="{{jdPanel}}" ng-class="{\'jd-panel-disabled\': jdDisabled}">'+
                          '   <div class="card">'+
                          '       <div class="card-content">'+
                          '          <div class="card-title" ng-show="showTitle">'+
                          '             <i ng-show="showTitleIcon" class="material-icons tiny">{{jdTitleIcon}}</i>'+
                          '             <jd-i18n>{{jdTitle}}</jd-i18n>'+
                          '             <div class="right"></div>'+                                                                    
                          '          </div>'+
                          '          <ng-transclude></ng-transclude>'+
                          '       </div>'+
                          '    </div>'+
                          '</div>',
                defaultSizeClass: 'col l',
                selectorHeader: '.card-title',
                selectorHeaderRight: '.panel-heading-right',
                selectorHeaderPullRight: '.right',
                selectorIcon: '.material-icons',
                selectorFooter: '.card-action',
                defaultIcon: 'subtitles',
                defaultToggleOpenIcon: 'call_received',
                defaultToggleCloseIcon: 'call_made',
                toggleIcon: function(panelContent, $target) {
                    if (panelContent.is(':visible')) {
                        $target.removeClass(this.defaultToggleOpenIcon);
                        $target.addClass(this.defaultToggleCloseIcon).text(this.defaultToggleCloseIcon);
                    } else {
                        $target.removeClass(this.defaultToggleCloseIcon);
                        $target.addClass(this.defaultToggleOpenIcon).text(this.defaultToggleOpenIcon);
                    }
                }
            }
        }
    }).run(['$templateCache', 'jedi.layout.panel.PanelConfig', 'jedi.layout.LayoutConfig', function($templateCache, PanelConfig, LayoutConfig) {
        $templateCache.put('assets/libs/ng-jedi-layout/panel.html', PanelConfig.uiImplementations[LayoutConfig.defaultUiImpl].template);
    }]).directive('jdPanel', ['jedi.utilities.Utilities', 'jedi.layout.panel.PanelConfig', '$timeout', '$compile', '$filter', '$templateCache', 'jedi.layout.LayoutConfig', function (utilities, PanelConfig, $timeout, $compile, $filter, $templateCache, LayoutConfig) {
        var uiImpl = PanelConfig.uiImplementations[LayoutConfig.defaultUiImpl];
        return {
            restrict: 'A',
            scope: true,
            controller: function ($scope) {
                $scope.panelHead = null;
                
                $scope.setHeadingRight = function (headingRight) {                 
                    if (headingRight.length > 0) {
                        $scope.panelHead.find(uiImpl.selectorHeaderPullRight).html(headingRight);
                    }   
                }
            },
            compile: function (element, attrs) {
                // centralizar painel, usar classes: col-md-8 col-md-offset-2
                if (uiImpl.defaultElementClass) {
                    element.addClass(uiImpl.defaultElementClass);
                }

                if (element.is('form')) {
                    if (uiImpl.defaultFormClass) {
                        element.addClass(uiImpl.defaultFormClass);
                    }
                    if (!attrs.name && attrs.jdTitle) {
                        element.attr('name', $filter('jdReplaceSpecialChars')(attrs.jdTitle));
                    }
                    if (angular.isUndefined(attrs.novalidate)) {
                        element.attr('novalidate', '');
                    }
                }

                if (attrs.jdPanel != '') {
                    attrs.jdPanel = uiImpl.defaultSizeClass + attrs.jdPanel;
                } else if (element.parents('.jd-panel:first, .jd-modal:first').length == 0 && uiImpl.defaultBoxedClass) {
                    attrs.jdPanel = uiImpl.defaultBoxedClass;
                    element.addClass('jd-panel');
                }

                // se jdTitleIcon definido vazio então fica sem icone
                if (typeof attrs.jdTitleIcon == 'undefined' && uiImpl.defaultIcon) {
                    attrs.jdTitleIcon = uiImpl.defaultIcon;
                }

                if (typeof attrs.jdToggle != 'undefined') {
                    attrs.jdTitleIcon = attrs.jdToggle.toLowerCase().trim() == 'false' ? uiImpl.defaultToggleOpenIcon : uiImpl.defaultToggleCloseIcon;
                }

                return {
                    pre: function (scope, element, attrs) {},
                    post: function (scope, element, attrs) {
                        var template = $templateCache.get(PanelConfig.templateUrl);
                        var wrapper = $(template.replace('ng-transclude', 'transclude'));
                        var panelHead = wrapper.find(uiImpl.selectorHeader);
                        var panelBody = wrapper.find('transclude,[transclude]');
                        // se definido área de transclude, insere antes do element e move o element pro body do transclude
                        if (panelBody.length > 0) {
                            wrapper.insertBefore(element);
                            // cris subscopo para o panel
                            var pScope = scope.$new();
                            pScope = angular.extend(pScope, {
                                showTitle: typeof attrs.jdTitle != 'undefined',
                                showTitleIcon: attrs.jdTitleIcon !== 'false' && attrs.jdTitleIcon !== '',
                                jdPanel: attrs.jdPanel,
                                jdTitleIcon: attrs.jdTitleIcon,
                                jdTitle: attrs.jdTitle,
                                jdToggle: attrs.jdToggle,
                                jdDisabled: scope.$parent.$eval(attrs.jdDisabled)
                            });
                            $compile(wrapper)(pScope);
                            // adiciona body na área de transclude
                            panelBody.append(element);

                            var footer = element.children(uiImpl.selectorFooter);
                            if (footer.length > 0) {
                                element.after(footer);
                            }

                            scope.panelHead = panelHead;
                            scope.setHeadingRight(element.children(uiImpl.selectorHeaderRight));

                            var panelContent = element.add(footer);

                            var toggleElement;

                            if (typeof attrs.jdToggle != 'undefined') {
                                var $target = panelHead.find(uiImpl.selectorIcon);

                                var doneToggling = function doneToggling(changeScope) {
                                    uiImpl.toggleIcon(panelContent, $target);
                                    if (!changeScope && attrs.jdToggle !== "" && attrs.jdToggle !== "true" && attrs.jdToggle !== "false" && scope.$eval(attrs.jdToggle) != panelContent.is(':visible')) {
                                        scope.$eval(attrs.jdToggle + ' = value', { value: panelContent.is(':visible') });
                                        scope.$apply();
                                    }
                                };

                                var animateStyles = {
                                    height: 'toggle',
                                    'padding-top': 'toggle',
                                    'padding-bottom': 'toggle'
                                };

                                scope.$watch(function () {
                                    return scope.$parent.$eval(attrs.jdDisabled);
                                }, function (newValue, oldValue) {
                                    if (attrs.jdDisabled) {
                                        pScope.jdDisabled = newValue;
                                        if (!newValue) {
                                            bindToggle();
                                        } else {
                                            unbindToggle();
                                        }
                                    }
                                });

                                var toggle = function toggle(changeScope) {
                                    var animateOptions = {
                                        duration: 200,
                                        easing: 'linear',
                                        queue: false,
                                        done: function(evt) {                                            
                                            panelHead.toggleClass('panel-collapsed');
                                            // stop emite evento done, if adicionado para não passar pelo doneToggling 2x
                                            if (panelContent.is(':visible') == $target.hasClass(uiImpl.defaultToggleOpenIcon)) {
                                                doneToggling(changeScope);
                                            }
                                        }
                                    };
                                    panelContent.stop().animate(animateStyles, animateOptions);
                                };

                                var hide = function() {
                                    panelContent.hide();
                                    panelHead.addClass('panel-collapsed');
                                    $timeout(function () {
                                        doneToggling(true);
                                    });
                                };

                                var doToggle = function (e) {
                                    toggle();
                                    e.stopPropagation();
                                    return false;
                                };

                                var bindToggle = function () {
                                    toggleElement = panelHead.addClass('head-toggleable')
                                                             .find('*:first')
                                                             .addClass('toggleable')
                                                             .off('click', doToggle)
                                                             .on('click', doToggle);
                                };

                                var unbindToggle = function () {                                    
                                    toggleElement = panelHead.removeClass('head-toggleable')
                                                             .find('*:first')
                                                             .removeClass('toggleable')
                                                             .off('click', doToggle);
                                }

                                if (!pScope.jdDisabled) {                                    
                                    bindToggle();
                                }

                                if (attrs.jdToggle.toLowerCase().trim() === 'false') {
                                    hide();
                                } else if (attrs.jdToggle.toLowerCase().trim() !== "") {
                                    // se attrs.jdToggle false, já deixa área fechada
                                    var initialState = scope.$eval(attrs.jdToggle);
                                    if (initialState != undefined && initialState != panelContent.is(':visible')) {
                                        hide();
                                    }
                                    scope.$watch(function() {
                                        return scope.$eval(attrs.jdToggle);
                                    }, function (newValue, oldValue) {
                                        if (newValue != oldValue && newValue != panelContent.is(':visible')) {
                                            toggle(true);
                                        }
                                    });
                                }                                
                            }

                            // destroy
                            // se escopo destruido remove eventos
                            scope.$on('$destroy', function () {
                                if (toggleElement) {
                                    toggleElement.unbind('click');
                                }
                                pScope.$destroy();
                            });
                            // se input destruido remove wrap
                            element.on('$destroy', function () {
                                if (wrapper) {
                                    var w = wrapper;
                                    wrapper = null;
                                    toggleElement = null;
                                    w.remove();
                                }
                                scope.$destroy();
                            });
                        }
                    }
                }
            }
        }
    }]);