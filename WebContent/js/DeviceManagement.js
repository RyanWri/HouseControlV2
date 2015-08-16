/*
	Author: ran yamin
	date 13/08/2015 
	javascript for room view page (Manage Devices)
	Last Modification : 
 */

var flag = 0;

$(document).on("pagecreate", function () {
    $("[data-role=panel]").one("panelbeforeopen", function () {
        var height = $.mobile.pageContainer.pagecontainer("getActivePage").outerHeight();
        $(".ui-panel-wrapper").css("height", height + 1);
    });
});

	$(document).ready(function()
			{
		ShowAllDevices(); //update all devices
			});


	//	List All Devices
	function ShowAllDevices()
	{
		var deviceID, name, Index=0;
		$.ajax({
			type: 'GET',
			url: '/HouseControl/api/device/all',
			contentType: "application/json",
			dataType: 'json',
			success: function(result)
			{
				for (var i=0; i<result.data.length; i++){
					deviceID = result.data[i].deviceID;  name = result.data[i].name;
					createPage(deviceID, name);
					var contentDevice='<li><a href="#'+deviceID +'" class="ui-btn"><img src="../img/tick.png">'+name+'</a></li>';
					$("#ListAllDevices").append(contentDevice);
					pageReady(deviceID);
				}

			},

			error: function(xhr, ajaxOptions, thrownError)
			{
				$.mobile.loading("hide");
				alert(xhr.status);
				alert(thrownError); 
			}

		});
		
		
	}
	
	
	//when add device form is submit -> create device on server
	$("#formAddDevice").submit( function()
		{
		var parameters = {}; //name, description, deviceType:{typeID} ,connectionType, Voltage
		var deviceType = $('#devices :selected').text();
		parameters.name = $('#deviceName').val();
		parameters.description = $('#description').val();
		parameters.deviceType = '{TypeID:'+getTypeIDByName(deviceType)+'}';
		parameters.connectionType = 'Relay';
		parameters.voltage = 25; 
		var parametersStringified = JSON.stringify(parameters);
		alert(parametersStringified);
		$.ajax({
			type: 'POST',
			url: '/HouseControl/api/device/create',
			data: parametersStringified,
			dataType: "json",
			success: function(result)
			{
				if (result.status === "ok")
            	{
        			flag = 0;
            		$.mobile.loading("hide");
            		alert("device was created");
            		window.location = "DeviceManagement.html";
            	}
            	else
            	{
            		flag = 1;
            		$.mobile.loading("hide");
            		alert("error");
            	}
			},
			error: function(xhr, ajaxOptions, thrownError)
			{
				flag=0;
				alert(xhr.status);
				alert(thrownError); 
			}


		}); });
	
//	create page with id="deviceId" and title="deviceName" appending to body
	function createPage(deviceID, deviceName) {
		//set whatever content you want to put into the new page
		var content = '<div data-role="page" id="'+deviceID+'" data-theme="b">';
		content += '<div data-role="header" data-position="fixed" data-tap-toggle="false" data-theme="b"><h1>'+ deviceName +'</h1>';
		content += '<a href="#" data-rel="back" class="ui-btn-left ui-btn ui-icon-back ui-btn-icon-notext ui-shadow ui-corner-all"  data-role="button" role="button">Back</a></div>';
		content += '<div data-role="main" class="ui-content"></div> </div>';
		$('body').append(content); 
	}
	
	
	//when new room is actually created 
	function pageReady(deviceID)
	{
		$(document).on("pagecreate","#"+deviceID,function(){
			   alert("device was created with "+ deviceID);
			   $('#'+deviceID).append(DeviceHtml(deviceID));
			});
	}
	
	
	//actual Html of every device
	function DeviceHtml(deviceID)
	{
		var content ='<label for="flip2b">Current State :</label>';
		content +='<div class="ui-flipswitch ui-shadow-inset ui-bar-inherit ui-corner-all waves-effect waves-button waves-light waves-effect waves-button waves-light">';
		content += '<a href="#" class="ui-flipswitch-on ui-btn ui-shadow ui-btn-inherit waves-button waves-button">On</a><span class="ui-flipswitch-off">Off</span>';
		content +='<select name="flip2" id="flip2b" data-role="flipswitch" class="ui-flipswitch-input">';
        content += '<option value="off">Off</option> <option value="on">On</option> </select></div>';
		content += '<a href="#" onclick="connectDeviceToRelayPort(3,'+deviceID+')" class="ui-btn ui-btn-icon-left waves-effect waves-button waves-effect waves-button"><i class="zmdi zmdi-plus"></i> Connect Device To Relay</a>';
		content += '<a href="#" onclick="DisconnectDeviceFromRelayPort('+deviceID+')" class="ui-btn ui-btn-icon-left waves-effect waves-button waves-effect waves-button"><i class="zmdi zmdi-unfold-less"></i></i> DisConnect Device From Relay</a>';
		content += '<a href="#" onclick="removeDevice('+deviceID+')" class="ui-btn ui-btn-icon-left waves-effect waves-button waves-effect waves-button"><i class="zmdi zmdi-delete ui-pull-left"></i> remove Device </a>';
		return content;
	}
	
	
//Remove room with groupID from server and refresh page
	function removeDevice(deviceID)
	{
		alert("in function remove device");
		$.ajax({
			type: 'DELETE',
			url: '/HouseControl/api/device_type/delete/' + deviceID,
			contentType: "application/json",
			dataType: 'json',
			success: function(result)
			{
				alert(deviceID +"was deleted");
				location.reload();
			},

			error: function(xhr, ajaxOptions, thrownError)
			{
				$.mobile.loading("hide");
				alert(xhr.status);
				alert(thrownError); 
			}

		});

	}
	
//get typeID by the name of the device
function getTypeIDByName(name) {
	switch(name)
	{
	case "LAMP": return 2;
	case "TV": return 3;
	case "Kettle": return 4;
	case "Water Heater": return 5;
	case "Air Conditioner": return 6;
	default: return 1; //undefined
	}
}
	
//toggle state
function toggle(button)
{
	if ($('#flip2b').val == "off") {
		$('#flip2b').val = "on";
	} else {
		$('#flip2b').val = "off";
	}
}

function connectDeviceToRelayPort(RelayPort, deviceID)
{
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/device/connect_device_to_relay/'+RelayPort+'/'+deviceID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			alert('Device'+ deviceID +'is connected to port' + RelayPort);
			$.mobile.loading("hide");
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}

	});
	
}

function DisconnectDeviceFromRelayPort(deviceID)
{
	$.ajax({
		type: 'POST',
		url: '/HouseControl/api/device/disconnect_device/'+deviceID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			alert('Device'+ deviceID +'has been disconnected from port');
			$.mobile.loading("hide");
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}

	});
	
}
	
	
	
	