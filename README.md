# ciandt-components-layout
Layout components written in angularjs.

### Install

* Install the dependency:

   ```shell
   bower install ciandt-components-layout --save
   ```
* Add layout.js to your code:

   ```html
   <script src='assets/libs/ciandt-components-layout/layout.js'></script>
   <script src='assets/libs/ciandt-components-layout/datepicker.js'></script>
   <script src='assets/libs/ciandt-components-layout/input.js'></script>
   <script src='assets/libs/ciandt-components-layout/treeview.js'></script>
   <script src='assets/libs/ciandt-components-layout/modal.js'></script>
   <script src='assets/libs/ciandt-components-layout/panel.js'></script>
   ```
   - note that the base directory used was assets/libs, you should change bower_components to assets/libs or move from bower_components to assets/libs with grunt.
* Include module dependency:

   ```javascript
   angular.module('yourApp', ['ciandt.components.layout']);
   ```
======

### How To Use

1. **Add app-datepicker directive in your html**
   - this directive use bootstrap-datetimepicker and integrating its with angularjs
   ```html
   <input app-datepicker app-min-date="myCtrl.myModel.startDate" app-max-date="myCtrl.myModel.endDate" type="text" ng-model="myCtrl.myModel.initialDate" />
   ```
   - if you need, you can customize the html. In your angular run from app.js, override the constant ciandt.components.layout.datepicker.DatepickerConfig and set your html in template attribute.

2. **Add app-treeview directive in your html**
   - this directive creates a treeview in your page. The value setted in directive shoud be the levels, separated by ';'. Each level should be passed the description field name. Your model should be similar to a tree. The last level uses the body content. E.g.:
   ```html
   <ol app-treeview="level1[level1.fieldLevel1] in myCtrl.myModel.tree; level2[level2.fieldLevel2] in level1.levels2; level3 in level2.levels3">
      <input type="checkbox" ng-model="level3.selected">
      <span class="">{{level3.fieldLevel3}}</span>
   </ol>
   ```
   ```javascript
   vm.myModel = {tree: [
      {
         fieldLevel1: 'Description level 1',
         levels2: [
            {
               fieldLevel2: 'Description level 2',
               levels3: [
                  {
                     fieldLevel3: 'Description level 3'
                  }
               ]
            }
         ]
      }
   ]};
   ```
   * if you need, you can customize the html. In your angular run from app.js, override the constant ciandt.components.layout.treeview.TreeviewConfig and set your html. There are three attributes:
   - emptyTpl: define html to write when tree is empty.
   - nodeTpl: define html to write the intermediate nodes.
   - lastNodeTpl: define html to write the last node.
   ```javascript
   app.run(['ciandt.components.layout.treeview.TreeviewConfig', function(TreeviewConfig){
      TreeviewConfig.emptyTpl = '<div id="emptyTreeElement"><strong class="text-warning"><i18n>Nenhum item encontrado.</i18n></strong></div>';
   }]);
   ```

3. **Add app-panel directive in your html**
   - this directive creates a bootstrap panel with few lines of code. The value setted in directive is the bootstrap col-lg size.
   ```html
   <form app-panel="1" app-title="My Panel">
      ...
   </form>
   ```
   * if you need, you can customize the html. In your angular run from app.js, override the constant ciandt.components.layout.panel.PanelConfig and set your html. There are three attributes:
   - defaultElementClass: default class to apply in your element
   - defaultFormClass: default class to apply in the forms into your element
   - wrapSizeTpl: define html to write the div with col-lg if you define size to the panel.
   - useBoxedPage: define if the panel will be create a div.page wrap
   - containerFilter: jQuery filter to check if panel parent is a container for then create div.page
   - boxedPageTpl: define html to write on div.page element.
   - bodyTpl: define html to write arround of your element.
   - headerTpl: define html to write in the header panel.

4. **Add app-input directive in your html**
   - this directive apply classes and htmls arround your input to improvement the bootstrap power. The value setted in directive is the bootstrap col-sm size. The directive also add a validation tooltip when there is/are validation error(s) (see ciandt-components-utilities function applyValidationTooltip).
   ```html
   <input app-input="5" app-label-size="1" app-label="My Text" type="text" ng-model="myText">
   
   <input app-input app-label="My Check" type="checkbox" ng-model="myCheck">
   
   <input app-input app-grouplabel="My Multi Checks" app-label="{{item.label}}" type="checkbox" ng-model="item.selected" ng-repeat="item in items">
   
   <input app-input app-label="My Radio" type="radio" ng-model="myRadio">
   
   <input app-input app-grouplabel="My Multi Radios" app-label="{{item.label}}" type="radio" ng-model="item.selected" ng-repeat="item in items">
   
   <select app-input app-label="My Select" ng-model="mySelect">
   
   <textarea app-input app-label="My Textarea" ng-model="myTextarea">
   ```
   - in these examples above, the final html will be:
   ```html
   <div class="form-group">
      <label for="myText" class="col-sm-1 control-label">My Text</label>
      <div class="col-sm-5">
         <input id="myText" type="text" ng-model="myText">
      </div>
   </div>
   
   <div class="form-group">
	 <div class="col-sm-offset-2 col-sm-10">
	   <div class="checkbox">
		 <label>
		   <input type="checkbox" ng-model="myCheck"> My Check
		 </label>
	   </div>
	 </div>
   </div>
   
   <div class="form-group">
	 <label class="col-sm-2 control-label">My Multi Checks</label>
	 <div class="col-sm-10">
	    <label class="checkbox-inline">
		  <input type="checkbox" ng-model="item1"> Item 1
		</label>
		<label class="checkbox-inline">
		  <input type="checkbox" ng-model="itemN"> Item N
		</label>
	 </div>
   </div>
   
   <div class="form-group">
	 <div class="col-sm-offset-2 col-sm-10">
	   <div class="radio">
		 <label>
		   <input type="radio" ng-model="myRadio"> My Radio
		 </label>
	   </div>
	 </div>
   </div>
   
   <div class="form-group">
	 <label class="col-sm-2 control-label">My Multi Radios</label>
	 <div class="col-sm-10">
	    <label class="radio-inline">
		  <input type="radio" ng-model="item1"> Item 1
		</label>
		<label class="radio-inline">
		  <input type="radio" ng-model="itemN"> Item N
		</label>
	 </div>
   </div>
   
   <div class="form-group">
      <label for="mySelect" class="col-sm-2 control-label">My Select</label>
      <div class="col-sm-10">
         <select id="mySelect" ng-model="mySelect">
      </div>
   </div>
   
   <div class="form-group">
      <label for="myTextarea" class="col-sm-2 control-label">My Textarea</label>
      <div class="col-sm-10">
         <textarea id="myTextarea" ng-model="myTextarea">
      </div>
   </div>
   ```
   * if you need, you can customize the html. In your angular run from app.js, override the constant ciandt.components.layout.input.InputConfig and set your html. There are three attributes:
   - useValidationTooltip: define if the input will use the validation tooltip to show erros.
   - labelTpl: define html to write the label content
   - selectWrapTpl: define html to write the wrap select content
   - inputWrapTpl: define html to write the wrap input content
   - groupWrapTpl: define html to write the wrap group content