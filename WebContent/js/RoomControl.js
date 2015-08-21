var listOfDevices;

$(function() 
{
    $(document).ready(function()
    {
    	$("#roomName").text(localStorage.roomcontrolName);
    	loadRoomDevices();
    	//loadDevicesCurrentStatus();
    });
});

function loadRoomDevices()
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/devices_group/get_devices/' + localStorage.roomcontrolGroupId,
        dataType: 'json',
		success: function(result)
		{
			if (result.status === "ok")
			{
				listOfDevices = result.data;
				for (var i = 0; i < listOfDevices.length; i++)
				{
					
					$("#listOfRoomDevices").append('\n\
							<li class="ui-li-static ui-body-inherit ui-li-has-thumb">\n\
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
					loadDevicesCurrentStatus(listOfDevices[i].deviceID);
					
				}
				
			}
		},
		error: function()
		{
			
		},	
	});
}

function loadDevicesCurrentStatus(deviceID)
{
	//for (var i = 0; i < listOfDevices.length; i++)
	//{
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
						// devices is not connected to server.
					}
					else
					{
						getDevicesCurrentStatus(deviceID, result.data);
					}

				}
			},
			error: function()
			{
				
			},		
		});
	//}
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
			
		},		
	});
}
	
function changeOnOff(tempGroupID, newstatus)
{
	if (newstatus === null)
	{		
		if ($('#'+tempGroupID).hasClass("ui-flipswitch-active"))
		{
			$('#'+tempGroupID).removeClass("ui-flipswitch-active");
		}
		else
		{
			$('#'+tempGroupID).addClass("ui-flipswitch-active");
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