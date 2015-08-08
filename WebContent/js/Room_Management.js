/*
	Author: ran yamin
	date 25/07/2015 
	javascript for room Management page
	Last Modification : 07/08/2015
 */


$("#formShowAllRooms").submit( function()
		{
	var parameters = {};
	var roomName = $('#textBoxRoomName').val();
	parameters.name = roomName;
	var parametersStringified = JSON.stringify(parameters);
	$.mobile.loading("show");
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/devices_group/create',
		data: parametersStringified,
		dataType: "json",
		success: function(result)
		{
			appendRoom(roomName);
			$.mobile.loading("hide");
			alert(result.status);
			
		},
		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}


	});

		}
);


/* refresh page and show all current rooms*/    
$(document).on("pageload",function(){
	$("#ListAllRooms").append("<b>Appended text</b>");
});

function appendRoom(roomName)
{
	var appendText = "<li id=\"" + roomName +"\"><h1>"+ roomName +"</h1></li>";
	var addDeviceText = "<a id=\"" + roomName +"\" href=\"#EditRoom\" data-rel=\"popup\" class=\"ui-btn ui-btn-inline ui-corner-all\">"
	addDeviceText += roomName + "</a>";
	$("#ListAllRooms").append( appendText);
	$("#ActualRooms").append( addDeviceText);
	$("#EditRoomTitle").append(roomName);
}

