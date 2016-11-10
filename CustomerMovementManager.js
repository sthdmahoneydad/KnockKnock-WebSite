/*  CustomerMovementManager.js */

function getCustomerMovements() {

	var custMovements =  [
		{ cx: 600, cy: 500, customerID: 'c00002', firstName:'Jane', lastName:'Doe'},
		{ cx: 350, cy: 450, customerID: 'c00002', firstName:'Jane', lastName:'Doe'},
		{ cx: 450, cy: 10,  customerID: 'c00003', firstName:'Scott', lastName:'Mahoney'},
		{ cx: 700, cy: 100,  customerID: 'c00003', firstName:'Scott', lastName:'Mahoney'},

		{ cx: 400, cy: 400, customerID: 'c00002', firstName:'Jane', lastName:'Doe'},
		{ cx: 150, cy: 250, customerID: 'c00001', firstName:'John', lastName:'Doe'}, 
		{ cx: 250, cy: 250, customerID: 'c00001', firstName:'John', lastName:'Doe'}, 
		{ cx: 700, cy: 150, customerID: 'c00003', firstName:'Scott', lastName:'Mahoney'},
		{ cx: 350, cy: 325, customerID: 'c00001', firstName:'John', lastName:'Doe'},
		{ cx: 500, cy: 450, customerID: 'c00002', firstName:'Jane', lastName:'Doe'},
		{ cx: 550, cy: 450, customerID: 'c00002', firstName:'Jane', lastName:'Doe'},
		{ cx: 580, cy: 450, customerID: 'c00002', firstName:'Jane', lastName:'Doe'},
		{ cx: 700, cy: 350, customerID: 'c00003', firstName:'Scott', lastName:'Mahoney'},
		{ cx: 450, cy: -30, customerID: 'c00002', firstName:'Jane', lastName:'Doe'},
		{ cx: 750, cy: 400, customerID: 'c00002', firstName:'Jane', lastName:'Doe'},
		{ cx: 300, cy: 400, customerID: 'c00001', firstName:'John', lastName:'Doe'}, 
		{ cx: 450, cy: -30, customerID: 'c00001', firstName:'John', lastName:'Doe'},
		{ cx: 450, cy: -30,  customerID: 'c00003', firstName:'Scott', lastName:'Mahoney'}
		
	]; // should have array of beacon Responses...

	return custMovements;

}

	function getCustomers(){
		
		var custList=[
						{customerID: 'c00001' , cx: 100, cy: 100, cxPrev: 90, cyPrev: 90, firstName:'John', lastName:'Doe', 
						beaconsInRange: [ 
											{ uuid: "000001", major: 0, minor:0, name :"ibc2", defaultRSSI: 60, lastRSSI: 0  }, 
											{ uuid: "000002", major: 0, minor:0, name :"ibc1", defaultRSSI: 60, lastRSSI: 0  }, 
											{ uuid: "000003", major: 0, minor:0, name :"ibc3", defaultRSSI: 60, lastRSSI: 0  } 
						], 
						nearestBeacons: [
											{ uuid: "000003", major: 0, minor:0, name :"ibc3", defaultRSSI: 60, lastRSSI: 0  },
											{ uuid: "000002", major: 0, minor:0, name :"ibc1", defaultRSSI: 60, lastRSSI: 0  }, 
											{ uuid: "000001", major: 0, minor:0, name :"ibc2", defaultRSSI: 60, lastRSSI: 0  } 
										],
						shoppingExperience:[]
					}, 
						{customerID: 'c00002' , cx: 300, cy: 400, cxPrev: 290, cyPrev: 390, firstName:'Jane', lastName:'Doe', 
						beaconsInRange: [ 
											{ uuid: "000001", major: 0, minor:0, name :"ibc2", defaultRSSI: 60, lastRSSI: 0  }, 
											{ uuid: "000002", major: 0, minor:0, name :"ibc1", defaultRSSI: 60, lastRSSI: 0  }, 
											{ uuid: "000003", major: 0, minor:0, name :"ibc3", defaultRSSI: 60, lastRSSI: 0  } 
						], 
						nearestBeacons: [
											{ uuid: "000003", major: 0, minor:0, name :"ibc3", defaultRSSI: 60, lastRSSI: 0  },
											{ uuid: "000002", major: 0, minor:0, name :"ibc1", defaultRSSI: 60, lastRSSI: 0  }, 
											{ uuid: "000001", major: 0, minor:0, name :"ibc2", defaultRSSI: 60, lastRSSI: 0  } 
										],
						shoppingExperience:[]
					}				
					]; 
		return custList;
	}

	function processCustomerMovementData() {
		var data = getCustomerTrackingData();
		applyCustomerMovementDataToActiveShoppingExperiences(data, getMainAreaOfInterest() ) ;
		return data;
	}
	
	// HACK !!!! UPDATE Movement data
	var  currentIdx = 0; // used for dummy positional data...


	function getCustomerTrackingData(){
		var data =  custMovementList.slice(currentIdx, currentIdx+1);

		if (currentIdx > 3)
		{
			data =  custMovementList.slice(currentIdx-2, currentIdx+1);
		}
		
		// used to populate dummy data for movements.
		currentIdx ++;
		if (currentIdx > custMovementList.length-1) {
			currentIdx =0;
		}
	

		var clonedArray = JSON.parse(JSON.stringify(data));
		return data;
		//return clonedArray;
	}

	
	//Add Customers to Active Shoppers list getMainAreaOfInterest() 
	function applyCustomerMovementDataToActiveShoppingExperiences(data, storeArea){
	
		console.log("# active shoppers before movements: " + activeShopperList.length)
		var numberCustomersInSet = data== null? 0: data.length;
		
		for (var idx=0; idx < numberCustomersInSet; idx++){
		
			if (!isActiveShopper(data[idx], activeShopperList ) && withinAreaOfInterest(data[idx], storeArea) ) {
				data[idx].startTime = new Date();
				activeShopperList.push(data[idx]);
			}
			if (!isActiveShopper(data[idx], activeShopperExperienceList ) && withinAreaOfInterest(data[idx], storeArea) ) {
				data[idx].startTime = new Date();
				data[idx].shoppingExperience = [];
				activeShopperExperienceList.push(data[idx]);
			}
			
			handleCustomerMovements(data);
	
			if (isActiveShopper(data[idx], activeShopperList ) && !withinAreaOfInterest(data[idx], storeArea) ) {
				data[idx].EndTime = new Date();
				// should update DB... with this info.
				removeCustomerFromActiveShopperList(data[idx], activeShopperList);
			}
			
			if (isActiveShopper(data[idx], activeShopperExperienceList ) && !withinAreaOfInterest(data[idx], storeArea) ) {
				data[idx].EndTime = new Date();
				// should update DB... with this info.
				removeCustomerFromActiveShopperList(data[idx], activeShopperExperienceList);
			}
		}
		console.log("# active shoppers After movements: " + activeShopperList.length)

	}
	


	function handleCustomerMovements(customer){
		var activeShopper = getActiveShopperExperienceByCustomer(customer);
		if (activeShopper == null){
			if (withinAreaOfInterest(customer, getMainAreaOfInterest())){
				activeShopper = customer;
				activeShopperExperienceList.push(customer);
			}else{
				/// May NEED to update end time...
				return;
			}

		}
		
		activeShopper.cx = customer.cx;
		activeShopper.cy = customer.cy;
		if (activeShopper.startMovementTime == null){
			activeShopper.startMovementTime = new Date();
		}
		activeShopper.lastMovementTime = new Date();
		
		
		for (var idx = 0; idx < areasOfInterestList.length; idx++){
			if (areasOfInterestList[idx].type == 'store')
				continue;
			if (withinAreaOfInterest(customer, areasOfInterestList[idx])){
				console.log(customer.firstName +' ' + customer.lastName + ' is in area: ' + areasOfInterestList[idx].name );
				if (customer.shoppingExperience == null) {
					customer.shoppingExperience = [];
				} 

				var shopExpCustomer = getActiveShopperExperienceByCustomer(customer);
				if (shopExpCustomer == null){
					var area = areasOfInterestList[idx];
					area.startTime = new Date();
					customer.shoppingExperience.push(area);
					activeShopperExperienceList.push(customer);
				}else
				{
					var area = areasOfInterestList[idx];
					area.startTime = new Date();
					if (! isAreaOfInterestInList(shopExpCustomer.shoppingExperience, areasOfInterestList[idx]))  {
						shopExpCustomer.shoppingExperience.push(area);
					}else{
						if (shopExpCustomer.shoppingExperience.length>0 && 
							shopExpCustomer.shoppingExperience[shopExpCustomer.shoppingExperience.length-1].areaOfInterestId != areasOfInterestList[idx].areaOfInterestId ){
								shopExpCustomer.shoppingExperience[shopExpCustomer.shoppingExperience.length-1].lastMovementTime = new Date();
								shopExpCustomer.shoppingExperience.push(area);
							}
						else{
							shopExpCustomer.shoppingExperience[shopExpCustomer.shoppingExperience.length-1].lastMovementTime = new Date();
						}
							
						/*
						// Update experience....
						for (ceIndx = 0; ceIndx < shopExpCustomer.shoppingExperience.length; ceIndx++){
							if (shopExpCustomer.shoppingExperience[ceIndx].areaOfInterestId == areasOfInterestList[idx].areaOfInterestId ){
							shopExpCustomer.cx = customer.cx;
							shopExpCustomer.cy = customer.cy;
							shopExpCustomer.shoppingExperience.endTime = new Date();
							}
						}
						*/
					}
				}
				
			}
		}
	
	}
	