    angular.module('jedi.layout.panel', ['jedi.utilities']).constant('jedi.layout.panel.PanelConfig', {
        defaultPanelHeadingRightClass: 'panel-heading-right',
        templateUrl: 'assets/libs/ng-jedi-layout/panel.html'
    }).run(['$templateCache', 'jedi.layout.impl.Panel', function($templateCache, uiImpl) {
        $templateCache.put('assets/libs/ng-jedi-layout/panel.html', uiImpl.template);
    }]).directive('jdPanel', ['jedi.utilities.Utilities', 'jedi.layout.panel.PanelConfig', '$timeout', '$compile', '$filter', '$templateCache', 'jedi.layout.impl.Panel', function (utilities, PanelConfig, $timeout, $compile, $filter, $templateCache, uiImpl) {
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