$(function() 
{
    $(document).ready(function()
    {
    	if (!localStorage.username)
    	{
    		window.location = "Login.html";
    	}
    	else
    	{
    		authenticateuser();
    		initMenu(); 
    	}
    });    
});

function moveToUsersManagement()
{
	window.location = "UsersManagement.html";
}

function moveToHomePage()
{
	window.location = "UserHome.html";
}

function initMenu()
{
	$("#menuitems").append('<li><a class="ui-link" href="#" onclick="moveToHomePage()">Home</a></li>');
	if (localStorage.type === "Admin")
	{
		$("#menuitems").append('<li><a href="#" class="ui-link" onclick="moveToUsersManagement()">Users Management</a></li>');
	}
	$("#menuitems").append('<li><a class="ui-link" href="Statistics.html">Statistics</a></li>');
	$("#menuitems").append('<li><a class="ui-link" href="Faq.html">FAQ</a></li>');
	$("#menuitems").append('<li><a class="ui-link" href="Login.html">Logout</a></li>');
}

function authenticateuser()
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/user/authenticateuser',
		success: function(result)
		{
			if (result.status === "error")
			{
				relogin();
			}
		},
		error: function()
		{
			$("#popupMessagetext").text("Error!");
			$("#popupsubtext").text("Connection Error!");
			$("#popupbutton").click();
		},	
	});
}

function relogin()
{
	var parameters = {};
	parameters.username = localStorage.username;
	parameters.password = localStorage.password
	var parametersStringified = JSON.stringify(parameters);
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/user/login',
        data: parametersStringified,
        dataType: 'json',
		success: function(result)
		{
			if (result.status === "error")
			{
				localStorage.clear();
				window.location = "Login.html";
			}
			else
			{
				var tempPassword = localStorage.password;
				localStorage.clear();
				localStorage.userID = result.data.userID;
				localStorage.username = result.data.username;
				localStorage.password = tempPassword;
				localStorage.firstname = result.data.firstname;
				localStorage.lastname = result.data.lastname;
				localStorage.type = result.data.type;
				localStorage.email = result.data.email;
				localStorage.mobile = result.data.mobile;
			}
		},
		error: function()
		{
			$("#popupMessagetext").text("Error!");
			$("#popupsubtext").text("Connection Error!");
			$("#popupbutton").click();
		},	
	});
}