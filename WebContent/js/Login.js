$(function() 
{
    $(document).ready(function()
    {
    	if (!localStorage.username)
		{
    		$("#textBoxLoginUsername").val("");
    		$("#textBoxLoginPassword").val("");
		}
    	else
    	{
    		window.location = "UserHome.html"
    	}
    });
	    
    $("#formUserLogin").validate(
    		{
    			errorPlacement: function(error, element) 
    		{
    			error.insertAfter(element);
    		} ,
    		submitHandler: function(form) 
    		{
    			var data1 = $('#formUserLogin').serialize();
    			$.mobile.loading("show");
    			$.ajax({
    				type: 'POST',
    				url: '/HouseControl/api/user/login',
    				data: data1,
    				success: function(result)
    				{
    					$.mobile.loading("hide");
    					if (result.status === "error")
    					{
    						$("#popupsubtext").text(result.data);
    						$("#popupbutton").click();
    					}
    					else
    					{
    						localStorage.clear();
    						localStorage.userID = result.data.userID;
    						localStorage.username = result.data.username;
    						localStorage.password = $("#textBoxLoginPassword").val();
    						localStorage.firstname = result.data.firstname;
    						localStorage.lastname = result.data.lastname;
    						localStorage.type = result.data.type;
    						localStorage.email = result.data.email;
    						localStorage.mobile = result.data.mobile;
    						window.location = "UserHome.html"	
    					}
    				},
    				error: function()
    				{
    					$.mobile.loading("hide");
						$("#popupsubtext").text("Connection Error!");
						$("#popupbutton").click();
    				},	
    			});

    		}
    	});
    
    $("#continuebutton").click(function()
    {
    	window.location = "#";
    });
});



