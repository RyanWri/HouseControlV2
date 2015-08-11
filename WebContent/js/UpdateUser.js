// take care when user enters here from the address bar.
var userid;
var userName;
var flag = 0;

$(function() 
{
    $(document).ready(function()
    {
    	userName = localStorage.usertoedit;
    	localStorage.usertoedit = "";
    	
    	loadUserInformation();
    });
    
    $("#buttoncontinue").click(function()
    {
    	if (flag === 0)
    	{
    		window.location = "UsersManagement.html";
    	}
    	else
    	{
    		window.location = "#";
    	}
    	
    });
    
    $("#buttonresetpassword").click(function()
    {
    	resetUserPassword();
    });
    
	$("#formUpdateUser").validate(
	{
		errorPlacement: function(error, element) 
		{
			error.insertAfter(element);
		},
			submitHandler: function(form) 
			{
				var parameters = {};    
	            parameters.userID = userID;
				parameters.firstname = $("#textBoxFirstname").val();
	            parameters.lastname = $("#textBoxLastname").val();
	            parameters.email = $("#textBoxEmail").val();
	            parameters.mobile = $("#textBoxMobile").val();
	            var parametersStringified = JSON.stringify(parameters);

	            $.ajax(
	            { 
	                type: "PUT",
	            	url: "/HouseControl/api/user/update",
	                data: parametersStringified,
	                dataType: 'json'
	            }).done(function(result)
	            { 
	            	if (result.status === "ok")
	            	{
	        			flag = 0;
	            		$.mobile.loading("hide");
	            		$("#popupMessagesubtext").text("Succeed to update user details");
	        			$("#popupMessagetext").text("Success!");
	        			$("#popupMessage").click();
	            	}
	            	else
	            	{
	            		flag = 1;
	            		$.mobile.loading("hide");
	            		$("#popupMessagesubtext").text(result.data);
	        			$("#popupMessagetext").text("Error!");
	        			$("#popupMessage").click();
	            	}
	            	

	            }).fail(function()
	            {
            		flag = 0;
            		$.mobile.loading("hide");
            		$("#popupMessagesubtext").text("Connection Error!");
        			$("#popupMessagetext").text("Error!");
        			$("#popupMessage").click();	                  
	            });
				
			} 
	});
});
    
   
function loadUserInformation()
{
	$.mobile.loading("show");
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/user/' + userName,
		success: function(result)
		{
			$.mobile.loading("hide");
			$("#titleusername").text(userName);
			$("#textBoxFirstname").val(result.data.firstname);
			$("#textBoxLastname").val(result.data.lastname);
			$("#textBoxEmail").val(result.data.email);
			$("#textBoxMobile").val(result.data.mobile);
			userID = result.data.userID;
		},
		error: function()
		{
			$.mobile.loading("hide");
			$("#popupMessagetext").text("Error!");
			$("#popupMessagesubtext").text("Connection error");
			$("#popupMessage").click();
		},
		statusCode: 
		{
			500: function()
			{
				$.mobile.loading("hide");
				$("#popupMessagetext").text("Error!");
				$("#popupMessagesubtext").text("User name is not valid");
				$("#popupMessage").click();
			}
		}

	});
}

function resetUserPassword()
{
	// Should add here code for reset user password.
}
   
