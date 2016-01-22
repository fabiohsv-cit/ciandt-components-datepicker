(function (factory) {
    if (typeof define === 'function') {
        define(['moment', 'ng-jedi-utilities', 'angular-ngMask'], factory);
    } else {
        var _moment = moment;
        if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
            module.exports = 'jedi.layout';
            _moment = require('moment');
        }
        return factory(_moment);
    }
}(function(moment) {
	"use strict";
