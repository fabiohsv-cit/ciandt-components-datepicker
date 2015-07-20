# ciandt-components-datepicker
Datepicker component written in angularjs.

### Install

* Install the dependency:

   ```shell
   bower install ciandt-components-datepicker --save
   ```
* Add datepicker.js to your code:

   ```html
   <script src='assets/libs/ciandt-components-datepicker/datepicker.js'></script>
   ```
   - note that the base directory used was assets/libs, you should change bower_components to assets/libs or move from bower_components to assets/libs with grunt.
* Include module dependency:

   ```javascript
   angular.module('yourApp', ['ciandt.components.datepicker']);
   ```
======

### How To Use

1. **Add app-datepicker directive in your html**

   ```html
   <input app-datepicker app-min-date="myCtrl.myModel.startDate" app-max-date="myCtrl.myModel.endDate" type="text" ng-model="myCtrl.myModel.initialDate" />
   ```