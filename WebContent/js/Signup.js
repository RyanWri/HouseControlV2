var continueFlag;

$(function() 
{
	$(document).ready(function()
    {
		continueFlag = 0;
		$("#textBoxSignupUsername").val("");
		$("#textBoxSignupPassword").val("");
		$("#textBoxSignupFirstname").val("");
		$("#textBoxSignupLastname").val("");
		$("#textBoxSignupEmail").val("");
		$("#textBoxSignupMobile").val("");		
    	$("#choiceBox_SignupType").val("Admin");
    });

	$("#continuebutton").click(function()
	{
		if (continueFlag === 0)
		{
			window.location = "#";
		}
		else
		{
			window.location = "UsersManagement.html";
		}

	});
	
	$("#formSignup").validate(
	{
		errorPlacement: function(error, element) 
	{
		error.insertAfter(element);
	} ,
	submitHandler: function(form) 
	{
		var data1 = $('#formSignup').serialize();
		$.mobile.loading("show");
		$.ajax({
			type: 'POST',
			url: '/HouseControl/api/user/register',
			data: data1,
			success: function(result)
			{
				$.mobile.loading("hide");
				if (result.status === "error")
				{
					$("#popuptext").text("Failed!");
					$("#popupsubtext").text(result.data);
					$("#popupbutton").click();
				}
				else
				{
					continueFlag = 1;
					$("#popuptext").text("Success!");
					$("#popupsubtext").text("New user was created!");
					$("#popupbutton").click();
				}				

			},
			error: function()
			{
				$.mobile.loading("hide");
				alert("Connection Error");
			},
			/*statusCode: {
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
			}*/
		});

	}
});
});



