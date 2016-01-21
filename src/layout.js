	angular.module('jedi.layout', ['jedi.layout.datepicker',
									'jedi.layout.panel',
									'jedi.layout.modal',
									'jedi.layout.treeview',
									'jedi.layout.input',
									'jedi.layout.validationtooltip']);

	angular.module('jedi.layout').constant('jedi.layout.LayoutConfig', {
		defaultUiImpl: 'bootstrap'
	});