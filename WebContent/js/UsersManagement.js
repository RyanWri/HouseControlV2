var userID;
var userName;
var delay = 300;

$(function() 
{
    $(document).ready(function()
    {
    	$.ajax({
			type: 'GET',
			url: '/HouseControl/api/user/all',
			success: function(result)
			{
				if (result.status === "ok")
				{
					var listOfUsers = {};
					listOfUsers = result.data;
					for (var i = 0; i < listOfUsers.length; i++) 
					{
						if (i === 0)
						{
							
							$("#listofusers").append('<li class="ui-first-child"><a id="'+listOfUsers[i].userID+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="userDialog('+"'"+listOfUsers[i].username+"',"+listOfUsers[i].userID+')">'+listOfUsers[i].username+'</a></li>');
						}
						else if (i === (listOfUsers.length - 1))
						{
							$("#listofusers").append('<li class="ui-last-child"><a id="'+listOfUsers[i].userID+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="userDialog('+"'"+listOfUsers[i].username+"',"+listOfUsers[i].userID+')">'+listOfUsers[i].username+'</a></li>');
						}
						else
						{
							$("#listofusers").append('<li><a id="'+listOfUsers[i].userID+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="userDialog('+"'"+listOfUsers[i].username+"',"+listOfUsers[i].userID+')">'+listOfUsers[i].username+'</li>');
						}
					}
				}
			},
			error: function()
			{
				alert("error!");						
			}
    	});
    });
    
    
    $("#addnewuser").click(function()
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
	});
});

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
