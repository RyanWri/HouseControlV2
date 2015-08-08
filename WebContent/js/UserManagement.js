$(function() 
{
    $(document).ready(function()
    {
    	$.ajax({
			type: 'GET',
			url: '/HouseControl/api/user/all',
			success: function(result)
			{
				if (result.status === "ok")
				{
					var listOfUsers = {};
					listOfUsers = result.data;
					for (var i = 0; i < listOfUsers.length; i++) 
					{
						if (i === 0)
						{
							$("#listofusers").append('<li class="ui-first-child"><a id="'+listOfUsers[i].username+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r " href="#">'+listOfUsers[i].username+'</a></li>');
						}
						else if (i === (listOfUsers.length - 1))
						{
							$("#listofusers").append('<li class="ui-last-child"><a id="'+listOfUsers[i].username+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r " href="#">'+listOfUsers[i].username+'</a></li>');
						}
						else
						{
							$("#listofusers").append('<li><a id="'+listOfUsers[i].username+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r " href="#"</a>'+listOfUsers[i].username+'</li>');
						}
					}
				}
			},
			error: function()
			{
				alert("error!");
			}
    	});
    });
    
    $("#addnewuser").click(function()
    {
    	window.location = "Signup.html";
    });
    
});



