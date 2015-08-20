/*
	Author: ran yamin
	date 19/08/2015 
	javascript for room view page (Manage Devices)
	Last Modification : --
 */
a
var groupID = localStorage.tempGroupID; //or you need to get it from local storage
var deviceNamesArray =[];

$(document).ready(function()
			{
				ShowRoomName(groupID);
				ShowDevicesInGroup(groupID); //update all devices
				CreateListOfDevicesToAdd();
			});


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
			alert(xhr.status);
			alert(thrownError);
			return "Error getting name";
		}

	});


}
	


//	List All Devices
	function ShowDevicesInGroup( groupID)
	{
		var deviceID, name;
		$.ajax({
			type: 'GET',
			url: '/HouseControl/api/devices_group/get_devices/' + groupID,
			contentType: "application/json",
			dataType: 'json',
			success: function(result)
			{
				for (var i=0; i<result.data.length; i++){
					deviceID = result.data[i].deviceID;  name = result.data[i].name;
					var contentDevice='<li><a href="#connect_disconnect" class="ui-btn" data-rel="popup" onclick="addconnectionToPopup('+deviceID+ ')'; 
					contentDevice += ' data-position-to="window" data-transition="pop" >'+name+'</a></li>';
					$("#ListAllDevices").append(contentDevice);
					
					deviceNamesArray[i]= name; //create list of names all devices in the room
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
	
	
	//when add device form is submit -> create device on server
	$("#formCreateDevice").submit( function()
		{
		var parameters = {}; //name, description, deviceType:{typeID} ,connectionType, Voltage
		parameters.name = $('#deviceName').val();
		parameters.description = $('#description').val();
		var deviceType = $('#devices :selected').text();
		var typeid= new Object(); typeid.typeID = getTypeIDByName(deviceType);
		parameters.deviceType = typeid;
		parameters.connectionType = 'Relay';
		parameters.voltage = $('#deviceVoltage').val(); 
		var parametersStringified = JSON.stringify(parameters);
		
		alert(parametersStringified);
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
					alert("device was created");
					location.reload();
            		$.mobile.loading("hide");
            	}
            	else
            	{
            		$.mobile.loading("hide");
            		alert("error");
            	}
			},
			error: function(xhr, ajaxOptions, thrownError)
			{
				alert(xhr.status);
				alert(thrownError); 
			}


		}); });	
	
	
	//get typeID by the name of the device
	function getTypeIDByName(name) {
		switch(name)
		{
		case "LAMP": return 2;
		case "TV": return 3;
		case "Kettle": return 4;
		case "Water Heater": return 5;
		case "Air Conditioner": return 6;
		default: return 1; //undefined
		}
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
			alert(xhr.status);
			alert(thrownError); 
		}

	});

}


function AddDeviceToRoom()
{
	var deviceID = $('#devicesToAdd :selected').val();
	var name = $('#devicesToAdd :selected').text();
	var dataString = 'deviceID='+deviceID +'&deviceGroupID='+ groupID;
	alert(dataString);
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
			location.reload();
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}
	});

}
	


function connectDeviceToRelayPort(deviceID)
{
	var relayPort = FindOpenPortRelay();
	if (relayPort <= 4)
		{
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/device/connect_device_to_relay/'+RelayPort+'/'+deviceID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			alert('Device'+ deviceID +'is connected to port' + RelayPort);
			$.mobile.loading("hide");
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		} 

	}); } //we found available port
	
	else
		{
		alert("No available port on relay || All ports are taken");
		}
	
}

function DisconnectDeviceFromRelayPort(deviceID)
{
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/device/disconnect_device/'+deviceID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			alert('Device'+ deviceID +'has been disconnected from port');
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
	

function FindOpenPortRelay()
{
	for( var portNumber=0; portNumber<4; i++)
		{
			if( RunPortTest(portNumber) >=0)
				return  RunPortTest(portNumber);
		}
	
	return portNumber; //4 means no one is available
}

function RunPortTest(portNumber)
{
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/device/relay/'+ portNumber +'/status/',
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			if(result.data.portState === 'Disbled')
				return portNumber;
			
			else return -1;
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError);
			return -2;
		}

	});

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


//add methods to connect/disconnect popup
function addconnectionToPopup (deviceID)
{
	$('#connectDevice').onclick = connectDeviceToRelayPort(deviceID);
	$('#disconnectDevice').onclick= DisconnectDeviceFromRelayPort(deviceID);
	
}