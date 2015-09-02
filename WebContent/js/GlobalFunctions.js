var globalPageToLoad; 

function authentication(pageToLoad)
{
	globalPageToLoad = pageToLoad;
	
	if (!localStorage.username)
	{
		window.location = "Login.html";
		//setTimeout(function(){document.location.href = "Login.html;"},10);
	}
	else
	{
		authenticateuser();
	}
}

function authenticateuser()
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/user/authenticateuser',
		success: function(result)
		{
			if (result.status === "error")
			{
				relogin();
			}
			else
			{
				loadPage();
			}
		},
		error: function()
		{
			$("#popupMessagetext").text("Error!");
			$("#popupsubtext").text("Connection Error!");
			$("#popupbutton").click();
		},	
	});
}


function relogin()
{
	var parameters = {};
	parameters.username = localStorage.username;
	parameters.password = localStorage.password
	var parametersStringified = JSON.stringify(parameters);
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/user/login',
        data: parametersStringified,
        dataType: 'json',
		success: function(result)
		{
			if (result.status === "error")
			{
				localStorage.clear();
				window.location = "Login.html";
			}
			else
			{
				var tempPassword = localStorage.password;
				localStorage.clear();
				localStorage.userID = result.data.userID;
				localStorage.username = result.data.username;
				localStorage.password = tempPassword;
				localStorage.firstname = result.data.firstname;
				localStorage.lastname = result.data.lastname;
				localStorage.type = result.data.type;
				localStorage.email = result.data.email;
				localStorage.mobile = result.data.mobile;
				loadPage();
			}
		},
		error: function()
		{
			$("#popupMessagetext").text("Error!");
			$("#popupsubtext").text("Connection Error!");
			$("#popupbutton").click();
		},	
	});
}

function loadPage()
{
	initMenu();
	globalPageToLoad();
}

function moveToUsersManagement()
{
	window.location = "UsersManagement.html";
}

function moveToHomePage()
{
	window.location = "UserHome.html";
}

function moveToChangePassword()
{
	window.location = "ChangePassword.html";
}

function moveToRoomsManagement()
{
	window.location = "RoomsManagement.html";
}

function logout()
{
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/user/logout',
		success: function(result)
		{
			if (result.status === "ok")
			{
				localStorage.clear();
			}
			window.location = "Login.html";
			return false;

		},
		error: function()
		{
			window.location ="#";
			return false;
		},	
	});
}

function initMenu()
{
	$("#menuUsername").text(localStorage.username);
	$("#menuitems").append('<li class="ui-first-child"><a class="ui-btn ui-corner-all ui-shadow" data-icon="false" data-ajax="false" href="UserHome.html"> <i class="zmdi zmdi-home zmd-fw"></i> Home</a></li>');
	if (localStorage.type === "Admin")
	{
		$("#menuitems").append('<li><a class="ui-btn ui-corner-all ui-shadow" data-icon="false" data-ajax="false" href="UsersManagement.html"> <i class="zmdi zmdi-accounts zmd-fw"></i> Users Management</a></li>');
		$("#menuitems").append('<li><a class="ui-btn ui-corner-all ui-shadow" data-icon="false" data-ajax="false" href="RoomsManagement.html"> <i class="zmdi zmdi-local-store zmd-fw"></i> Rooms Management</a></li>');
	}
	
	$("#menuitems").append('<li><a class="ui-btn ui-corner-all ui-shadow" data-icon="false" data-ajax="false" href="Statistics.html"> <i class="zmdi zmdi-chart-donut zmd-fw"></i> Statistics</a></li>');
	$("#menuitems").append('<li><a class="ui-btn ui-corner-all ui-shadow" data-icon="false" data-ajax="false" href="ChangePassword.html"> <i class="zmdi zmdi-key zmd-fw"></i> Change Password</a></li>');
	$("#menuitems").append('<li><a class="ui-btn ui-corner-all ui-shadow" data-icon="false" data-ajax="false" href="Faq.html"> <i class="zmdi zmdi-help zmd-fw"></i> FAQ</a></li>');
	$("#menuitems").append('<li><a class="ui-btn ui-corner-all ui-shadow" data-icon="false" data-ajax="false" href="#" onclick="logout()"> <i class="zmdi zmdi-power-off zmd-fw"></i> Logout</a></li>');
	$("#menuitems").append('<li> <img id="Logo" class="nd2-card card-media-right card-media-medium card-media" src="../img/logo.jpg" alt="Our Logo"></li>');
	/*$("#menuitems").append('<div><a class="ui-link" href="#" onclick="moveToHomePage()">Home</a></div>');
	if (localStorage.type === "Admin")
	{
		$("#menuitems").append('<li><a href="#" class="ui-link" onclick="moveToUsersManagement()">Users Management</a></li>');
		$("#menuitems").append('<li><a href="#" class="ui-link" onclick="moveToRoomsManagement()">Rooms Management</a></li>');
		
		
	}
	$("#menuitems").append('<li><a class="ui-link" href="Statistics.html" rel="external" data-ajax="false">Statistics</a></li>');
	$("#menuitems").append('<li><a class="ui-link" href="#" onclick="moveToChangePassword()">Change Password</a></li>');
	$("#menuitems").append('<li><a class="ui-link" href="Faq.html">FAQ</a></li>');
	$("#menuitems").append('<li><a class="ui-link" href="#" onclick="logout()">Logout</a></li>');*/
}
