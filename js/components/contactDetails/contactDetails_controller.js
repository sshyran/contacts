app.controller('contactdetailsCtrl', ['ContactService', 'AddressBookService', 'vCardPropertiesService', '$routeParams', '$scope', function(ContactService, AddressBookService, vCardPropertiesService, $routeParams, $scope) {
	var ctrl = this;

	ctrl.uid = $routeParams.uid;
	ctrl.t = {
		noContacts : t('contacts', 'No contacts in here'),
		placeholderName : t('contacts', 'Name'),
		placeholderOrg : t('contacts', 'Organization'),
		placeholderTitle : t('contacts', 'Title'),
		selectField : t('contacts', 'Add field ...')
	};

	ctrl.fieldDefinitions = vCardPropertiesService.fieldDefinitions;
	ctrl.focus = undefined;
	ctrl.field = undefined;
	$scope.addressBooks = [];
	ctrl.addressBooks = [];

	AddressBookService.getAll().then(function(addressBooks) {
		ctrl.addressBooks = addressBooks;
		$scope.addressBooks = addressBooks.map(function (element) {
			return {
				id: element.displayName,
				name: element.displayName
			};
		});
		if (!_.isUndefined(ctrl.contact)) {
			$scope.addressBook = _.find($scope.addressBooks, function(book) {
				return book.id === ctrl.contact.addressBookId;
			});
		}
	});

	$scope.$watch('ctrl.uid', function(newValue, oldValue) {
		ctrl.changeContact(newValue);
	});

	ctrl.changeContact = function(uid) {
		if (typeof uid === 'undefined') {
			return;
		}
		ContactService.getById(uid).then(function(contact) {
			ctrl.contact = contact;
			ctrl.photo = ctrl.contact.photo();
			$scope.addressBook = _.find($scope.addressBooks, function(book) {
				return book.id === ctrl.contact.addressBookId;
			});
		});
	};

	ctrl.updateContact = function() {
		ContactService.update(ctrl.contact);
	};

	ctrl.deleteContact = function() {
		ContactService.delete(ctrl.contact);
	};

	ctrl.addField = function(field) {
		var defaultValue = vCardPropertiesService.getMeta(field).defaultValue || {value: ''};
		ctrl.contact.addProperty(field, defaultValue);
		ctrl.focus = field;
		ctrl.field = '';
	};

	ctrl.deleteField = function (field, prop) {
		ctrl.contact.removeProperty(field, prop);
		ctrl.focus = undefined;
	};

	ctrl.changeAddressBook = function (addressBook) {
		addressBook = _.find(ctrl.addressBooks, function(book) {
			return book.displayName === addressBook.id;
		});
		ContactService.moveContact(ctrl.contact, addressBook);
	};
}]);
