'use strict';

define(['ng-jedi-utilities'], function () {

    angular.module('jedi.layout.input', ['jedi.utilities']).constant('jedi.layout.input.InputConfig', {
        useValidationTooltip: true
    }).directive('jdInput', ['$interpolate', '$timeout', 'jedi.utilities.Utilities', '$log', 'jedi.layout.input.InputConfig', '$injector', function ($interpolate, $timeout, utilities, $log, InputConfig, $injector) {
        var localize;
        try {
            localize = $injector.get('jedi.i18n.Localize');
        } catch (e) { }

        return {
            restrict: 'A',
            require: '?^ngModel',
            link: function (scope, element, attrs, ngModel) {

                // valor do atributo jdInput é a definição do tamanho do campo.
                var size = attrs.jdInput;
                if (!size) {
                    size = 2;
                }

                // se houver uma divisão de paineis em linha (um ao lado do outro), define tamanho do label e elemento maior que o padrão, pra não ficar muito pequeno.
                var labelSize = 1;
                if (element.parent().parent().is('div.row') || element.parents('.modal-content').length > 0) {
                    labelSize = 2;
                    if (!size) {
                        size = 3;
                    }
                }

                // é possível usar um atributo jd-label-size que sobrescreve e força que o label-size seja escolhido
                if (!isNaN(attrs.jdLabelSize)) {
                    labelSize = parseInt(attrs.jdLabelSize);
                }

                // define id e name do elemento, caso não tenha
                var id = attrs.id;
                if (!id) {
                    id = attrs.ngModel;
                    if (!id) {
                        id = attrs.name;
                        if (!id) {
                            id = attrs.jdLabel;
                        }
                    }
                    element.attr('id', id);
                }

                var name = attrs.name;
                if (!name) {
                    name = id;
                    element.attr('name', name);
                }

                // se parent for uma div com elementos em linha, adiciona nele a classe form-group, para definir a margem entre linhas
                if (element.parent().is("div.row") && !element.parent().hasClass('form-group')) {
                    element.parent().addClass('form-group');
                }

                var isRequired = angular.isDefined(attrs.required);
                var minLength = attrs['ngMinlength'];
                var maxLength = attrs['ngMaxlength'];
                var min = attrs['min'];
                var max = attrs['max'];

                if (minLength) {
                    element.attr('minLength', minLength);
                    attrs.minLength = minLength;
                }

                if (maxLength) {
                    element.attr('maxLength', maxLength);
                    attrs.maxLength = maxLength;
                }

                if (InputConfig.useValidationTooltip) {
                    // apply validation tooltip
                    utilities.applyValidationTooltip(scope, element, attrs, ngModel, localize);
                }

                // se for check ou radio trata os elementos de forma diferenciada
                if (element.is("input[type=checkbox]") || element.is("input[type=radio]")) {
                    var rWrap;
                    // se for radio com repeat sem um div[jd-input] encobrindo-o, cria o div inline e adiciona todos os inputs dentro dele
                    if (element.is("input[type=radio]") && (attrs.ngRepeat || attrs.dataNgRepeat) && !element.parent().is('div[jd-input]')) {
                        // localiza div.radio-inline para adicionar o elemento dentro dele
                        rWrap = element.parent().find('div.radio-inline input[name="' + attrs.name + '"]').parent().parent();
                        if (!rWrap || rWrap.length == 0) {
                            // caso não haja div.radio-inline, cria e adiciona elemento dentro dele
                            rWrap = utilities.wrapElement(element, '<div class="radio-inline"></div>');
                            // se parent definido com form-group, ignora layout
                            if (!element.parent().parent().hasClass('form-group')) {
                                // cria form-group e area do label
                                // se definido, adiciona label ao grupo criado, senão cria div com o tamanho do label, para manter layout
                                if (attrs.jdGrouplabel) {
                                    utilities.wrapElement(rWrap, '<div class="form-group"><label for="' + id + '" class="col-sm-' + labelSize + ' control-label">' + attrs.jdGrouplabel + '</label></div>', false);
                                } else {
                                    utilities.wrapElement(rWrap, '<div class="form-group"><div class="col-sm-' + labelSize + '"></div></div>', false);
                                }
                            }
                        }
                    }

                    var wrap;

                    // adiciona label com seu devido tamanho e estilo (check/radio)
                    if (attrs.jdLabel) {
                        wrap = utilities.wrapElement(element, '<label class="ui-' + attrs.type + '"><span>' + attrs.jdLabel + (isRequired ? ' *' : '') + '</span></label>', true);
                    } else {
                        wrap = utilities.wrapElement(element, '<label class="ui-' + attrs.type + '"><span></span></label>', true);
                    }

                    // se houver rWrap de agrupamento (por conta do repeat), adiciona o elemento dentro dele
                    if (rWrap && rWrap.length != 0) {
                        rWrap.append(wrap);
                    } else
                        if (!wrap.parent().is("div.row,td,li")) {
                            // se parent nao for div em linha
                            // se for um elemento normal (input, select, textbox), cria form-group com área div do tamanho do label definido, para manter layout
                            if (!wrap.parent().is("div[jd-input]")) {
                                utilities.wrapElement(wrap, '<div class="form-group"><div class="col-sm-' + labelSize + '"></div></div>');
                            } else
                                if (!wrap.parent().hasClass(attrs.type + '-inline')) {
                                    // senão é um div de agrupamento inline, adiciona classe para tal estilo
                                    wrap.parent().addClass(attrs.type + '-inline');
                                }
                        }
                } else {
                    var wrap = element;
                    // se não for um div de agrupamento (de radios/checks), adiciona classe form-control e wrap no elemento para definir tamanho
                    if (!element.is("div") && !element.is('.input-lg,.input-sm')) {
                        element.addClass('form-control');
                        wrap = utilities.wrapElement(element, '<div class="col-sm-' + size + '"></div>');
                        if (element.is("select")) {
                            element.change(function () {
                                var widthTmp = $('<span id="width_tmp" style="display: none; white-space:nowrap; text-indent: .01px; font-size: 11px; font-weight: 700; text-transform: uppercase;"></span>');
                                element.after(widthTmp);
                                $("#width_tmp").html(element.children('option:selected').text());
                                element.attr('style', 'width: ' + ($("#width_tmp").width() + 90) + 'px; !important')
                                widthTmp.remove();
                            });
                        }
                    }

                    // adiciona div.form-group caso o parent do elemento não seja um div com vários elementos em linha.
                    if (!element.parent().is('div.row,td,li,.form-group') && !element.parent().parent().is('div.row,td,li,.form-group')) {
                        utilities.wrapElement(wrap, '<div class="form-group"></div>');
                    }

                    // se tiver label definido, inclui tag label
                    if (attrs.jdLabel) {
                        wrap.before('<label for="' + id + '" class="col-sm-' + labelSize + ' control-label">' + attrs.jdLabel + (isRequired ? ' *' : '') + '</label>');
                    }

                    // se for select encobre com um span para estilizar o combo
                    if (element.is("select")) {
                        utilities.wrapElement(element, '<span class="ui-select"></span>');
                    }
                }

                element.removeAttr('jd-input');
            }
        };
    }]);

});