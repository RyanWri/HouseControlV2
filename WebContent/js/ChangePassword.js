var flag = 0;

$(function() 
{
    $(document).ready(function()
    {
    	if (!localStorage.userID)
		{
    		window.location = "UserHome.html";
		}
    });
    
    $("#formChangePassword").validate(
    {
    	errorPlacement: function(error, element) 
	    {
    		error.insertAfter(element);
	    },
	    rules:
		{
	    	oldpassword:
			{
				required: true,
				minlength: 6
			},
			newpassword:
			{
				required: true,
				minlength: 6
			},
			confirmnewpassword:
			{
				required: true,
				minlength: 6,
				equalTo: "#textBoxNewPassword"
			},
			
		},
		messages:
		{
			confirmnewpassword:
			{
				equalTo: "Please enter the same password as above"
			},
		},
    	submitHandler: function(form) 
    	{
    		if ($("#textBoxNewPassword").val() !== $("#textBoxConfirmNewPassword").val())
    		{
    			showPopup("Error!", "Passwords don't match");  				
    		}
    		else
    		{
    			changePassword();
    		}
    	}
    });
    
    $("#buttoncontinue").click(function()
    {
    	if (flag === 0)
    	{
    		window.location = "#";	
    	}
    	else
    	{
    		window.location = "UserHome.html";
    	}
    });
});

function changePassword()
{
	var parameters = {};
	parameters.userID = localStorage.userID;
	parameters.oldPassword = $("#textBoxOldPassword").val();
	parameters.newPassword = $("#textBoxNewPassword").val();
	var parametersStringified = JSON.stringify(parameters);
	$.mobile.loading("show");
	$.ajax({
		type: 'PUT',
		url: '/HouseControl/api/user/change_password',
        data: parametersStringified,
        dataType: 'json',
		success: function(result)
		{
			$.mobile.loading("hide");
			if (result.status === "error")
			{
				showPopup("Error!", result.data);
			}
			else
			{
				flag = 1;
				localStorage.password = $("#textBoxNewPassword").val();
				showPopup("Success!", "User password was changed");
			}
		},
		error: function()
		{
			$.mobile.loading("hide");
			showPopup("Error!", "Connection Error!");
		},	
	});	
}

function showPopup(titleText, subtitleText)
{
	$("#popupMessagetext").text(titleText);
	$("#popupMessagesubtext").text(subtitleText);
	$("#popupMessage").click();
}

