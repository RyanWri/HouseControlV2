$(function() 
{
	$(document).ready(function()
    {
    	$("#textBoxSignupUsername").val("");
		$("#textBoxSignupPassword").val("");
		$("#textBoxSignupFirstname").val("");
		$("#textBoxSignupLastname").val("");
		$("#textBoxSignupEmail").val("");
		$("#textBoxSignupMobile").val("");		
    	$("#choiceBox_SignupType").val("Admin");
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

					alert(result.data);
				}
				else
				{
					alert("good");
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



