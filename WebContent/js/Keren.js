var listOfDevices;
var globalGroupID;
var globalAction;
var delay = 150;
var lock = 0;

$(function() 
{
    $(document).ready(function()
    {
    	authentication(loadKerenPage);
    });
});

function loadKerenPage()
{
	$("#roomName").text(localStorage.roomcontrolName);
	loadRoomDevices();
}

function loadRoomDevices()
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/devices_group/get_devices/' + localStorage.roomcontrolGroupId,
        dataType: 'json',
		success: function(result)
		{
			listOfDevices = result.data;
			for (var i = 0; i < listOfDevices.length; i++)
			{	
				$("#listOfRoomDevices").append('\n\
							<li id="li-'+listOfDevices[i].deviceID+'" class="ui-li-static ui-body-inherit ui-li-has-thumb">\n\
								<img src="../img/devicesTypes/'+listOfDevices[i].deviceType.picData+'.png">\n\
								<h3>'+listOfDevices[i].name+'\n\
									<div align="right">\n\
										<div id="'+listOfDevices[i].deviceID+'" class="ui-flipswitch ui-shadow-inset ui-bar-inherit ui-corner-all" onclick="changeOnOff('+listOfDevices[i].deviceID+', null)">\n\
											<a class="ui-flipswitch-on ui-btn ui-shadow ui-btn-inherit">On</a>\n\
											<span class="ui-flipswitch-off">Off</span>\n\
											<input class="ui-flipswitch-input" tabindex="-1" data-role="flipswitch" name="flip-checkbox-1" type="checkbox">\n\
											</div>\n\
										<a class="ui-btn ui-btn-inline waves-effect waves-button waves-effect waves-button">\n\
											<i class="zmdi zmdi-wrench"></i>\n\
										</a>\n\
									</div>\n\
								</h3>\n\
							</li>');
					
				loadDeviceCurrentStatus(listOfDevices[i].deviceID);	
			}
		},
		error: function()
		{
			errorPopup("Connection Error");
		},	
	});
}

function loadDeviceCurrentStatus(deviceID)
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device/get_relay_port/' + deviceID,
	    dataType: 'json',
		success: function(result)
		{
			if (result.status === "ok")
			{
				if (result.data === -1)
				{
					errorPopup("Device is not connected to port");	
				}
				else
				{
					getDevicesCurrentStatus(deviceID, result.data);
				}

			}
		},
		error: function()
		{
			errorPopup("Connection Error");	
		},		
	});
}

function getDevicesCurrentStatus(tempGroupID, port)
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device/relay/'+port+'/status',
        dataType: 'json',
		success: function(result)
		{
			if (result.status === "ok")
			{
				changeOnOff(tempGroupID, result.data.map.currentPinState);
			}
		},
		error: function()
		{
			errorPopup("Connection Error");
		},		
	});
}
	
function changeOnOff(tempGroupID, newstatus)
{
	if (newstatus === null)
	{		
		if (lock === 0)
		{
			lock = 1;
			$('#'+tempGroupID).addClass("ui-disabled");
			globalGroupID = tempGroupID;
			if ($('#'+tempGroupID).hasClass("ui-flipswitch-active"))
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
		if ($('#'+tempGroupID).hasClass("ui-flipswitch-active"))
		{
			if (newstatus === "LOW")
			{
				$('#'+tempGroupID).removeClass("ui-flipswitch-active");
			}
		}
		else
		{
			if (newstatus === "HIGH")
			{
				$('#'+tempGroupID).addClass("ui-flipswitch-active");
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
		url: '/HouseControl/api/device/relay/'+globalGroupID+'/'+ actionInInt,
        dataType: 'json',
		success: function(result)
		{
			if (result.status === "ok")
			{
				setTimeout(
						  function() 
						  {
							    $('#'+globalGroupID).removeClass("ui-disabled");
								if (globalAction === "OFF")
								{
									$('#'+globalGroupID).removeClass("ui-flipswitch-active");
								}
								else
								{
									$('#'+globalGroupID).addClass("ui-flipswitch-active");
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
