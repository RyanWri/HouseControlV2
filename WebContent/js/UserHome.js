$(function() 
{
    $(document).ready(function()
    {
    	authenticateuser();
    	/*if (!localStorage.username)
    	{
    		window.location = "Login.html";
    	}
    	else
    	{
    		authenticateuser();
    	}*/
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
			alert("what?");
			/*$.mobile.loading("hide");
			$("#popupsubtext").text("Connection Error!");
			$("#popupbutton").click();*/
		},	
	});
}

function relogin()
{
	alert("should relogin now!");
}