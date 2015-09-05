var continueFlag;

$('#Signup').on('pagebeforeshow', function()
{ 
	authentication(loadSignupPage);
});

$(function() 
{
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
		
		$("#formSignup").validate(
		{
			errorPlacement: function(error, element) 
		{
			error.insertAfter(element);
		},
		rules:
		{
			username:
			{
				required: true,
				minlength: 2,
				maxlength: 10,
				alphanumeric: true,
			},
			password:
			{
				required: true,
				minlength: 6,
				maxlength: 10,
			},
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
			});
		}
	});
	
});

function loadSignupPage()
{
	continueFlag = 0;
	$("#textBoxSignupUsername").val("");
	$("#textBoxSignupPassword").val("");
	$("#textBoxSignupFirstname").val("");
	$("#textBoxSignupLastname").val("");
	$("#textBoxSignupEmail").val("");
	$("#textBoxSignupMobile").val("");		
	$("#choiceBox_SignupType").val("Admin");
	document.getElementById("Signup").style.display = "inline";
}


