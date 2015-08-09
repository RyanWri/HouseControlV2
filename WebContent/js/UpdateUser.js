// take care when user enters here from the address bar.

var userName;

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
    	window.location = "UsersManagement.html";
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
			$("#textBoxFirstname").val(result.data.firstname);
			$("#textBoxLastname").val(result.data.lastname);
			$("#textBoxEmail").val(result.data.email);
			$("#textBoxMobile").val(result.data.mobile);			
		},
		error: function()
		{
			$.mobile.loading("hide");
			$("#popupErrorsubtext").text("Connection error");
			$("#popupError").click();
		},
		statusCode: 
		{
			500: function()
			{
				$.mobile.loading("hide");
				$("#popupErrorsubtext").text("User name is not valid");
				$("#popupError").click();
			}
		}

	});
}
   
