var userName;
var userID;

$(function() 
{
    $(document).ready(function()
    {  	
    	userID = localStorage.userrooms_userID;
    	userName = localStorage.userrooms_username;
    	//localStorage.userrooms_userID = "";
    	//localStorage.userrooms_userName = "";
    	$("#userstitle").text("'"+userName+ "' Accessible Rooms:");
    	getListOfUserRooms();   
    });
    
    
   /* $("#addnewuser").click(function()
    {
    	window.location = "Signup.html";
    });  
    
    $("#edituserbutton").click(function()
    {  	
    	localStorage.usertoedit = userName;
    	window.location = "UpdateUser.html";
    });
   
    
    
	$("#deleteuserbutton").click(function()
	{	
		window.location = "#";
		setTimeout(
				  function() 
				  {
					  $("#popupConform").click();
				  }, 300);
	});
	
	$("#buttonyes").click(function()
	{
		deleteUser(userID);
	});
	
	$("#buttonno").click(function()
	{
		window.location = "#";
	});
	
	$("#buttoncontinue").click(function()
	{
		window.location = "#";
	});*/
});


function getListOfUserRooms()
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/devices_group/user_devices_groups/' + userID,
		success: function(result)
		{
			if (result.status === "ok")
			{
				var listOfRooms = {};
				listOfRooms = result.data;
				for (var i = 0; i < listOfRooms.length; i++) 
				{											
				$("#listofusers").append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true">\n\
						<li class="ui-li-has-thumb ui-first-child ui-last-child"><a id="'+listOfRooms[i].groupID+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r">\n\
				        <img src="../img/'+listOfRooms[i].picData+'" class="button">\n\
				        <h2>'+listOfRooms[i].name+'</h2>\n\
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

/*
function deleteUser(ID)
{
	window.location = "#";
	var url1 = '/HouseControl/api/user/delete/' + ID;
	$.ajax({
		type: 'DELETE',
		url: url1,
		success: function(result)
		{
			if (result.status === "ok")
			{
				window.location = "UsersManagement.html";
			}
			else
			{
				errorDialog(result.data);
			}
		},
		error: function()
		{
			errorDialog("Connection Error!");
		}
	});
}

function errorDialog(errorText)
{
	$("#popupMessagetext").text("Error!");
	$("#popupMessagesubtext").text(errorText);
	setTimeout(
			  function() 
			  {
				  $("#popupMessage").click();
			  }, delay);
}


function userDialog(username, userid)
{
	userID = userid;
	userName = username;
	$("#popupsubtext").text(username);
	$("#popupbutton").click();
}
*/