'use strict';

define(['angular', 'bootstrap'], function () {

    angular.module('jedi.layout.input', []).constant('jedi.layout.input.InputConfig', {
        specificSizes: {
            "{{(type === 'radio' || type === 'checkbox') && jdRepeat == undefined || jdRepeat == ''}}": {
                xsSize: 12,
                smSize: 6,
                mdSize: 3,
                lgSize: 2,
                xsLabelSize: 0,
                smLabelSize: 6,
                mdLabelSize: 0,
                lgLabelSize: 0,
                xsInputSize: 12,
                smInputSize: 6,
                mdInputSize: 12,
                lgInputSize: 12,
            }
        },
        defaultSizes: {
            xsSize: 12,
            smSize: 6,
            mdSize: 3,
            lgSize: 2,
            xsLabelSize: 12,
            smLabelSize: 6,
            mdLabelSize: 12,
            lgLabelSize: 12,
            xsInputSize: 12,
            smInputSize: 6,
            mdInputSize: 12,
            lgInputSize: 12,
        },
        maxSize: 12,
        templateSelector: {
            "{{(type === 'radio' || type === 'checkbox') && jdRepeat != undefined && jdRepeat != ''}}": 'assets/libs/ng-jedi-layout/input-multipleinput.html',
            "{{(type === 'radio' || type === 'checkbox') && (jdRepeat == undefined || jdRepeat == '')}}": 'assets/libs/ng-jedi-layout/input-oneinput.html'
        },
        defaultTemplate: 'assets/libs/ng-jedi-layout/input-single.html',
        useValidationTooltip: true
    }).directive("jdInput", ['jedi.layout.input.InputConfig', function(InputConfig) {
        // prepara input antes de realizar transclude
        return {
            restrict: "A",
            priority: 1000.2,
            compile: function compile(cElement, cAttrs) {
                if (!cElement.attr('id')) {
                    cElement.attr('id', cElement.attr('ng-model'));
                    if (!cElement.attr('id')) {
                        cElement.attr('id', cElement.attr('name'));
                        if (!cElement.attr('id')) {
                            cElement.attr('id', cElement.attr('jd-label'));
                        }
                    }
                    cAttrs.id = cElement.attr('id');
                }

                if (!cElement.attr('name')) {
                    cElement.attr('name', cElement.attr('id'));
                }

                if (!cElement.attr('jd-i18n')) {
                    cElement.attr('jd-i18n', '');
                }

                if (cElement.is(':input') && !cElement.is(':radio') && !cElement.is(':checkbox') && !cElement.hasClass('form-control')) {
                    cElement.addClass('form-control');
                }

                if (!cAttrs.type && !cElement.is(':input')) {
                    cAttrs.type = 'statictext';
                }

                if (cAttrs.jdRepeat) {
                    if (cElement.attr('ng-value').indexOf('$parent') < 0 && cElement.attr('ng-value') != 'true' && cElement.attr('ng-value') != 'false') {
                        cElement.attr('ng-value', '$parent.' + cElement.attr('ng-value'));
                    }
                    if (cElement.attr('ng-model').indexOf('$parent') < 0) {
                        cElement.attr('ng-model', '$parent.$parent.$parent.' + cElement.attr('ng-model').replace('$index', '$parent.$index'));
                    }
                }

                if (cElement.is('textarea')) {
                    cAttrs.type = 'textarea';
                }

                if (cElement.is('select')) {
                    cAttrs.type = 'select';
                    if (cElement.attr('ng-model').indexOf('$parent') < 0) {
                        cElement.attr('ng-model', '$parent.$parent.' + cElement.attr('ng-model'));
                    }
                }

                if (cAttrs.jdOptions) {
                    cElement.attr('ng-options', cAttrs.jdOptions);
                }

                if (InputConfig.useValidationTooltip && !cAttrs.jdValidationTooltip && cAttrs.ngModel && cElement.is(':input')) {
                    cElement.attr('jd-validation-tooltip', '');
                }
                
                if(cAttrs.jdInput && !cAttrs.jdMdSize){
                    cElement.attr('jd-md-size', cAttrs.jdInput);
                    cAttrs.jdMdSize = cAttrs.jdInput;
                }
            }
        };
    }]).directive("jdInput", ['jedi.layout.input.InputConfig', '$interpolate', function(InputConfig, $interpolate) {
        // realiza transclude+template no input
        return {
            restrict: "A",
            replace: true,
            transclude: 'element',
            scope: {
                jdLabel: '@',
                jdGrouplabel: '@',
                id: '@',
                type: '@',
                jdXsSize: '@',
                jdSmSize: '@',
                jdMdSize: '@',
                jdLgSize: '@',
                jdXsLabelSize: '@',
                jdSmLabelSize: '@',
                jdMdLabelSize: '@',
                jdLgLabelSize: '@',
                jdXsInputSize: '@',
                jdSmInputSize: '@',
                jdMdInputSize: '@',
                jdLgInputSize: '@',
                jdHelp: '@'
            },
            priority: 1000.1,
            templateUrl: function(elem, attrs) {
                var _tpl;

                jQuery.each(InputConfig.templateSelector, function(expression, template) {
                    var checkTemplate = $interpolate(expression)(attrs) === "true";

                    if (checkTemplate) {
                        _tpl = template;
                        return false;
                    }
                });

                if (_tpl) {
                    return _tpl;
                } else {
                    return InputConfig.defaultTemplate;
                }
            },
            controller: ['$scope', '$attrs', '$element', function Controller($scope, $attrs, $element) {
                if ($attrs.jdRepeat) {
                    $scope.showLabel = $attrs.jdGrouplabel && $attrs.jdGrouplabel !== '';
                } else {
                    $scope.showLabel = $attrs.jdLabel && $attrs.jdLabel !== '';
                }

                $scope.showHelp = $attrs.jdHelp && $attrs.jdHelp !== '';

                var maxSize = InputConfig.maxSize;

                var sizesToUse = InputConfig.defaultSizes;
                jQuery.each(InputConfig.specificSizes, function(expression, sizes) {
                    var checkSizes = $interpolate(expression)($attrs) === 'true';

                    if (checkSizes){
                     sizesToUse = sizes;
                     return false;
                    }
                });

                jQuery.each(sizesToUse, function(size, value) {
                    size = 'jd' + size.charAt(0).toUpperCase() + size.substr(1);
                    // apenas ajusto os valores caso a pessoa não informar o tamanho.
                    if (!$attrs[size]) {
                        // atribui valor default
                        $scope[size] = value;

                        // se tamanho de label definido e não for definido o tamanho do input, atribui o input sendo a diferença entre o label
                        if (size.indexOf('Label') > -1) {
                            var inputSize = size.replace('Label', 'Input');
                            if ($attrs[inputSize]) {
                                var inputSizeValue = parseInt($attrs[inputSize]);
                                $scope[size] = inputSizeValue == maxSize ? maxSize : maxSize - inputSizeValue;
                            }
                        }

                        // se tamanho de input definido e não for definido o tamanho do label, atribui o label sendo a diferença entre o input
                        if (size.indexOf('Input') > -1) {
                            var labelSize = size.replace('Input', 'Label');
                            if ($attrs[labelSize]) {
                                var labelSizeValue = parseInt($attrs[labelSize]);
                                $scope[size] = labelSizeValue == maxSize ? maxSize : maxSize - labelSizeValue;
                            }
                        }

                        $attrs[size] = $scope[size];
                    }
                });
            }],
            compile: function compile(cElement, cAttrs, cTransclude) {
                // caso haja jdRepeat, atribui ng-repeat no lugar, para que não dê problema com transclude+template
                if (cAttrs.jdRepeat) {
                    var repeatElement = cElement.find('[ng-repeat]');
                    if (cAttrs.jdRepeat.indexOf('$parent') < 0) {
                        repeatElement.attr('ng-repeat', cAttrs.jdRepeat.replace(/\s+in\s+/, ' in $parent.'));
                    } else {
                        repeatElement.attr('ng-repeat', cAttrs.jdRepeat);
                    }
                    repeatElement.html(repeatElement.html().replace('{{jdLabel}}', cAttrs.jdLabel));
                }

                return function(scope, element, attrs) {
                    // se element for do tipo select, ajusta os ctrls para correto binding do model
                    if (element.is('[type=select]')) {
                        var ctrlTpl = element.controller('select');
                        var ctrlSelect = element.find('select').controller('select');
                        if (ctrlTpl && ctrlSelect) {
                            // substitui ctrl do select e ngModel contidos no template para usar os do select
                            ctrlTpl.ngModelCtrl = ctrlSelect.ngModelCtrl;
                            ctrlTpl.unknownOption = ctrlSelect.unknownOption;
                            ctrlTpl.renderUnknownOption = ctrlSelect.renderUnknownOption;
                            ctrlTpl.removeUnknownOption = ctrlSelect.removeUnknownOption;
                            ctrlTpl.readValue = ctrlSelect.readValue;
                            ctrlTpl.writeValue = ctrlSelect.writeValue;
                            ctrlTpl.addOption = ctrlSelect.addOption;
                            ctrlTpl.removeOption = ctrlSelect.removeOption;
                            ctrlTpl.hasOption = ctrlSelect.hasOption;
                        }
                    }
                };
            }
        };
    }]);
});