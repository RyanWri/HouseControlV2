var userName;
var userID;
var tempRoomID = "";
var listOfUserRooms = {};
var delay = 300;
var addedRoomFlag = 0;

$(function() 
{
    $(document).ready(function()
    {  	
    	if (localStorage.userrooms_userID === "")
    	{
    		window.location = "UsersManagement.html";
    	}
    	else
    	{
        	userID = localStorage.userrooms_userID;
        	userName = localStorage.userrooms_username;
        	$("#addButton").attr("disabled",true);
        	$("#userstitle").text("'"+userName+ "' Rooms:");
        	getListOfUserRooms();
    	}
    });
    
    $("#addroom").click(function()
    {
    	loadRoomsToAdd();
    });  
    
    $("#cancelButton").click(function()
    {
    	window.location = "#";
    });
    
    $("#listOfRooms").change(function()
    {
    	if ($("#listOfRooms").val() === "0")
    	{
            $("#addButton").attr("disabled",true);
    	}
    	else
    	{
    		$("#addButton").attr("disabled",false);
    	}
    });
    
    $("#addButton").click(function()
    {  	
    	addRoomToUser($("#listOfRooms").val());
    });
    
    $("#noButton").click(function()
    {
    	window.location = "#";
    });
    
    $("#yesButton").click(function()
    {
    	removeRoomFromUser();
    });
    
    $("#continueButton").click(function()
    {
    	window.location = "UserHome.html";
    });
});

function removeRoomFromUser()
{
	var formParam = "userID="+userID+"&deviceGroupID="+tempRoomID;
	$.ajax({
		type: 'DELETE',
		url: '/HouseControl/api/devices_group/remove_user',
		data: formParam,
		datatype: "json",
		success: function(result)
		{	
			if (result.status === "ok")
			{	
				window.location ="UserRooms.html";
			}
			else
			{
				errorPopup(result.data);
			}
		},
		error: function()
		{
			errorPopup("Connection Error");	
		},	
	});
}

function addRoomToUser(roomID)
{
	var formParam = "userID="+userID+"&deviceGroupID="+roomID;
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/devices_group/add_user',
		data: formParam,
		datatype: "json",
		success: function(result)
		{	
			if (result.status === "ok")
			{	
				window.location ="UserRooms.html";
			}
			else
			{
				errorPopup(result.data);
			}
		},
		error: function()
		{
			errorPopup("Connection Error");	
		},	
	});
}


function loadRoomsToAdd()
{
	$("#listOfRooms").empty();
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/devices_group/all',
		success: function(result)
		{	
			if (result.status === "ok")
			{
				var flag;
				var listOfAllRooms = result.data;
				$("#listOfRooms").append('<option value="0" selected></option>');
				for (var i = 0; i < listOfAllRooms.length; i++)
				{
					flag = false;
					for (var j = 0; j < listOfUserRooms.length; j++)
					{
						if (listOfAllRooms[i].groupID === listOfUserRooms[j].groupID)
						{
							flag = true;
						}
					}
					
					if (!flag)
					{
						$("#listOfRooms").append('<option value="'+listOfAllRooms[i].groupID+'">'+listOfAllRooms[i].name+'</option>');
					}
				}
				$("#listOfRooms").selectmenu('refresh', true);
				$("#addButton").attr("disabled",true);
			}
			else
			{
				errorPopup(result.data);
			}
		},
		error: function()
		{
			errorPopup("Connection Error");	
		},	
	});

}


function getListOfUserRooms()
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/devices_group/user_devices_groups/' + userID,
		success: function(result)
		{
			if (result.status === "ok")
			{
				listOfUserRooms = result.data;
				for (var i = 0; i < listOfUserRooms.length; i++) 
				{											
				$("#listofusers").append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true">\n\
						<li class="ui-li-has-thumb ui-first-child ui-last-child"><a id="'+listOfUserRooms[i].groupID+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="deleteRoomAccess('+listOfUserRooms[i].groupID+')">\n\
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

function deleteRoomAccess(roomID)
{
	tempRoomID = roomID;
	$("#popupConfirm").click();
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

