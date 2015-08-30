/*
	Author: ran yamin 
	date 19/08/2015 
	javascript for room view page (Manage Devices)
	Last Modification : 30/08/2015
 */


var groupID = localStorage.tempGroupID;
var deviceNamesArray =[];

$(document).ready(function()
{
	authentication(loadRoomViewPage);			
});

function loadRoomViewPage()
{
	SelectMenuForDeviceType();
	ShowRoomName(groupID);
	ShowDevicesInGroup(groupID); //update all devices
	CreateRelayPortsList();
	setTimeout( function() {
		CreateListOfDevicesToAdd();
	},900);
}


function ShowRoomName(groupID)
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/devices_group/get_group/' + groupID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			$("#RoomName").append(result.data.name);

		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			return "Error getting name";
		}

	});


}
	


//	List All Devices
	function ShowDevicesInGroup( groupID)
	{
		var deviceID, name, image;
		$.ajax({
			type: 'GET',
			url: '/HouseControl/api/devices_group/get_devices/' + groupID,
			contentType: "application/json",
			dataType: 'json',
			success: function(result)
			{
				for (var i=0; i<result.data.length; i++){
					deviceID = result.data[i].deviceID;  name = result.data[i].name;
					picData = result.data[i].deviceType.picData;
					
					$("#ListAllDevices").append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true">\n\
							<li class="ui-li-has-thumb ui-first-child ui-last-child"><a href="#connect_disconnect" data-rel="popup" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="sendDeviceID('+deviceID+')" data-position-to="window" data-transition="pop">\n\
					        <img src="../img/devicesTypes/'+picData +'.png" class="button">\n\
					        <h2>'+ name+'</h2>\n\
					        </a></li></ul>');
					
					deviceNamesArray[i]= name; //create list of names all devices in the room
				}

			},

			error: function(xhr, ajaxOptions, thrownError)
			{
				$.mobile.loading("hide");
			}

		});
		
		
	}
	
	
	//when add device form is submit -> create device on server
	$("#formCreateDevice").submit( function()
		{
		var parameters = {}; //name, description, deviceType:{typeID} ,connectionType, Voltage
		parameters.name = $('#deviceName').val();
		parameters.description = $('#description').val();
		var typeid= new Object(); typeid.typeID = $('#devicesTypes :selected').val();;
		parameters.deviceType = typeid;
		parameters.connectionType = 'Relay';
		parameters.voltage = $('#deviceVoltage').val(); 
		var parametersStringified = JSON.stringify(parameters);
		
		$.ajax({
			type: 'POST',
			url: '/HouseControl/api/device/create',
			data: parametersStringified,
			dataType: "json",
			contentType: 'application/json',
			success: function(result)
			{
				if (result.status === "ok")
            	{
					window.location = "RoomView.html";
            		$.mobile.loading("hide");
            	}
            	else
            	{
            		$.mobile.loading("hide");
            	}
			},
			error: function(xhr, ajaxOptions, thrownError)
			{
				$.mobile.loading("hide");
			}


		}); });	
		
function SelectMenuForDeviceType()
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device_type/all',
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			for (var i=0; i<result.data.length; i++){
				//adding option to add device to Room
				var name = result.data[i].name , typeID = result.data[i].typeID;
				//only if device is not in the room you can add him
				var option = '<option value="'+ typeID +'">' + name +'</option>';
				$("#devicesTypes").append(option);
			}

		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
		}

	});

}
	
	
function CreateListOfDevicesToAdd()
{
	var option;
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device/all',
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			for (var i=0; i<result.data.length; i++){
				//adding option to add device to Room
				var name = result.data[i].name , deviceID = result.data[i].deviceID;
				//only if device is not in the room you can add him
				if(!IsDeviceInTheRoom(name))
				{
					option = '<option value="'+ deviceID +'">' + name +'</option>';
					$("#devicesToAdd").append(option);
				}
			}

		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
		}

	});

}


function AddDeviceToRoom()
{
	var deviceID = $('#devicesToAdd :selected').val();
	var name = $('#devicesToAdd :selected').text();
	var dataString = 'deviceID='+deviceID +'&deviceGroupID='+ groupID;
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/devices_group/add_device',
		contentType: "application/json",
		dataType: 'json',
		data: dataString ,
		success: function(result)
		{
			var contentDevice='<li><a href="#'+deviceID +'" class="ui-btn">'+name+'</a></li>';
			$("#ListAllDevices").append(contentDevice);
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
		}
	});
	
	setTimeout( function() {
		location.reload();
	},200);


}
	

//check if device name is in the deviceNamesArray if so return true else false
function IsDeviceInTheRoom(name)
{
	var flag = false;
	for (var i=0; i< deviceNamesArray.length; i++)
	{
		if(deviceNamesArray[i] === name)
			return true; //name exist
	}
	
	return flag;
}


function removeDevice()
{
	var deviceID = localStorage.tempDeviceID;
	DisconnectDeviceFromRelayPort();
	var dataRemove= "deviceID="+ deviceID + "&deviceGroupID=" + groupID;
	$.ajax({
		type: 'DELETE',
		url: '/HouseControl/api/devices_group/remove_device',
		contentType: "application/json",
		dataType: 'json',
		data: dataRemove,
		success: function(result)
		{
			$.mobile.loading("show");
		},
		
		error: function()
		{
			$.mobile.loading("hide");
			errorPopup("Connection Error");
		}
	});
	
	setTimeout( function() {
		location.reload();
	},200);

	
}	

function DisconnectDeviceFromRelayPort()
{
	var deviceID = localStorage.tempDeviceID;
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/device/disconnect_device/'+deviceID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			$.mobile.loading("hide");
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
		}

	});
	
	setTimeout( function() {
		location.reload();
	},200);

	
}

function sendDeviceID( device)
{
	localStorage.tempDeviceID = device; 
}
	
//connect device with deviceID to relay port chosen by user
function connectDeviceToRelayPort()
{
	var deviceID = localStorage.tempDeviceID;
	var relayPort = $('#ListRelayPorts :selected').val();
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/device/connect_device_to_relay/'+relayPort+'/'+deviceID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			$.mobile.loading("hide");
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
		} 

	});
	
	setTimeout( function() {
		location.reload();
	},200);
}


//create relay ports list for user to choose
function CreateRelayPortsList()
{
	for( var portNumber=0; portNumber<29; portNumber++)
	{
		RunPortTest(portNumber);
	}

}

function RunPortTest(portNumber)
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device/relay/'+ portNumber +'/inUse/',
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			if(result.data == false) //port is not in used
			{
				var option = '<option value="'+ portNumber +'">' + portNumber +'</option>';
				$("#ListRelayPorts").append(option);
			}
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
		}

	});

}

