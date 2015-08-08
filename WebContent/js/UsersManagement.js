var userName;

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
							$("#listofusers").append('<li class="ui-first-child"><a id="'+listOfUsers[i].username+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="userDialog('+"'"+listOfUsers[i].username+"'"+')">'+listOfUsers[i].username+'</a></li>');
						}
						else if (i === (listOfUsers.length - 1))
						{
							$("#listofusers").append('<li class="ui-last-child"><a id="'+listOfUsers[i].username+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="userDialog('+"'"+listOfUsers[i].username+"'"+')">'+listOfUsers[i].username+'</a></li>');
						}
						else
						{
							$("#listofusers").append('<li><a id="'+listOfUsers[i].username+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="userDialog('+"'"+listOfUsers[i].username+"'"+')">'+listOfUsers[i].username+'</li>');
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
    
	$("#deleteuserbutton").click(function()
	{
	//	window.location = "#";
		//$("#popupbuttonconformdelete").click();
		var url1 = '/HouseControl/api/user/' + userName;
		$.ajax({
			type: 'GET',
			url: url1,
			success: function(result)
			{
				if (result.status === "ok")
				{
					deleteUser(result.data.userID);
				}
				//// take care of the else case
			},
			error: function()
			{
				alert("error!");
			}
    	});
	});
});

function deleteUser(ID)
{
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
			// take care
		},
		error: function()
		{
			alert("error!");
		}
	});
}


function userDialog(username)
{
	userName = username;
	$("#popupsubtext").text(username);
	$("#popupbutton").click();
}

//
