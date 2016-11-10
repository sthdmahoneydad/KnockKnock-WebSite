/* d3SVGManager.js */


	function renderActiveShopperList(svg){
		d3.select("#activeShopperList").append("div").text('Active Shopper List').attr("class", "activeShopperListTitle");
	}
	
	function renderActiveShopperExperienceList(svg){
		d3.select("#activeShopperExperienceList").append("div").text('Active Shopper Experience List').attr("class", "activeShopperExperienceListTitle");
	}
	
	
	
		
	function addSVGContainerToPage(divElementId){
	//"MyRoomLayoutPlaceHolder"
		var placeHolderElement = d3.select("#" + divElementId)
	
		var svg = d3.select("#" + divElementId)
		   .append("div")
		   .attr("id", "svgWrapperDiv")
		   .attr("width", "1000px")
		   .append("div")
		   .attr("class", "canvas")
		   .attr("width", "100%")
		  .append("svg")
		  .attr("id", "svgElem")


		  d3.select("#svgWrapperDiv").append("div")
		  .append("ul")
		  .attr("class", "activeShopperList")
		  .attr('id', 'activeShopperList');
		  
		  
		  d3.select("#svgWrapperDiv").append("div")
		  .append("ul")
		  .attr("class", "activeShopperExperienceList")
		  .attr('id', 'activeShopperExperienceList');
		  		  
		  
		return svg;
	} 
	
	function getSVGContainer(divElementId){
	//"MyRoomLayoutPlaceHolder"
		var svg =  d3.select("#svgElem");
		
		if (svg == null || svg[0][0] == null){
			svg = addSVGContainerToPage(divElementId);
		}
		return svg;
	}

	
	
	

	//x -> width
	// y |
	//   > height
	function trackCustomerShoppingExperience( svg, customerDataSet, areasOfInterest ) {
		console.log("Rendering Active Shopper List");
		
		var activeShopperContainer = d3.select("#activeShopperList");
		var activeShopperGroup = activeShopperContainer.selectAll("li").data(customerDataSet, 
			function(d, i ) { return d ? d.customerID : this.id  });

		var storeArea = getMainAreaOfInterest();
	
		
		// update function to add shoppers to global list for experiences....	
		activeShopperGroup.attr('test', function(d,i) {
				var myNode  = activeShopperContainer.selectAll("li").data(customerDataSet,  function(d, i ) { return d ? d.customerID : this.id  })
					myNode.text(function(d){return d.lastName +', ' + d.firstName + ' ' + d.startMovementTime.toTimeString().split(' ')[0] + ' - ' + d.lastMovementTime.toTimeString().split(' ')[0] })
			
			});			
		// Enter
		activeShopperGroup.enter().append('li')
			.attr('id', function(d){ return 'activeShopperId-' + d.customerID})
			.attr('class', 'activeShopper')
			.text(function(d){return d.lastName +', ' + d.firstName})
			.attr('test', function(d,i) {

			});
	
		// Remove
		activeShopperGroup.exit().remove()
			.attr('test', function(d,i) {
				console.log(d.lastName +', ' + d.firstName + ' has left the store');	
				activeShopperList = removeCustomerFromActiveShopperList(d, activeShopperList);

			});
	}


	//x -> width
	// y |
	//   > height
	function trackCustomerShoppingExperiences( svg, customerDataSet, areasOfInterest ) {

	console.log("Rendering Active Shopper Experience List");
		
		var activeShopperContainer = d3.select("#activeShopperExperienceList");
		var activeShopperExperienceGroup = activeShopperContainer.selectAll("li").data(customerDataSet, 
			function(d, i ) { return d ? d.customerID : this.id  });

		
		// update function to add shoppers to global list for experiences....	
			
		// Enter
		activeShopperExperienceGroup.enter().append('li')
			.attr('id', function(d){ return 'activeShopperExperienceGroupId-' + d.customerID})
			.attr('class', 'activeShopperExperience')
			.text(function(d){return d.lastName +', ' + d.firstName})
			.append('ul')
			.attr('id', function(d){ return 'ul-activeShopperExperienceGroupId-' + d.customerID})
			.attr('test', function(d,i) { 
				 
				var experienceContainer = d3.select('#ul-activeShopperExperienceGroupId-' + d.customerID);
				//experienceContainer.append('ul')
				console.log('# of experiences is: ' + d.shoppingExperience.length );
				var experienceContainerGroup = experienceContainer.selectAll("li").data(d.shoppingExperience, 
					function(d, i ) { return d ? d.areaOfInterestId : this.id  });
				
				
				experienceContainerGroup.enter().append('li')
				.attr('id', function(da){ 
				console.log('areaOfInterestId: ' + da.areaOfInterestId);
				
				
				return 'li-' + d.customerID + '-areaOfInterestId-' + da.areaOfInterestId })
				.text(function(d){return d.name});

			} );

			// Updates
		activeShopperExperienceGroup
			.attr('test', function(d,i) { 
				 
				var experienceContainer = d3.select('#ul-activeShopperExperienceGroupId-' + d.customerID);
				//experienceContainer.append('ul')

				var experienceContainerGroup = experienceContainer.selectAll("li").data(d.shoppingExperience, 
					function(d2, i ) { 
						console.log('areaOfInterestId: ' + d2.areaOfInterestId);
						return d2 ? 'li-' + d.customerID + '-areaOfInterestId-' + d2.areaOfInterestId : this.id  });
				
				experienceContainerGroup.enter().append('li')
				.attr('id', function(da){ return 'li-' + d.customerID + '-areaOfInterestId-' + da.areaOfInterestId })
				.text(function(d){return d.name});

			} );
	
	
	
		// Remove
/*
		activeShopperExperienceGroup.exit().remove()
			.attr('test', function(d,i) {
				console.log('No longer in area  ' + d.name );	
//				activeShopperList = removeCustomerFromActiveShopperList(d, activeShopperList);

			});
*/

			
	}
	
	function trackCustomersInLayout(svgContainer, data, areas){
		renderCustomersInLayout(svgContainer, data );	
	}
	