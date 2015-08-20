/*
	Author: ran yamin
	date 19/08/2015 
	javascript for room view page (Manage Devices)
	Last Modification : --
 */


var groupID = localStorage.tempGroupID;//or you need to get it from local storage
var deviceNamesArray =[];

$(document).ready(function()
			{
				SelectMenuForDeviceType();
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
					image = result.data[i].deviceType.picData;
					var contentDevice='<li><a href="#connect_disconnect" class="ui-btn" data-rel="popup" onclick="addconnectionToPopup('+deviceID+ ') data-position-to="window" data-transition="pop" >';
					contentDevice += MakeImage(image);
					contentDevice += name+'</a></li>';
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
		var typeid= new Object(); typeid.typeID = $('#devicesTypes :selected').val();;
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
			alert(xhr.status);
			alert(thrownError); 
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


//add device image to links
function MakeImage(image)
{
	var divImage = '<img src="../img/devicesTypes/' + image+'.png" class="ui-thumbnail ui-thumbnail-circular">'; 
	return divImage;
}

