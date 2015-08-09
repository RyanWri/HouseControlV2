/*
	Author: ran yamin
	date 25/07/2015 
	javascript for room Management page
	Last Modification : 07/08/2015
 */


// when add room form is submit -> create room on server and display the room for user with GUI
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
			alert(result.data.groupID);
			appendRoom(result.data.groupID, roomName);
			$.mobile.loading("hide");
			
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


// adding room to html with id="groupID"  
function appendRoom(groupID,roomName)
{
	createPagePopup(groupID,roomName);
	var addRoomText = '<a href="#'+groupID+'" data-rel="popup" class="ui-btn ui-btn-inline ui-corner-all">';
	addRoomText += roomName + "</a><br>";
	$('#ActualRooms').append(addRoomText);
}

//create dialog with id="groupId" and title="roomName"
function createPagePopup(groupID, roomName) {

    //set whatever content you want to put into the new page
	var content = '<div data-role="popup" id="'+groupID +'" class="ui-content">';
	content += '<div data-role="header"><h1>'+ roomName +'</h1><a href="#" data-rel="back" class="ui-btn-left ui-btn ui-icon-back ui-btn-icon-notext ui-shadow ui-corner-all"  data-role="button" role="button">Back</a>';
	content += '</div><div data-role="main" class="ui-content">	<form id="formAddDeviceToRoom">';
    content += '<fieldset class="ui-field-contain"><label>Select Device</label> <select name="type"id="deviceType" data-native-menu="false">';
    content += '<option value="">Lamp</option><option value="">Tv</option><option value="">Air Conditioner</option><option value="">Water Heater</option>';
	content += '</select></fieldset><input type="submit" data-inline="true" value="Submit"></form>';
	content += '</div><button onclick="removeRoom('+groupID+')">remove room</button></div>';
	$('#Room_Management').append(content);
}



//when you add device to room -> get DeviceID -> connect DeviceID with GroupID
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

//Remove room from gui and from Server according to groupID
function removeRoom(groupID)
{
	alert("in function");
	$.ajax({
	  type: 'DELETE',
	  url: '/HouseControl/api/devices_group/delete/'+groupID,
	  contentType: "application/json",
	  dataType: 'json',
	  success: function(result)
	  {
		  alert(this);
	  },
	  
	  error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}
		
	});

}


//List All Rooms
function ShowAllRooms()
{
	alert("in function");
	$.ajax({
	  type: 'GET',
	  url: '/HouseControl/api/devices_group/all',
	  contentType: "application/json",
	  dataType: 'json',
	  success: function(result)
	  {
		  for (var i=0; i<result.data.length; i++){
	      	  var appendText = "<li>"+ result.data[i].name +"</li>"; //add 
	      	  $("#ListAllRooms").append( appendText);
		  }

	  },
	  
	  error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}
		
	});
}



//Get devices in room by groupID
function getDevicesInRoom(groupID)
{
	alert("in function getDevicesInRoom");
	$.ajax({
	  type: 'GET',
	  url: '/HouseControl/api/devices_group/get_devices/'+groupID,
	  contentType: "application/json",
	  dataType: 'json',
	  success: function(result)
	  {
		  for (var i=0; i<result.data.length; i++){
	      	  //var appendText = "<li>"+ result.data[i].name +"</li>"; //add 
	      	  alert(result.data[i].name );
		  }

	  },
	  
	  error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}
		
	});

}

//remove device with DeviceId from room="groupID"
function removeDeviceFromRoom(DeviceID, groupID)
{
	var parameters = {};
	parameters.deviceID = deviceID;
	parameters.groupID = groupID;
	var parametersStringified = JSON.stringify(parameters);
	alert("in function removeDeviceFromRoom");
	$.ajax({
	  type: 'DELETE',
	  url: '/HouseControl/api/devices_group/remove_device/',
	  data: parametersStringified,
	  dataType: 'json',
	  success: function(result)
	  {
		  alert (result.status);

	  },
	  
	  error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}
		
	});
	
}
