// RoomLayoutManager.js

	var areasOfInterestList =getAreasOfInterest();
  
  	var physicalObjectList = getPhysicalObjectsForRoom();
	var roomDimensions = function() {var dim = { width : 20, height : 10}; return dim; }();
  
	var pxPerFoot = function() {var pixelPerFoot = 50; return pixelPerFoot;}();
	var pxBuffer = 200;
	var pxOffset = pxBuffer / 2;

  
	
	function getPhysicalObjectsForRoom() {
		var physObjList = [
			{ physicalObjectId: 'p00001', name:'Front Door', type: 'wall', shape:'rect', 'x':450, 'y':0, width:100, height:10, excludesOtherObjects:'Y' },
			{ physicalObjectId: 'p00002', name:'Windows Phones', type: 'shelf', shape:'rect', 'x':75, 'y':75, width:100, height:150, excludesOtherObjects:'N' },
			{ physicalObjectId: 'p00003', name:'Android Phones', type: 'shelf', shape:'rect', 'x':225, 'y':75, width:100, height:150, excludesOtherObjects:'N' },
			{ physicalObjectId: 'p00004', name:'iPhones', type: 'shelf', shape:'rect', 'x':375, 'y':75, width:100, height:150, excludesOtherObjects:'N' },
			{ physicalObjectId: 'p00005', name:'Phone Accessories', type: 'shelf', shape:'rect', 'x':550, 'y':275, width:100, height:175, excludesOtherObjects:'Y' },
			{ physicalObjectId: 'p00010', name:'Car Accessories', type: 'shelf', shape:'rect', 'x':700, 'y':275, width:100, height:175, excludesOtherObjects:'Y' },
			{ physicalObjectId: 'p00009', name:'Smart Home Acc', type: 'shelf', shape:'rect', 'x':850, 'y':275, width:100, height:175, excludesOtherObjects:'Y' },
			{ physicalObjectId: 'p00006', name:'Windows Tablets', type: 'counter', shape:'circle', 'cx':75, 'cy':400, r:60, excludesOtherObjects:'Y' },
			{ physicalObjectId: 'p00007', name:'Samsung Tablets', type: 'counter', shape:'circle', 'cx':225, 'cy':400, r:60, excludesOtherObjects:'Y' },
			{ physicalObjectId: 'p00008', name:'iPad Tablets', type: 'counter', shape:'circle', 'cx':375, 'cy':400, r:60, excludesOtherObjects:'Y' },
			{ physicalObjectId: 'p00011', name:'Checkout Counter', type: 'counter', shape:'rect', 'x':600, 'y':25, width:300, height:60, excludesOtherObjects:'Y' },
			{ physicalObjectId: 'p00012', name:'FIOS TV', type: 'display', shape:'rect', 'x':975, 'y':100, width:25, height:125, excludesOtherObjects:'Y' },
		];
	
		return physObjList;
	}






  function buildRoomDimensions(rm, px){ 
	var layoutDim = {	
		pixelWidth: rm.width * px, 
		pixelHeight: rm.height * px, 
		width: rm.width  , 
		height: rm.height  , 
		
		signalBeacons: [
			{ uuid: "000001", major: 0, minor:0, name :"ibc2", defaultRSSI: 60, lastRSSI: 0, cx: rm.width * px / 2 , cy: 0 * px }, 
			{ uuid: "000002", major: 0, minor:0, name :"ibc1", defaultRSSI: 60, lastRSSI: 0, cx: 0 * px, cy: rm.height * px  }, 
			{ uuid: "000003", major: 0, minor:0, name :"ibc3", defaultRSSI: 60, lastRSSI: 0, cx: rm.width * px , cy: rm.height * px } 
			] }; 
	return layoutDim; 
	}(roomDimensions, pxPerFoot);


	
	function addRoomToSVGContainer(svgContainer, rm, pxBuf){
		
			svgContainer.attr("width", rm.pixelWidth + pxBuf)
			svgContainer.attr("height", rm.pixelHeight + pxBuf);
	
	}

	function renderFloorLayout ( rm, px) {   
		var floorLayout = d3.select("svg")
		  .append("g")
		  .attr('transform', 'translate(' + px+', '+px+')')
		  .append('rect')
		  .attr("width",rm.pixelWidth)
		  .attr("height",rm.pixelHeight); 
		  
		  
		d3.select("svg").append('text')
						.attr('transform', 'translate(' + px+', '+px+')')
						.attr('id', 'rmWdithLabel')
						.attr('style', 'font-weight:bold;width: 100px')
						.attr('x', (rm.pixelWidth -100 ) /2  + 'px')
						.attr('y',  - 25 + 'px')
						.text( 'Room Width(ft) : ' + rm.width);

		d3.select("svg").append('text')
						.attr('transform', 'translate(' + px+', '+px+')')
						.attr('transform','rotate( -90, ' + 75 + ', ' +  ((rm.pixelHeight - 100 ) /2 )  +')') 
						.attr('id', 'rmHeightLabel')
						.attr('style', 'font-weight:bold;width: 100px')
						.attr('x', -(rm.pixelHeight /2) + 100 + 'px')
						.attr('y', 100 + px + 'px')
						.text( 'Room Height(ft) : ' + rm.height);
						
						
	  
		var areasOfInterestGroup = function() {
			var grp = d3.select("svg")
					.append('g')
					.attr('id', 'areasOfInterestGroup')
					.attr('transform', 'translate(' + pxOffset +', '+pxOffset+')')
			return grp;
		}();

		var physicalObjectGroup = function() {
			var grp = d3.select("svg")
					.append('g')
					.attr('id', 'physicalObjectGroup')
					.attr('transform', 'translate(' + pxOffset +', '+pxOffset+')')
			return grp;
		}();
		
		var customersGroup = function() {
			var grp = d3.select("svg")
					.append('g')
					.attr('id', 'customerGroup')
					.attr('transform', 'translate(' + pxOffset +', '+pxOffset+')')
			return grp;
		}();

		

		
		
	}  

	
		// Render Beacons
	function renderBeaconsForLayout(rm, px){ 

		var container = d3.select("svg");
		var bg = function(container) {
			var grp = container.append('g')
								.attr('id','beaconGroup')
								.attr('transform', 'translate(' + px+', '+px+')')
			return grp;
		}(container);

		var beaconGroup = bg.selectAll("circle").data(rm.signalBeacons , 
			function(d, i ) { return d ? "B-" + d.uuid : this.id  });

		// Enter
		beaconGroup.enter().append('circle')
			.attr('cx', function(d){ return d.cx; })
			.attr('cy', function(d){ return d.cy; })
			.attr('id', function(d) { return  "B-" + d.uuid;})
			.attr('class', 'beacon')
			.attr('test', function(d,i) {
			// Enter 
			pulse( "B-" +d.uuid);
			console.log('Initial ENTER -> Beacon ID : B-' + d.uuid + 'updating cx position to: ', d.cx  + ' cy position to : ' + d.cy)
			});		
	
		// Update
		beaconGroup.transition().duration(1000)
			.attr('cx', function(d){ return d.cx; })
			.attr('cy', function(d){ return d.cy; })
			.attr('id', function(d) { return "B-" + d.uuid; })
			.attr('class', 'beacon')
			.attr('test', function(d, i) {
			  pulse( "B-" +d.uuid);
			  console.log('update-> Beacon UUID: B-' + d.uuid + 'updating cx position to: ' +  d.cx  + ' cy position to : ' + d.cy);
			});
		

					

		function pulse(beaconId) {
			var bg = d3.select("#beaconGroup");
			var circle = bg.select("#" + beaconId);
			(function repeat() {
				circle = circle.transition()
					.duration(2000)
					.attr('stroke-width', .25)
					.attr("r", 2)
					.transition()
					.duration(2000)
					.attr('stroke-width', 0.1)
					.attr("r", 10)
					.ease('sine')
					.each("end", repeat)
			})();
		}
		
		
		

	/* 
	 * Attach a context menu to a beacon
	 */

		contextMenuShowing = false;

		bg.selectAll("circle").on('click', function (d, i) {
			d3.event.preventDefault();
			if (contextMenuShowing) {
				d3.select('.popup').remove();
			} else {
				popup = d3.select('.canvas')
					.append('div')
					.attr('class', 'popup')
					.style('left', event.pageX + 'px')
					.style('top', event.pageY + 'px');
				popup.append('h2').text(d.name);
				popup.append('p').text('UUID: ' + d.uuid )
				popup.append('p').text('Major:  ' + d.major )
				popup.append('p').text('Minor:  ' + d.minor )
				popup.append('p').text('RSSI Strength: ' + d.defaultRSSI)
				popup.append('p')
				.append('a')
				.attr('href','http://www.knockknockretail.com' )
				.text(d.name);
			}
			contextMenuShowing = !contextMenuShowing;
		});
		

	}

	function renderPhysicalObjectsInLayout(svgContainer, physicalObjectData){
		console.log("Rendering Objects in Floor Layout...");
		
		var container = d3.select("#physicalObjectGroup");
		var myRectData = physicalObjectData.filter(function(d){return d.shape === 'rect'});
		var physicalRectGroup = container.selectAll("rect").data( myRectData, 
			function(d, i ) { return d ? d.physicalObjectId : this.id  })
			//.filter(function(d){return d.type === 'rect'})
			;

		var myCircleData = physicalObjectData.filter(function(d){return d.shape === 'circle'});
		
		var physicalCircleGroup = container.selectAll("circle").data(myCircleData , 
			function(d, i ) { return d ? d.physicalObjectId : this.id  })			;			
 
			
		// Enter - create grouping for object/text to show
		var physGroup = physicalRectGroup.enter()
			.append('g')
			.attr('id', function(d) { return "grp-" + d.physicalObjectId;});
	
			physGroup.append('rect')
			.attr('id', function(d) { return d.physicalObjectId;})
			.attr('class', 'physicalObject')
			.attr('test', function(d,i) {
				// Enter called 2 times only
				console.log('Initial ENTER -> PhysObjectID: ' + d.physicalObjectId + 'updating x position to: ', d.x  + ' y position to : ' + d.y)}
			)
			.attr('x', function(d){ return d.x; })
			.attr('y', function(d){ return d.y; })
			.attr('height', function(d) { return d.height;})
			.attr('width', function(d) { return d.width; });

			
		// need to know length of text use it for calc offset(not just 75px)
			physGroup.append('text')
			.attr('style', 'font-weight:normal;width: 100px')
			.attr('width', function(d) { return 75; })
			.attr('x', function(d) { return d.x }) 
			.attr('y', function(d) { return (d.width< 75 && d.height>=75) ?d.y + d.height: d.y  }) 
			.attr('transform',  function(d){ return (d.width< 75 && d.height>=75) ? 'rotate(270,' + d.x +',' + (parseFloat(d.y) + parseFloat(d.height)) + ')': '' } )
			.text( function(d) { return d.name});	
			
		// Update
		// Not dynamic list, don't think we need update here...
			
			
		// now Draw Shapes for circles....
			
		physGroup = physicalCircleGroup.enter() 
			.append('g')
			.attr('id', function(d) { return "grp-" + d.physicalObjectId;});
	
			physGroup.append('circle')
			.attr('id', function(d) { return d.physicalObjectId;})
			.attr('class', 'physicalObject')
			.attr('test', function(d,i) {
				// Enter called 2 times only
				console.log('Initial ENTER -> PhysObjectID: ' + d.physicalObjectId + 'updating x position to: ', d.x  + ' y position to : ' + d.y)}
			)

			//.style("fill", "red")
			.attr("r", function(d) { return d.r; })
			.attr("cx", function(d) { return d.cx; })
			.attr("cy", function(d) { return d.cy; })

				// need to know length of text use it for calc offset(not just 75px)
			physGroup.append('text')
			.attr('style', 'font-weight:normal;width: 100px')
			.attr('width', function(d) { return 75; })
			.attr('x', function(d) { return d.cx - 75/2 }) 
			.attr('y', function(d) { return d.cy  }) 
			.text( function(d) { return d.name})
			;	
			

			
			
	}
	
	
	function renderAreasOfInterestInLayout(svgContainer, areaOfInterestObjectData){
		console.log("Rendering Objects in Floor Layout...");
		
		var container = d3.select("#areasOfInterestGroup");
		var myRectData = areaOfInterestObjectData.filter(function(d){return d.shape === 'rect'});
		var areaOfInterestRectGroup = container.selectAll("rect").data( myRectData, 
			function(d, i ) { return d ? d.areaOfInterestId : this.id  })
			//.filter(function(d){return d.type === 'rect'})
			;

		var myCircleData = areaOfInterestObjectData.filter(function(d){return d.shape === 'circle'});
		
		var areaOfInterestCircleGroup = container.selectAll("circle").data(myCircleData , 
			function(d, i ) { return d ? d.areaOfInterestId : this.id  })			;			
 
			
		// Enter - create grouping for object/text to show
		var areaOfInteresetGroup = areaOfInterestRectGroup.enter()
			.append('g')
			.attr('id', function(d) { return "grp-" + d.areaOfInterestId;});
	
			areaOfInteresetGroup.append('rect')
			.attr('id', function(d) { return d.areaOfInterestId;})
			.attr('class', 'areaOfInterest')
			.attr('test', function(d,i) {
				// Enter called 2 times only
				console.log('Initial ENTER -> PhysObjectID: ' + d.areaOfInterestId + 'updating x position to: ', d.x  + ' y position to : ' + d.y)
				}
			)
			.attr('x', function(d){ return d.x; })
			.attr('y', function(d){ return d.y; })
			.attr('height', function(d) { return d.height;})
			.attr('width', function(d) { return d.width; });

			
		// need to know length of text use it for calc offset(not just 75px)
			areaOfInteresetGroup.append('text')
			.attr('style', 'font-weight:normal;width: 100px')
			.attr('width', function(d) { return 75; })
			.attr('x', function(d) { return d.x }) 
			.attr('y', function(d) { return (d.width< 75 && d.height>=75) ?d.y + d.height: d.y  }) 
			.attr('transform',  function(d){ return (d.width< 75 && d.height>=75) ? 'rotate(270,' + d.x +',' + d.y + d.height + ')': '' } )
			.text( function(d) { return d.name});	
			
		// Update
		// Not dynamic list, don't think we need update here...
			
			
		// now Draw Shapes for circles....
			
		areaOfInteresetGroup = areaOfInterestCircleGroup.enter() 
			.append('g')
			.attr('id', function(d) { return "grp-" + d.areaOfInterestId;});
	
			areaOfInteresetGroup.append('circle')
			.attr('id', function(d) { return d.areaOfInterestId;})
			.attr('class', 'areaOfInterest')
			.attr('test', function(d,i) {
				// Enter called 2 times only
				console.log('Initial ENTER -> PhysObjectID: ' + d.areaOfInterestId + 'updating x position to: ', d.x  + ' y position to : ' + d.y)}
			)


			.attr("r", function(d) { return d.r; })
			.attr("cx", function(d) { return d.cx; })
			.attr("cy", function(d) { return d.cy; })

				// need to know length of text use it for calc offset(not just 75px)
			areaOfInteresetGroup.append('text')
			.attr('style', 'font-weight:normal;width: 100px')
			.attr('width', function(d) { return 75; })
			.attr('x', function(d) { return d.cx - 75/2 }) 
			.attr('y', function(d) { return d.cy  }) 
			.text( function(d) { return d.name})
			;	
		
	}

	
	//x -> width
	// y |
	//   > height
	function renderCustomersInLayout( svg, customerData ) {
		console.log("Rendering Customers in Floor Layout...");
		
		var container = d3.select("#customerGroup");
		var custGroup = container.selectAll("circle").data(customerData , 
			function(d, i ) { return d ? d.customerID : this.id  });

			
		// Enter
		custGroup.enter().append('circle')
			.attr('cx', function(d){ return d.cx; })
			.attr('cy', function(d){ return d.cy; })
			.attr('id', function(d) { return d.cutomerID;})
			.attr('class', 'customer')
			
			.attr('checkForAreasOfInterest', function(d,i) {
				console.log('checkForAreasOfInterest - Initial ENTER -> CustID: ' + d.customerID + 'updating cx position to: ', d.cx  + ' cy position to : ' + d.cy)
				handleCustomerMovements(d);
			});		
	
	
		// Update
		custGroup.transition().duration(1000)
			.attr('cx', function(d){ return d.cx; })
			.attr('cy', function(d){ return d.cy; })
			.attr('id', function(d) { return d.customerID;})
			.attr('class', 'customer')
			.attr('test', function(d, i) {
			  // update every data change
			  console.log('update-> CustID: ' + d.customerID + 'updating cx position to: ' +  d.cx  + ' cy position to : ' + d.cy)
			});


		container.selectAll("circle").on('click', function (d, i) {
			d3.event.preventDefault();
			if (contextMenuShowing) {
				d3.select('.popup').remove();
			} else {
				popup = d3.select('.canvas')
					.append('div')
					.attr('class', 'popup')
					.style('left', event.pageX + 'px')
					.style('top', event.pageY + 'px');
				popup.append('h2').text(d.customerID);
				popup.append('p').text('Name: ' + d.firstName + ' ' + d.lastName )
				popup.append('p').text('cx: ' + d.cx )
				popup.append('p').text('cy:  ' + d.cy )
				popup.append('p')
				.append('a')
				.attr('href','http://www.knockknockretail.com/customer/' + d.customerID )
				.text(d.customerID);
			}
			contextMenuShowing = !contextMenuShowing;
		});
			
		// Remove
		custGroup.exit().remove();
		
	}
	
	function getMainAreaOfInterest(){
		var storeArea ;
		// var extract storeAreaOfInterest	
		for (var aIdx =0; aIdx< areasOfInterestList.length; aIdx++) {
			if (areasOfInterestList[aIdx].type == "store" ) {
				storeArea = areasOfInterestList[aIdx];
				break;
			}
		}
		return storeArea;
	}

	function getAreasOfInterest(){
		var areasOfInterest =  [
			{ areaOfInterestId: 'a00000', type:'store', name:'Store Layout',  shape:'rect', 'x':0, 'y':0, width:1000, height:500, excludesOtherObjects:'N' },
			{ areaOfInterestId: 'a00001', type:'department', name:'SmartPhones Department',  shape:'rect', 'x':37, 'y':37, width:475, height:225, excludesOtherObjects:'N' },
			{ areaOfInterestId: 'a00002', type:'department', name:'Tablets Department',  shape:'rect', 'x':0, 'y':325, width:475, height:150, excludesOtherObjects:'N' },
			{ areaOfInterestId: 'a00003', type:'department', name:'Internet/Home',    shape:'rect', 'x':825, 'y':100, width:150, height:125, excludesOtherObjects:'N' },
			{ areaOfInterestId: 'a00004', type:'department', name:'Gadgets/Accessories',  shape:'rect', 'x':525, 'y':250, width:475, height:225, excludesOtherObjects:'N' }
			

		];
		return areasOfInterest;
	}
	
	
	function withinAreaOfInterest(customer, areaOfInterest){
		var result = false;
		
		if (areaOfInterest.shape == 'circle')
		{
			var radius = areaOfInterest.r;
			
			var d = Math.pow(radius,2) - ( Math.pow((areaOfInterest.cx - customer.cx), 2) + Math.pow((areaOfInterest.cy - customer.cy), 2) );

			if ( d > 0)
			  result = true;
			else if(d==0)
			  result = true;
			else
			  result =  false;
		}
		else {
	
			var cx = Math.max(Math.min(customer.cx, areaOfInterest.x + areaOfInterest.width ), areaOfInterest.x);
			var cy = Math.max(Math.min(customer.cy, areaOfInterest.y + areaOfInterest.height), areaOfInterest.y);
			var result =  Math.sqrt( (customer.cx-cx)*(customer.cx-cx) + (customer.cy-cy)*(customer.cy-cy) )<= 0;
		}
		return result;
		
	}
	
	function isAreaOfInterestInList(list, areaOfInterest){
		var found = false;
		for (var idx =0; idx< list.length; idx++){
			if (list[idx].areaOfInterestId == areaOfInterest.areaOfInterestId){
				found = true;
				break;
			}
		}
		return found;
	}
	
	
	function renderRoomLayout(svgContainerForPage ) {
		// determine layout based on customer's / reporting beacons
		var rmLayout = buildRoomDimensions(roomDimensions, pxPerFoot);

		// Create SVG Container
		 
		addRoomToSVGContainer(svgContainerForPage, rmLayout, pxBuffer)
		
		// Render Floor layout as basic rectangle for now
		renderFloorLayout( rmLayout, pxOffset);
		renderAreasOfInterestInLayout(svgContainerForPage, areasOfInterestList);
		
		renderPhysicalObjectsInLayout(svgContainerForPage, physicalObjectList);
		
		renderBeaconsForLayout(rmLayout, pxOffset);
		
	}
	
	


	
	
	