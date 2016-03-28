(function (factory) {
    if (typeof define === 'function') {
        define(['angular-materialize'], factory);
    } else {
        if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
            module.exports = 'jedi.layout.impl';
            require('angular-materialize');
        }
        return factory();
    }
}(function() {
	"use strict";

    angular.module('jedi.layout.impl', ['ui.materialize']).constant('jedi.layout.impl.Input', {
        elementClass: ['validate', function(element) {
            return element.is('textarea') ? 'materialize-textarea' : '';
        }],
        templates: {
            singleInput: '<div class="input-field col s{{jdSmSize}} m{{jdMdSize}} l{{jdLgSize}} jd-{{type}} {{jdInputClass}}">'+
                            '  <ng-transclude></ng-transclude>'+
                            '  <label ng-if="showLabel" for="{{id}}" class="{{jdLabelClass}}"><jd-i18n>{{jdLabel}}</jd-i18n>{{showRequired}}</label>'+
                            '  <small ng-if="showHelp" jd-i18n>{{jdHelp}}</small>'+
                            '</div>',
            multipleInput: '<div class="col s{{jdSmSize}} m{{jdMdSize}} l{{jdLgSize}} jd-multi-{{type}}">'+
                            '    <label ng-if="showLabel" class="{{jdLabelClass}}"><jd-i18n>{{jdGrouplabel}}</jd-i18n>{{showRequired}}</label>'+
                            '    <p class="{{jdInputClass}} jd-input-container" ng-repeat>'+
                            '      <ng-transclude></ng-transclude>'+
                            '      <label for="{{id}}" jd-i18n>{{jdLabel}}</label>'+
                            '    </p>'+
                            '    <small ng-if="showHelp" jd-i18n>{{jdHelp}}</small>'+
                            '</div>',
            oneInput: '<div class="col s{{jdSmSize}} m{{jdMdSize}} l{{jdLgSize}} jd-{{type}} {{jdInputClass}}">' +                    
                        '<label ng-if="showLabel" for="{{id}}" class="{{jdLabelClass}}"><jd-i18n>{{jdLabel}}</jd-i18n>{{showRequired}}</label>' +
                        '<div class="switch">' +
                        ' <label class="jd-input-container">' +
                        '  <ng-transclude></ng-transclude>' +
                        ' <span class="lever"></span>' +
                        ' {{ jdLabel }}' +
                        ' </label>' +
                        '</div>' +                              
                        '<small ng-if="showHelp" jd-i18n>{{jdHelp}}</small>'+
                        '</div>'
        },
        postLink: function(scope, element) {
            setTimeout(function() {
                var label = element.find('label');
                if (label.length > 0) {
                    var input = element.find('ng-transclude:first > :first-child,[ng-transclude]:first > :first-child');
                    
                    if (input.is('input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea')) {
                        input.on('change', function () {
                            if (input.val().length !== 0) {
                                label.addClass('active');
                            }
                        }).on('reset', function(e) {
                            if (input.val().length === '' && input.attr('placeholder') === undefined) {
                                label.removeClass('active');
                            }
                        }).on('focus', function() {
                            label.addClass('active').addClass('focus');
                        }).on('blur', function() {
                            if (input.val().length === 0 && input.attr('placeholder') === undefined) {
                                label.removeClass('active');
                            }
                            label.removeClass('focus');
                        });

                        if (input.val().length > 0 || input.attr('autofocus') || input.attr('placeholder') !== undefined) {
                            label.addClass('active');
                        } else if (input.attr('placeholder') === undefined) {
                            label.removeClass('active');
                        }
                    } else if (input.is('select')) {
                        input.material_select();
                        label.addClass('active');
                        // destroy
                        scope.$on('$destroy', function() {
                            input.material_select('destroy');
                        });
                        element.on('$destroy', function() {
                            input.material_select('destroy');
                        });
                    }
                }
                
                var type = element.attr('type') || element.data('type');
                if (type == 'radio' || type == 'checkbox') {
                    element.removeAttr('type');
                    element.data('type', type);                            
                    element.find('.jd-input-container').each(function(index) {
                        var $inputContainer = $(this);                                
                        var transclude = $inputContainer.find('ng-transclude');
                        var label = $inputContainer.find('label');
                        var input = $inputContainer.find('input');
                        var id = input.attr('id') + index; 
                        
                        input.attr('id', id).insertAfter(transclude);
                        label.attr('for', id);                                                    
                        input.addClass('with-gap');            
                    });                            
                }
                
            }, 0);
        }
    }).constant('jedi.layout.impl.Panel', {
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
    }).constant('jedi.layout.impl.ValidationTooltip', {
        open: function(element, message, type) {
            element.attr('data-position', "right");
            element.attr('data-tooltip', message);
            element.tooltip('remove');
            element.tooltip();                                                                       
            if (type === 'focus') {
                element.trigger('mouseenter.tooltip');                        
            } 
        },
        close: function(element, type) {
            if (type === 'blur') {
                element.trigger('mouseleave.tooltip');
            }
        },
        destroy: function(element) {
            element.tooltip('remove');
        }
    }).constant('jedi.layout.impl.Dialogs', {
        alert: '<div id="modal1" class="modal">' +
               '           <div class="modal-content">' +
               '               <h4 jd-i18n>{{alertTitle}}</h4>' +
               '               <p class="{{ item.type }}" ng-repeat="item in items" jd-i18n>{{ item.message }}</p>' +
               '           </div>' +
               '           <div class="modal-footer">' +
               '               <a ng-click="ok()" class=" modal-action modal-close waves-effect waves-green btn-flat" jd-i18n>{{ alertOkLabel }}</a>' +
               '           </div>' +
               '       </div>',
        confirm: '<div id="modal1" class="modal">' +
                 '           <div class="modal-content">' +
                 '               <h4 jd-i18n>{{confirmTitle}}</h4>' +
                 '               <p jd-i18n>{{ message }}</p>' +
                 '           </div>' +
                 '           <div class="modal-footer">' +
                 '               <a ng-click="ok()" jd-i18n class=" modal-action modal-close waves-effect waves-light btn">{{ confirmYesLabel }}</a>' +
                 '               <a jd-dismiss-modal jd-i18n class="modal-action modal-close waves-effect waves-light btn red">{{ confirmNoLabel }}</a>' +
                 '           </div>' +
                 '       </div>'
    }).constant('jedi.layout.impl.Breadcrumb', {
        template: '<nav class="light-blue hide-on-med-and-down">'+
                  '  <div class="nav-wrapper container">'+
                  '    <div class="col s12">'+
                  '      <span class="breadcrumb" ng-repeat="item in jdBreadcrumb track by $index + item" jd-i18n>{{item}}</span>'+
                  '    </div>'+
                  '  </div>'+
                  '</nav>'
    });

}));