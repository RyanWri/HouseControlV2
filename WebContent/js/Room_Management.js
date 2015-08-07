/*
	Author: ran yamin
	date 25/07/2015 
	javascript for room Management page
	Last Modification : 07/08/2015
*/

$(function() 
{
    
    $("#formShowAllRooms").validate(
    		{
    			errorPlacement: function(error, element) 
    		{
    			error.insertAfter(element);
    		} ,
    		submitHandler: function(form) 
    		{
    			var data1 = $('#formShowAllRooms').serialize();
    			$.mobile.loading("show");
    			$.ajax({
    				type: 'POST',
    				url: '/HouseControl/api/devices_group/create',
    				data: data1,
    				success: function(result)
    				{
    					$.mobile.loading("hide");
    					if (result.status === "error")
    					{
    						alert(result.data);
    					}
    					else
    					{
    						var roomName = $("#textBoxRoomName").val();
    						alert (roomName);
    					}
    				},
    				error: function()
    				{
    					$.mobile.loading("hide");
    					alert("Connection Error");
    				},
    				statusCode: {
    					400: function(){
    						$.mobile.loading("hide");
    						updateLabelLoginError("wrong username of password");
    						setTimeout( $.mobile.hidePageLoadingMsg, 2000 );
    					},
    					401: function(){
    						$.mobile.loading("hide");
    						updateLabelLoginError("Unauthorized");
    					},
    					500: function(){
    						$.mobile.loading("hide");
    						updateLabelLoginError("already logged in");
    					}
    				}
    			});

    		}
    	});
});



