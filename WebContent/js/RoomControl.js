var listOfDevices;
var globalDeviceID;
var globalAction;
var delay = 150;
var lock = 0;


$('#RoomControl').on('pagebeforeshow', function()
{ 
	authentication(loadRoomControlPage);		
});

function loadRoomControlPage()
{
	$("#roomName").text(localStorage.roomcontrolName);
	loadRoomDevices();
	document.getElementById("RoomControl").style.display = "inline";
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
		}

	});	
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
							    $('#'+globalDeviceID).removeClass("ui-disabled");
								if (globalAction === "OFF")
								{
									$('#'+globalDeviceID).removeClass("ui-flipswitch-active");
								}
								else
								{
									$('#'+globalDeviceID).addClass("ui-flipswitch-active");
								}
								lock = 0;
						  }, delay);	
				
			}
		},
		error: function()
		{
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
