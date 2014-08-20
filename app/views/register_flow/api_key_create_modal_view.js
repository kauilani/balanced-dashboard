Balanced.ApiKeyCreateModalView = Balanced.RegisterFlowBaseModal.extend({
	templateName: "register_flow/api_key_create_modal",
	title: "Register for a production marketplace",
	subtitle: "Step 1 of 3: Provide business information",
	submitButtonText: "Continue",
	confirmMessage: "You have not completed the registration process. You will have to resubmit information if you cancel now.",
	elementId: "apiKeyCreate",

	apiKeyTypes: [{
		value: "person",
		label: "Individual"
	}, {
		value: "business",
		label: "Business: Corporation"
	}],

	businessTypes: Balanced.Marketplace.COMPANY_TYPES,

	model: function() {
		return Balanced.ApiKeyFactory.create({
			merchant: {
				type: "person",
				phone_number: "11111",
				postal_code: ""
			},
			business: {
				company_type: "llc",
				name: "Cccccc",
				incorporation_date: "2000-10",
				tax_id: "1111"
			},
			person: {
				name: "Cool",
				ssn_last_4: "1111",
				dob: "2000-10",
				postal_code: "33333"
			},
		});
	}.property(),

	nextStepSuccess: function(apiKeySecret) {
		this.trackEvent("User created api key", {
			formFields: this.get("model").getPropertiesDump()
		});
		this.openNext(Balanced.MarketplaceCreateModalView, apiKeySecret);
		this.alertSuccess("Business information confirmed");
	},

	actions: {
		save: function() {
			var self = this;
			var model = this.get("model");
			this.makeSaving();
			this.trackEvent("User saving api key", {
				formFields: model.getPropertiesDump()
			});
			model.save()
				.then(function(apiKeySecret) {
					self.nextStepSuccess(apiKeySecret);
				})
				.catch(function(error) {
					self.trackEvent("Error creating apiKey", {
						error: error,
						formFields: model.getPropertiesDump()
					});
					self.alertServerError(error);
				})
				.finally(function() {
					self.unmakeSaving();
				});
		}
	}
});
