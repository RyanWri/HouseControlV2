// add GlobalFunctions to html file
// add popup when error occurred on ajax requests on this page.
// disable comments on 'ready' functions.
var userName;
var userID;
var tempRoomID = "";
var listOfUserRooms = {};

$(function() 
{
    $(document).ready(function()
    {  	
    	userID = localStorage.userrooms_userID;
    	userName = localStorage.userrooms_username;
    	//localStorage.userrooms_userID = "";
    	//localStorage.userrooms_userName = "";
    	$("#addButton").attr("disabled",true);
    	$("#userstitle").text("'"+userName+ "' Accessible Rooms:");
    	getListOfUserRooms();
    });
    
    $("#addroom").click(function()
    {
    	loadRoomsToAdd();
    	$("#popupbutton").click();
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
    
    $("yesButton").click(function()
    {
    	removeRoomFromUser();
    });
    
});

function removeRoomFromUser()
{
	var parameters = {};
	parameters.deviceGroupID = tempRoomID;
	parameters.userID = userID;
	var parametersStringified = JSON.stringify(parameters);
	$.ajax({
		type: 'DELETE',
		url: '/HouseControl/api/devices_group/remove_user',
		data: parametersStringified,
		datatype: "json",
		success: function(result)
		{	
			if (result.status === "ok")
			{	
				window.location ="UserRooms.html";
			}
			else
			{
				// update to popup.
				alert(result.data);
			}
		},
		error: function()
		{
			// update to popup.
			alert("connection error");
		},	
	});
}

function addRoomToUser(roomID)
{
	
	var parameters = {};
	parameters.deviceGroupID = roomID;
	parameters.userID = userID;
	var parametersStringified = JSON.stringify(parameters);
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/devices_group/add_user',
		data: parametersStringified,
		datatype: "json",
		success: function(result)
		{	
			if (result.status === "ok")
			{	
				window.location ="UserRooms.html";
			}
			else
			{
				// update to popup.
				alert(result.data);
			}
		},
		error: function()
		{
			// update to popup.
			alert("connection error");
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
			}
			else
			{
				// update to popup.
				alert("failed in here!");
			}
		},
		error: function()
		{
			// update to popup.
			alert("connection error");
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
						<li class="ui-li-has-thumb ui-first-child ui-last-child"><a id="'+listOfUserRooms[i].groupID+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="deleteRoomAcces('+listOfUserRooms[i].groupID+')">\n\
				        <img src="../img/'+listOfUserRooms[i].picData+'" class="button">\n\
				        <h2>'+listOfUserRooms[i].name+'</h2>\n\
				        </a></li></ul>');
				}
			}
		},
		error: function()
		{
			alert("error!");						
		}
	});
}

function deleteRoomAcces(roomID)
{
	tempRoomID = roomID;
	$("#popupConfirm").click();
}

