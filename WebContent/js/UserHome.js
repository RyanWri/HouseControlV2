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
    	}
    });
    
    $("#buttoncontinue").click(function()
    {
    	window.location = "Login.html";
    });
});
    
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