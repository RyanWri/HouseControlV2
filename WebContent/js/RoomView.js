/*
	Author: ran yamin 
	date 19/08/2015 
	javascript for room view page (Manage Devices)
	Last Modification : 01/09/2015
 */

var groupID = localStorage.tempGroupID;
var deviceNamesArray = {};

$('#RoomView').on('pagebeforeshow', function()
{ 
	authentication(loadRoomViewPage);		
});

$("#buttoncontinue").click(function()
{
	window.location= "RoomView.html";
});

function loadRoomViewPage()
{
	$("#RoomName").append(localStorage.tempGroupName);
	ShowDevicesInGroup(groupID);
	document.getElementById("RoomView").style.display = "inline";
}

function ShowDevicesInGroup(groupID)
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/devices_group/get_devices_extra/' + groupID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			if (result.status === "ok")
			{
				var deviceID, name, picData, description, port;
				for (var i = 0; i < result.data.myArrayList.length; i++)
				{
					if (result.data.myArrayList[i].map.device.state == "Active") //show device only if state is active
					{
						deviceID = result.data.myArrayList[i].map.device.deviceID;
						name = result.data.myArrayList[i].map.device.name;
						picData = result.data.myArrayList[i].map.device.deviceType.picData;
						description = result.data.myArrayList[i].map.device.description;
						port = result.data.myArrayList[i].map.port;
						$("#ListAllDevices").append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true">\n\
								<li class="ui-li-has-thumb ui-first-child ui-last-child"><a data-rel="popup" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="deviceOptionPopup('+deviceID+','+port+')" data-position-to="window" data-transition="pop">\n\
						        <img src="../img/devicesTypes/'+picData +'.png" class="button">\n\
						        <h2>'+ name +'</h2><p>'+description +'</p>\n\
						        </a></li></ul>');
					}
				}
				
				CreateRelayPortsList();
			}
			else
			{
				window.location = "UserHome.html";
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


		}); 
});	
	
	
function deviceOptionPopup(device, port)
{
	if (port !== -1)
	{
        $("#SubmitConnectButton").attr("disabled",true);
        $("#ListRelayPorts").attr("disabled",true);
        $("#ListRelayPorts").val("");
	}
	localStorage.tempDeviceID = device;
	$("#popupConnectDisconnect").click();
}

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
			
			CreateListOfDevicesToAdd();

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
		url: '/HouseControl/api/device/all_available_devices',
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			for (var i=0; i<result.data.length; i++){
				//adding option to add device to Room
				var name = result.data[i].name , deviceID = result.data[i].deviceID;
				option = '<option value="'+ deviceID +'">' + name +'</option>';
				$("#devicesToAdd").append(option);
				//only if device is not in the room you can add him
				/*if(!IsDeviceInTheRoom(name))
				{
					option = '<option value="'+ deviceID +'">' + name +'</option>';
					$("#devicesToAdd").append(option);
				}*/
			}
			
			if(i == 0)
			{
				$("#SubmitAddDevice").attr('disabled', true);
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
	},300);

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
		window.location= "RoomView.html";
	},200);

	
}

//create relay ports list for user to choose
function CreateRelayPortsList()
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device/relay/all_in_use',
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			if (result.status === "ok")
			{
				for (var portNumber = 0; portNumber < result.data.length; portNumber++)
				{
					if(result.data[portNumber] === false) //port is not in used
					{
						var option = '<option value="'+ portNumber +'">' + portNumber +'</option>';
						$("#ListRelayPorts").append(option);
					}
				}
				
				SelectMenuForDeviceType();
			}
			else
			{
				window.location = "UserHome.html";
			}
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
		}

	});
}

//validate if device is already connected
function ValidateConnectedDevice()
{
	var deviceID = localStorage.tempDeviceID;
	var relayPort = $('#ListRelayPorts :selected').val();
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device/get_relay_port/' +deviceID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			if(result.data === -1)
			{
			   connectDeviceToRelayPort(deviceID, relayPort);
			}
			else
			{
				window.location= "#";
			}	
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
		} 

	});
}

//connect device with deviceID to relay port chosen by user
function connectDeviceToRelayPort(deviceID, relayPort)
{
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/device/connect_device_to_relay/'+relayPort+'/'+deviceID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			$("#popupConnectionSuccess").click();
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			window.location = "#";
		} 

	});	
}


function DeleteDevice()
{
	var deviceID = localStorage.tempDeviceID;
	$.ajax({
		type: 'DELETE',
		url: '/HouseControl/api/device/delete_device/'+ deviceID,
		contentType: "application/json",
		dataType: 'json',
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
	},300);
}	
