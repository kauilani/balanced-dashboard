require("./model_array");

Balanced.LinkedModelArray = Balanced.ModelArray.extend({
	_populateModels: function(json) {
		var self = this;
		var typeClass = this.get('typeClass');
		var itemsArray;
		if (!(json.linked === undefined || json.linked === null)) {
			itemsArray = json.linked[this.get("linkedKey")];
		}

		if (json.next_uri) {
			this.set('next_uri', json.next_uri);
			this.set('hasNextPage', true);
		} else {
			this.set('next_uri', undefined);
			this.set('hasNextPage', false);
		}

		this.set('counts', json.counts);

		var typedObjects = _.map(itemsArray, function(item) {
			var typedObj = typeClass._materializeLoadedObjectFromAPIResult(item);

			// if an object is deleted, remove it from the collection
			typedObj.on('didDelete', function() {
				self.removeObject(typedObj);
			});

			return typedObj;
		});

		this.addObjects(typedObjects);
		this.set('isLoaded', true);
		this.trigger('didLoad');
	},
});

Balanced.LinkedModelArray.reopenClass({
	newArrayLoadedFromUri: function(uri, defaultType, linkedKey) {
		var typeClass = Balanced.TypeMappings.typeClass(defaultType);
		var modelObjectsArray = this.create({
			content: Ember.A(),
			typeClass: typeClass,
			uri: uri,
			linkedKey: linkedKey
		});

		if (!uri) {
			return modelObjectsArray;
		}

		modelObjectsArray.set('isLoaded', false);
		Balanced.Adapter.get(typeClass, uri, function(json) {
			var deserializedJson = typeClass.serializer.extractCollection(json);
			modelObjectsArray._populateModels(deserializedJson);
		}, function(jqXHR, textStatus, errorThrown) {
			modelObjectsArray._handleError(jqXHR, textStatus, errorThrown);
		});

		return modelObjectsArray;
	},
});
