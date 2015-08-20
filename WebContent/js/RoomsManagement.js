var flag = 0;
var delay = 300;
var tempGroupID;

$(document).ready(function()
{
	$("#btnAddNewRoom").attr("disabled",true);
	ShowAllRooms();
});
	
$("#addNewRoomButton").click(function()
{
	
	loadRoomTypes();
	$("#popupAddNewRoom").click();
});


$("#buttoncontinue").click(function()
{
	window.location = "#";    	    	
});
  
$("#buttonyes").click(function()		
{
	removeRoom()

});


$("#buttonno").click(function()
{
	window.location = "#";
});

$("#editroombutton").click(function()
{
	localStorage.tempGroupID = tempGroupID;
	window.location = "RoomView.html";
});

$("#deleteroombutton").click(function()
{
	window.location = "#";
    setTimeout(
    		function() 
    		{
    			$("#popupConfirm").click();
    		}, delay);	
});

$("#listOfRoomsTypes").change(function()
	    {
	    	if ($("#listOfRoomsTypes").val() === "0")
	    	{
	            $("#btnAddNewRoom").attr("disabled",true);
	    	}
	    	else
	    	{
	    		$("#btnAddNewRoom").attr("disabled",false);
	    	}
	    });


$("#formAddRoom").submit( function()
{
	var parameters = {};
    var roomName = $('#textBoxRoomName').val();
    parameters.name = roomName;
    parameters.picData = $('#listOfRoomsTypes').val() + ".png";
    var parametersStringified = JSON.stringify(parameters);
    $.ajax({
    	type: 'POST',
    	url: '/HouseControl/api/devices_group/create',
    	data: parametersStringified,
    	dataType: "json",
    	success: function(result)
    	{
    		if (result.status === "ok")
    		{
	    		$.mobile.loading("hide");
	    		window.location = "RoomsManagement.html";

    		 }
    		 else
    		 {
    		     $.mobile.loading("hide");
    		     errorPopup(result.data);
    		 }
    	},
    	error: function()
    	{
    		errorPopup("Connection Error");
    	}
    });
});

function loadRoomTypes()
{
	$("#listOfRoomsTypes").append('<option value="Bathroom">Bathroom</option>');
	$("#listOfRoomsTypes").append('<option value="Bedroom">Bedroom</option>');
	$("#listOfRoomsTypes").append('<option value="ClosetRoom">Closet Room</option>');
	$("#listOfRoomsTypes").append('<option value="DinningRoom">Dinning Room</option>');
	$("#listOfRoomsTypes").append('<option value="Garden">Garden</option>');
	$("#listOfRoomsTypes").append('<option value="Kitchen">Kitchen</option>');
	$("#listOfRoomsTypes").append('<option value="LivingRoom">Living Room</option>');
	$("#listOfRoomsTypes").append('<option value="PerentsBedroom">Perents Bedroom</option>');
	$("#listOfRoomsTypes").append('<option value="Toilet">Toilet Room</option>');
	$("#listOfRoomsTypes").append('<option value="TVRoom">TV Room</option>');
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

function ShowAllRooms()
{
	 $.ajax({
		 type: 'GET',
		 url: '/HouseControl/api/devices_group/all',
		 contentType: "application/json",
		 dataType: 'json',
		 success: function(result)
		 {
			 if (result.status === "ok")
			 {	 
				 for (var i = 0; i < result.data.length; i++)
				 {
					 $("#listofrooms").append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true">\n\
								<li class="ui-li-has-thumb ui-first-child ui-last-child"><a id="'+result.data[i].groupID+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="houseRoomOptions('+result.data[i].groupID+')">\n\
						        <img src="../img/devicesGroups/'+result.data[i].picData+'" class="button">\n\
						        <h2>'+result.data[i].name+'</h2>\n\
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
  
function houseRoomOptions(groupID)
{
	tempGroupID = groupID;
	$("#popupbutton").click();
}

function removeRoom()
{
	$.ajax({
		type: 'DELETE',
		url: '/HouseControl/api/devices_group/delete/' + tempGroupID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			location.reload();
		},
		error: function()
		{
			$.mobile.loading("hide");
			errorPopup("Connection Error");
		}
	});
}	