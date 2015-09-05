var userid;
var userName;
var flag = 0;

$('#UpdateUser').on('pagebeforeshow', function()
{ 
	authentication(loadUpdateUserPage);
});

$(function() 
{    
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

    $.validator.addMethod("alphanumeric", function(value, element) 
    {
    	return this.optional(element) || /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/i.test(value);
    }, "Letters, numbers, spaces and underscores only please");
    
    $.validator.addMethod("positive", function(value, element) 
    {
    	return this.optional(element) || /^\w+$/i.test(value);
    }, "Positive only");
    
    
    $.validator.addMethod("integer", function(value, element) 
    {
    	return this.optional(element) || /^-?\d+$/.test(value);
    }, "Numbers only");
    
	$("#formUpdateUser").validate(
	{
		errorPlacement: function(error, element) 
		{
			error.insertAfter(element);
		},
		rules:
		{
			firstname:
			{
				required: true,
				minlength: 2,
				maxlength: 10,
				alphanumeric: true,
			},
			lastname:
			{
				required: true,
				minlength: 2,
				maxlength: 10,
				alphanumeric: true,
			},
			email:
			{
				required: true,
				maxlength: 40,
			},
			mobile:
			{
				required: true,
				maxlength: 20,
				integer: true,
				positive: true,
			}
			
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
        			MessagePopup("Success!", "Succeed to update user details");
            	}
            	else
            	{
            		flag = 1;
            		$.mobile.loading("hide");
        			MessagePopup("Error!", result.data);
            	}
            	
	            }).fail(function()
	            {
	           		flag = 0;
	           		$.mobile.loading("hide");
	       			MessagePopup("Error!", "Connection Error!");
	            });	
			} 
	});
});
    
   
function loadUpdateUserPage()
{
	if (localStorage.usertoedit === "")
	{
		window.location = "UsersManagement.html";
	}
	else
	{
    	userName = localStorage.usertoedit;
    	localStorage.usertoedit = "";
    	
    	loadUserInformation();
    	document.getElementById("UpdateUser").style.display = "inline";
	}
}


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
			MessagePopup("Error!", "Connection Error");
		},
		statusCode: 
		{
			500: function()
			{
				$.mobile.loading("hide")
				MessagePopup("Error!", "User name is not valid");;
			}
		}

	});
}

function resetUserPassword()
{
	flag = 1;
	var parameters = {};    
    parameters.userID = userID;
    var parametersStringified = JSON.stringify(parameters);
	
	$.mobile.loading("show");
	$.ajax({
		type: 'PUT',
		url: '/HouseControl/api/user/reset_password',
		data: parametersStringified,
		datatype: "json",		
		success: function(result)
		{
			$.mobile.loading("hide");
			if (result.status === "ok")
			{
				MessagePopup("Success!", "User password was set to 'password'");
			}
			else
			{
				MessagePopup("Error!", result.data);
			}
		},
		error: function()
		{
			$.mobile.loading("hide");
			MessagePopup("Error!", "Connection Error");
		},
	});
}

function MessagePopup(messageTitle, message)
{
	$("#popupMessagetext").text(messageTitle);
	$("#popupMessagesubtext").text(message);
	$("#popupMessage").click();
}
   
