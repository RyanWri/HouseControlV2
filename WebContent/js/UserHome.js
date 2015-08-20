var listOfUserRooms;

$(function() 
{
    $(document).ready(function()
    {
    	//loadTempAndHumidity();
    	loadUserRooms();
    });
    
    $("#buttoncontinue").click(function()
    {
    	window.location = "Login.html";
    });
});
 

function loadUserRooms()
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/devices_group/user_devices_groups/' + localStorage.userID,
		success: function(result)
		{
			if (result.status === "ok")
			{
				listOfUserRooms = result.data;
				for (var i = 0; i < listOfUserRooms.length; i++) 
				{											
				$("#listOfUserRooms").append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true">\n\
						<li class="ui-li-has-thumb ui-first-child ui-last-child"><a id="'+listOfUserRooms[i].groupID+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="enterRoom('+listOfUserRooms[i].groupID+')">\n\
				        <img src="../img/devicesGroups/'+listOfUserRooms[i].picData+'" class="button">\n\
				        <h2>'+listOfUserRooms[i].name+'</h2>\n\
				        </a></li></ul>');
				}
			}
			else
			{
				errorPopup(result.data);

			}
		},
		error: function()
		{
			errorPopup("Connection Error");					
		}
	});
}

function loadTempAndHumidity()
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device/sensor/temp_humidity',
		success: function(result)
		{
			if (result.status === "ok")
			{
				$("#currentTemp").text(result.data.map.Temp + " C");
				$("#currentHumidity").text(result.data.map.Humidity + " %");
			}
			else
			{
				errorPopup(result.data);

			}
		},
		error: function()
		{
			errorPopup("Connection Error");					
		}
	});
}

function enterRoom(groupID)
{
	localStorage.roomcontrolGroupId = groupID;
	for (var i = 0; i < listOfUserRooms.length; i++)
	{
		if (listOfUserRooms[i].groupID === groupID)
		{
			localStorage.roomcontrolName = listOfUserRooms[i].name;
		}
	}

	window.location = "RoomControl.html";
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