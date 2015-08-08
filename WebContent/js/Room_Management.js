/*
	Author: ran yamin
	date 25/07/2015 
	javascript for room Management page
	Last Modification : 07/08/2015
 */


$("#formAddRoom").submit( function()
		{
	var parameters = {};
	var roomName = $('#textBoxRoomName').val();
	parameters.name = roomName;
	var parametersStringified = JSON.stringify(parameters);
	$.mobile.loading("show");
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/devices_group/create',
		data: parametersStringified,
		dataType: "json",
		success: function(result)
		{
			alert(result.data);
			appendRoom(roomName);
			$.mobile.loading("hide");
			alert(result.status);
			
		},
		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}


	});

		}
);

// adding room to html within id="ActualRooms" 
function appendRoom(roomName)
{
	var addRoomText = "<a id=\"" + roomName +"\" href=\"#EditRoomPopup\" data-rel=\"popup\" class=\"ui-btn ui-btn-inline ui-corner-all\">";
	addRoomText += roomName + "</a>";
	$("#ActualRooms").append(addRoomText);
	$("#EditRoomTitle").append(roomName);
	create_page(roomName);
}


function ShowAllRooms()
{
	$.ajax({
	  type: 'GET',
	  url: '/HouseControl/api/devices_group/all',
	  contentType: "application/json",
	  dataType: 'json',
	  success: function(result)
	  {
		  alert(result);
	  },
	  
	  error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}
		
	});
	
	var appendText = "<li><h3>roomName</h3></li>";
	$("#ListAllRooms").append( appendText);
}

function create_page(page_id) {

    //set whatever content you want to put into the new page
    var content = '<div data-role="header">';
    content += '<h1 id="EditRoomTitle"></h1> <a href="#" data-rel="back" class="ui-btn-left ui-btn ui-icon-back ui-btn-icon-notext ui-shadow ui-corner-all"  data-role="button" role="button">Back</a>';
    content += '</div><div data-role="main" class="ui-content"><form id="formAddDeviceToRoom"> <fieldset class="ui-field-contain">';
    content +='<label>Select Device</label> <select name="type" id="deviceType" data-native-menu="false"><option value="">Lamp</option>';
    content += '<option value="">Tv</option><option value="">Air Conditioner</option><option value="">Water Heater</option>';
	content +=	'</select></fieldset><input type="submit" data-inline="true" value="Submit"></form></div>';

    //append the new page onto the end of the body
    $('#Rooms').append('<div data-role="page" id="' + page_id + '">'+ content + '</div>');

    //initialize the new page 
    $.mobile.initializePage();

    //navigate to the new page
    $.mobile.changePage("#"+page_id, "pop", false, true);

    //add a link on the home screen to navaigate to the new page (just so nav isn't broken if user goes from new page to home screen)
    $('#Room_Management div[data-role="main"]').append('<br><br><a href="#' + page_id + '" data-ajax="false">go to ' + page_id + ' page</a>');

    //refresh the home screen so new link is given proper css
    //$('#Room_Management div[data-role="content"]').page();
}



//add device to room
$("#formAddDeviceToRoom").submit( function()
	{
	var parameters = {};
	var deviceSelected = $("#deviceType option:selected").text();
	parameters.deviceID = deviceSelected;
	var parametersStringified = JSON.stringify(parameters);
	$.mobile.loading("show");
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/devices_group/add_device',
		data: parametersStringified,
		dataType: "json",
		success: function(result)
		{
			alert(deviceSelected);
			$.mobile.loading("hide");
			alert(result.status);
			
		},
		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}


	});

	}
);


function removeRoom()
{
	

}