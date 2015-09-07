var listOfDevices;
var globalDeviceID;
var globalAction;
var delay = 150;
var lock = 0;
var listOfDevicesID = [];
var interval;
var refreshRate = 5000;


$('#RoomControl').on('pagebeforeshow', function()
{ 
	authentication(loadRoomControlPage);		
});

function loadRoomControlPage()
{	
	$("#roomName").text(localStorage.roomcontrolName);
	loadRoomDevices();
	document.getElementById("RoomControl").style.display = "inline";
	interval = window.setInterval(intervalFunction, refreshRate);
}

function intervalFunction()
{
	//$("#listOfRoomDevices").empty();
	updateRoomDevices();
	//loadRoomDevices();
}

function loadRoomDevices()
{
	
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/devices_group/get_devices_extra/' + localStorage.roomcontrolGroupId,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			if (result.status === "ok")
			{
				var j = 0;
				for (var i = 0; i < result.data.myArrayList.length; i++)
				{
					
					if(result.data.myArrayList[i].map.port != -1)
					{
						$("#listOfRoomDevices").append('\n\
								<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-icon="false">\n\
									<li id="li-'+result.data.myArrayList[i].map.device.deviceID+'" class="ui-li-static ui-body-inherit ui-li-has-thumb">\n\
										<img src="../img/devicesTypes/'+result.data.myArrayList[i].map.device.deviceType.picData+'.png">\n\
										<h3>'+result.data.myArrayList[i].map.device.name+'<p><b>'+result.data.myArrayList[i].map.device.description+'</b></p>\n\
											<div align="right">\n\
												<div id="'+result.data.myArrayList[i].map.device.deviceID+'" class="ui-flipswitch ui-shadow-inset ui-bar-inherit ui-corner-all" onclick="changeOnOff('+result.data.myArrayList[i].map.device.deviceID+', null)">\n\
													<a class="ui-flipswitch-on ui-btn ui-shadow ui-btn-inherit">On</a>\n\
													<span class="ui-flipswitch-off">Off</span>\n\
													<input class="ui-flipswitch-input" tabindex="-1" data-role="flipswitch" name="flip-checkbox-1" type="checkbox">\n\
													</div>\n\
												<a class="ui-btn ui-btn-inline waves-effect waves-button waves-effect waves-button" onclick="loadDeviceOptions('+result.data.myArrayList[i].map.device.deviceID+')">\n\
													<i class="zmdi zmdi-alarm-add ui-shadow"></i>\n\
												</a>\n\
											</div>\n\
										</h3>\n\
									</li></ul>');
						listOfDevicesID[j] = {};
						listOfDevicesID[j].deviceID = result.data.myArrayList[i].map.device.deviceID;
						listOfDevicesID[j].exist = true;
						j++;
						changeOnOff(result.data.myArrayList[i].map.device.deviceID, result.data.myArrayList[i].map.currentPinState);
					}
				}
			}
			else
			{
				window.location = "UserHome.html";
			}
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			window.location = "UserHome.html";
		}

	});	
}

function updateRoomDevices()
{
	for (var i = 0; i < listOfDevicesID.length; i++)
	{
		listOfDevicesID[i].exist = false;
	}
	
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/devices_group/get_devices_extra/' + localStorage.roomcontrolGroupId,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			if (result.status === "ok")
			{
				
				for (var i = 0; i < result.data.myArrayList.length; i++)
				{
					if (deviceExist(result.data.myArrayList[i].map.device.deviceID))
					{
						// device exist.
						if(result.data.myArrayList[i].map.port != -1)
						{
							// device exist && should be appear. now we should check status.
							setDeviceExistStatus(result.data.myArrayList[i].map.device.deviceID, true);
							changeOnOff(result.data.myArrayList[i].map.device.deviceID, result.data.myArrayList[i].map.currentPinState);
						}
						else
						{
							// device exist && should not appear. we should remove it from the list.
						}
					}
					else
					{
						// device don't exist.
						if(result.data.myArrayList[i].map.port != -1)
						{
							// device don't exist and should appear on page.
						}
						else
						{
							// device don't exist and should no appear.
						}
					}
				}	
				
			}
			else
			{
				alert(result.data);
				window.location = "UserHome.html";
			}
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			alert("update failed to conntect");
			$.mobile.loading("hide");
			window.location = "UserHome.html";
		}

	});	
}

function setDeviceExistStatus(deviceID, flag)
{
	for (var j = 0; j < listOfDevicesID.length; j++)
	{
		if (listOfDevicesID[j].deviceID === deviceID)
		{
			listOfDevicesID[j].exist = flag;
		}
		break;
	}
}

function deviceExist(deviceID)
{
	var answer = false;
	
	for (var j = 0; j < listOfDevicesID.length; j++)
	{
		if (listOfDevicesID[j].deviceID === deviceID)
		{
			answer = true;
			break;
		}
	}
	
	return answer;
}

function loadDeviceOptions(tempDeviceID)
{
	localStorage.deviceoptionsDeviceID = tempDeviceID;
	for (var i = 0; i < listOfDevices.length; i++)
	{
		if (listOfDevices[i].deviceID === tempDeviceID)
		{
			localStorage.deviceoptionsName = listOfDevices[i].name;
		}
	}
	window.location = "DeviceOptions.html";
}
	
function changeOnOff(tempDeviceID, newstatus)
{
	if (newstatus === null)
	{		
		if (lock === 0)
		{
			clearInterval(interval);
			lock = 1;
			$('#'+tempDeviceID).addClass("ui-disabled");
			globalDeviceID = tempDeviceID;
			if ($('#'+tempDeviceID).hasClass("ui-flipswitch-active"))
			{
				globalAction = "OFF";
			}
			else
			{
				globalAction = "ON";
			}
			sendRequestToTurnOnOff();
		}
		
	}
	else
	{
		if ($('#'+tempDeviceID).hasClass("ui-flipswitch-active"))
		{
			if (newstatus === "LOW")
			{
				$('#'+tempDeviceID).removeClass("ui-flipswitch-active");
			}
		}
		else
		{
			if (newstatus === "HIGH")
			{
				$('#'+tempDeviceID).addClass("ui-flipswitch-active");
			}
		}
	}
}

function sendRequestToTurnOnOff()
{
	var actionInInt = 0;
	
	if (globalAction === "ON")
	{
		actionInInt = 1;
	}
	
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/device/relay/'+globalDeviceID+'/'+ actionInInt,
        dataType: 'json',
		success: function(result)
		{
			if (result.status === "ok")
			{
				setTimeout(
						  function() 
						  {
							   /* 
								if (globalAction === "OFF")
								{
									$('#'+globalDeviceID).removeClass("ui-flipswitch-active");
								}
								else
								{
									$('#'+globalDeviceID).addClass("ui-flipswitch-active");
								}*/
								  $('#'+globalDeviceID).removeClass("ui-disabled");
								  lock = 0;
								interval = window.setInterval(intervalFunction, refreshRate);
						  }, delay);	
				
			}
			else
			{
				alert("request to update got error");
			}
		},
		error: function()
		{
			alert("request to update connection failere");
			errorPopup("Connection Error");
		},		
	});
	
}

function errorPopup(message)
{
	window.location = "#";
	setTimeout(
			  function() 
			  {
					$("#popupMessagetext").text("Error!");
					$("#popupMessagesubtext").text(message);
					$("#popupMessage").click();
			  }, delay);	
}
