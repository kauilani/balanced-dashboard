Balanced.ControlGroupFieldView = Balanced.View.extend({
	tagName: 'div',
	classNames: ['control-group'],
	classNameBindings: ['cssError:error'],
	templateName: '_control_group_field',
	type: 'text',

	recommendedField: false,

	error: function(field, prefix) {
		var errors = this.get('controller.validationErrors.' + field + '.messages');
		if (errors) {
			var error = errors[0];
			if (error.indexOf(prefix) !== 0) {
				error = prefix + ' ' + error;
			}
			return error;
		}
	},

	cssError: function() {
		var field = this.get('field');
		return this.get('controller.validationErrors.' + field);
	}.property('controller.validationErrors.length'),

	fieldKey: function() {
		return "controller." + this.get('field');
	},

	value: function() {
		var field = this.get('field');
		return this.get('controller.content').get(field);
	}.property().volatile(),

	valueChange: function() {
		var field = this.get('field'),
			value = this.get('value');

		this.get('controller.content').set(field, value);
	}.observes('value'),

	labelForField: function() {
		var field = this.get('field'),
			prefix = this.get('placeholder') || field;
		return this.error(field, prefix) || this.get('help') + '.';
	}.property('controller.validationErrors.length')
});


Balanced.DateSelectView = Balanced.ControlGroupFieldView.extend({
	tagName: 'div',
	classNames: ['control-group'],
	classNameBindings: ['cssError:error'],
	templateName: '_date_select_field',
	type: 'select'
});
