$(function() 
{
    $(document).ready(function()
    {
    	if (!localStorage.username)
		{
        	$("#textBoxLoginServerIP").val("");
    		$("#textBoxLoginUsername").val("");
    		$("#textBoxLoginPassword").val("");
		}
    	else
    	{
    		window.location = "../index.html"
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
    						alert(result.data);
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
    						window.location = "../index.html"	
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



