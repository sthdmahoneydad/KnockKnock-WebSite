/* ShoppingExperienceManager.js */

  	var activeShopperExperienceList = [	];
	var activeShopperList = [];

	function getActiveShopperExperienceList(){
		return activeShopperExperienceList;
	}

	function getActiveShopperList(){
		return activeShopperList;
	}

	function isActiveShopper(customer, shopperList ) {
		var activeShopper = false;
		for (var i=0; i< shopperList.length; i++) {
			if (customer.customerID == shopperList[i].customerID){
				activeShopper = true;
				break;
			}
		}
		return activeShopper;
	}
	
	function removeCustomerFromActiveShopperList(customer, shopperList){
		for (var cIdx =0; cIdx < shopperList.length; cIdx++) {
			if (shopperList[cIdx].customerID == customer.customerID ) {
				shopperList.splice(cIdx, 1);
				break;
			}
		}
		return shopperList;
	}
	
	

	function getActiveShopperExperienceByCustomer(customer){
		var activeShopper;
		
		for (var cIdx =0; cIdx < activeShopperExperienceList.length; cIdx++) {
			if (activeShopperExperienceList[cIdx].customerID == customer.customerID ) {
				activeShopper = activeShopperExperienceList[cIdx];
			}
		}
		return activeShopper;
	}
	
	function getActiveShopperByCustomer(customer){
		var activeShopper;
		
		for (var cIdx =0; cIdx < activeShopperList.length; cIdx++) {
			if (activeShopperList[cIdx].customerID == customer.customerID ) {
				activeShopper = activeShopperList[cIdx];
			}
		}
		return activeShopper;
	}

	function setActiveShopper(customer){
		var activeShopper;
		
		for (var cIdx =0; cIdx < activeShopperList.length; cIdx++) {
			if (activeShopperList[cIdx].customerID == customer.customerID ) {
				activeShopperList[cIdx] = customer ;
			}
		}
		return activeShopper;
	}
	