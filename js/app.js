(function () {
	'use strict';

	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController)
	.constant('APIBasePath', 'https://davids-restaurant.herokuapp.com/menu_items.json')
	.service('MenuSearchService', MenuSearchService)
	.directive('foundItems', FoundItems);

	NarrowItDownController.$inject = ['MenuSearchService'];
	function NarrowItDownController (MenuSearchService) {
		const list = this;
		list.searchTerm = "";

		list.getMatchedMenuItems = function (){
			const promise = MenuSearchService.getMatchedMenuItems(list.searchTerm);
			promise.then(function (result) {
				list.found = result;
			});
		};

		list.removeItem = function (index) {
			list.found.splice(index, 1);
		};

	}

	function FoundItems(){
		const ddo = {
			templateUrl: 'foundItems.html',
			scope: {
				found: '<',
				onRemove: '&'
			},
			controller: FoundItemsDirectiveController,
			controllerAs: 'list',
			bindToController: true
		};
		return ddo;
	}

	function FoundItemsDirectiveController(){
		const list =this;

		list.isEmpty = function () {
			if (list.found !== undefined && list.found.length === 0){
				return true;
			}
			return false;
		};
	}

	MenuSearchService.$inject = ['$http', 'APIBasePath'];
	function MenuSearchService ($http, APIBasePath){
		const service = this;
		
		service.getMatchedMenuItems = function (searchTerm) {
			return $http({
				method: "GET",
				url: APIBasePath
			}).then(function (response) {
				const foundItems = [];
				const allItems = response.data.menu_items;
				if (searchTerm === ""){
					return foundItems;
				}
				for (let i = 0; i < allItems.length; i++){
					const item = allItems[i];
					if (item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
						foundItems.push(item);
					}
				}
				return foundItems;
			})
			.catch(function (error){
				console.log(error.message);
			});
		};
	}

})();