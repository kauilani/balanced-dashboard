module('Login', {
	setup: function() {
		Testing.setupMarketplace();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Auth.signInRequest,
			Balanced.Auth.request
		);
	}
});

test('login page exists and has correct fields', function(assert) {
	var spy = sinon.spy(Balanced.Auth, 'signInRequest');
	Testing.logout();

	visit('/login')
		.then(function() {
			assert.equal($("form#auth-form").length, 1, 'The login form exists.');
			assert.equal($("form#auth-form input.ember-text-field").length, 2, '2 fields exist on the login form.');
			assert.equal($("form#auth-form button").length, 1, 'Submit button exist on the login form.');
		})
		.click('form#auth-form button')
		.then(function() {
			assert.equal(spy.callCount, 1, 'Login form correctly validated missing information.');
			assert.ok($("form#auth-form").hasClass('error'), 'Login form has an error.');
			assert.ok($(".notification-center.error .message").text().trim().toLowerCase().indexOf('is required') >= 0, 'Has error text');
		});
});

test('login form submits correctly', function(assert) {
	var spy = sinon.spy(Balanced.Auth, 'signInRequest');
	Testing.logout();

	visit('/login')
		.submitForm('form#auth-form')
		.then(function() {
			assert.equal(spy.callCount, 1, 'Login form correctly validated missing information.');
			assert.ok($("form#auth-form").hasClass('error'), 'Login form has an error.');
			assert.ok($(".notification-center.error .message").text().trim().toLowerCase().indexOf('is required') >= 0, 'Has error text');
		});
});

test('login page works', function(assert) {
	var spy = sinon.spy(Balanced.Auth, 'signInRequest');
	Testing.logout();

	visit('/login')
		.fillForm('form#auth-form', {
			email_address: 'user@balancedpayments.com',
			password: '111111'
		}, {
			click: 'button'
		})
		.then(function() {
			assert.equal(spy.callCount, 1, 'Login form correctly errored.');
			assert.ok($("form#auth-form").hasClass('error'), 'Login form has an error.');
			assert.ok($(".notification-center.error .message").text().trim().toLowerCase().indexOf('invalid') >= 0, 'Has error text');
		});
});

test('login stay works', function(assert) {
	visit('/login')
		.then(function() {
			var app = Balanced.__container__.lookup('controller:application');
			assert.equal(app.get('currentRouteName'), 'login');
		});
});

test('login transition works', function(assert) {
	visit('/start')
		.visit('/login')
		.then(function() {
			var app = Balanced.__container__.lookup('controller:application');
			assert.equal(app.get('currentRouteName'), 'login');
		});
});

test('login afterLogin with transition works', 1, function(assert) {
	var loginResponse = {
		"id": "ULxxx",
		"email_address": "xxx@gmail.com",
		"created_at": "2014-04-18T18:38:22.610397",
		"user_id": "USxxx",
		"user_uri": "/users/USxxx",
		"uri": "/logins/ULxxx",
		"session": "xxx",
		"email_hash": "xxx",
		"user": {
			"id": "USxxx",
			"uri": "/users/USxxx",
			"marketplaces_uri": "/users/USxxx/marketplaces",
			"api_keys_uri": "/users/USxxx/api_keys",
			"created_at": "2014-02-04T23:27:46.860461Z",
			"otp_enabled": false,
			"email_address": "xxx@gmail.com",
			"marketplaces": Balanced.Auth.get('user.user_marketplaces')
		},
		"status": "OK"
	};

	var promise = Ember.RSVP.resolve(loginResponse);
	var stub = sinon.stub(Balanced.Auth, 'request').returns(promise);

	Testing.logout();
	visit(Testing.MARKETPLACE_ROUTE)
		.click('form#auth-form button')
		.then(function() {
			var app = Balanced.__container__.lookup('controller:application');
			assert.equal(app.get('currentRouteName'), "marketplace.transactions");
		});
});
