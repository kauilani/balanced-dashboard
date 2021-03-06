Balanced.TxnCreditComponent = Ember.Component.extend({
	layoutName: 'components/txn-credit',
	submitReverseCreditEvent: 'submitReverseCredit',

	actions: {
		submitReverseCredit: function(reversal) {
			this.sendAction('submitReverseCreditEvent', reversal);
		},
	}
});
