/*
	Author: ran yamin
	date 25/07/2015 
	javascript for room Management page
	Last Modification : 07/08/2015
 */

var flag = 0;

	$(document).ready(function()
			{
				ShowAllRooms(); //update all rooms
			});
	
    $("#buttoncontinue").click(function() //button to refresh page in order to show all rooms
    	    {
    	    	if (flag === 0)
    	    	{
    	    		location.reload();
    	    	}
    	    	else
    	    	{
    	    		window.location = "Faq.html";
    	    	}
    	    	
    	    });
	

//when add room form is submit -> create room on server
	$("#formAddRoom").submit( function()
			{
		var parameters = {};
		var roomName = $('#textBoxRoomName').val();
		parameters.name = roomName;
		var parametersStringified = JSON.stringify(parameters);
		$.ajax({
			type: 'POST',
			url: '/HouseControl/api/devices_group/create',
			data: parametersStringified,
			dataType: "json",
			success: function(result)
			{
				if (result.status === "ok")
            	{
        			flag = 0;
            		$.mobile.loading("hide");
            		$("#popupMessagesubtext").text("Succeed to Create Room");
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
			},
			error: function(xhr, ajaxOptions, thrownError)
			{
				flag=0;
				alert(xhr.status);
				alert(thrownError); 
			}


		});

			});


//	List All Rooms
 function ShowAllRooms()
	{
		var appendText, groupID, name, Index=0;
		$.ajax({
			type: 'GET',
			url: '/HouseControl/api/devices_group/all',
			contentType: "application/json",
			dataType: 'json',
			success: function(result)
			{
				for (var i=0; i<result.data.length; i++){
					groupID = result.data[i].groupID;
					name= result.data[i].name;
					createPage(groupID, name);
					appendText = ContentByIndex(Index, groupID, name);
					$(".ui-grid-c").append(appendText); Index++;
					if (Index >=4) Index=0;
					pageReadyGroup(groupID);
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
    
//	create page with id="groupId" and title="roomName" appending to id=ActualRooms
	function createPage(groupID, roomName) {
		//set whatever content you want to put into the new page
		var content = '<div data-role="page" id="'+groupID+'" data-theme="b">';
		content += '<div data-role="header"><h1>'+ roomName +'</h1>';
		content += '<a href="#" data-rel="back" class="ui-btn-left ui-btn ui-icon-back ui-btn-icon-notext ui-shadow ui-corner-all"  data-role="button" role="button">Back</a></div>';
		content += '<div data-role="main" class="ui-content"></div></div>';
		$('body').append(content); 
	}


	
//	Remove room with groupID from server and refresh page
	function removeRoom(groupID)
	{
		alert("in function remove");
		$.ajax({
			type: 'DELETE',
			url: '/HouseControl/api/devices_group/delete/' + groupID,
			contentType: "application/json",
			dataType: 'json',
			success: function(result)
			{
				alert(groupID +"was deleted");
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
	
	//return context to grid view
	function ContentByIndex(Index,groupID,name)
	{
		var appendText;
		switch(Index)
		{
			case 0: {
				appendText = '<div class="ui-block-a"><a href="#'+groupID+'" class="ui-btn ui-btn-inline ui-corner-all">';
				appendText+= name + '</a></div>'; 
			} break;
			
	case 1: {
			appendText = '<div class="ui-block-b"><a href="#'+groupID+'" class="ui-btn ui-btn-inline ui-corner-all">';
				appendText+= name + '</a></div>';
			} break;
			case 2: {
			appendText = '<div class="ui-block-c"><a href="#'+groupID+'" class="ui-btn ui-btn-inline ui-corner-all">';
				appendText+= name + '</a></div>';
			} break;
			case 3: {
			appendText = '<div class="ui-block-d"><a href="#'+groupID+'" class="ui-btn ui-btn-inline ui-corner-all">';
				appendText+= name + '</a></div>';
			} break;
		
		default: 
		{
		appendText = '<div class="ui-block-a"><a href="#'+groupID+'" class="ui-btn ui-btn-inline ui-corner-all">';
				appendText+= name + '</a></div>';
		}
		
		}
		
		return appendText;
	}
	
   //remove device with DeviceId from room="groupID"
	function removeDeviceFromRoom(DeviceID, groupID)
	{
		var parameters = {};
		parameters.deviceID = deviceID;
		parameters.deviceGroupID = groupID;
		var parametersStringified = JSON.stringify(parameters);
		alert("in function removeDeviceFromRoom");
		$.ajax({
			type: 'DELETE',
			url: '/HouseControl/api/devices_group/remove_device',
			data: parametersStringified,
			dataType: 'json',
			success: function(result)
			{
				alert (result.status);

			},

			error: function(xhr, ajaxOptions, thrownError)
			{
				$.mobile.loading("hide");
				alert(xhr.status);
				alert(thrownError); 
			}

		});

	}
	
	
	
	
	//when new room is actually created 
	function pageReadyGroup(groupID)
	{
		$(document).on("pagecreate","#"+groupID,function(){
			   alert("room was created with "+ groupID);
			    $('#'+groupID).append(RoomHtml(groupID));
			    $( ".clearRoom" ).button({
			    	  icons: { primary: "ui-icon-gear", secondary: "ui-icon-triangle-1-s" }
			    	});
			    ShowAllDevices();
			});
	}
	
	//actual Html of every room
	function RoomHtml(groupID)
	{
	   /* var content = '<form id="formAddDeviceToRoom">';
		content += '<label>Select Device</label>'; 
		content += '<select name="type" id="deviceType" data-native-menu="false">';
		content += '<option value="Lamp">Lamp</option>';
		content += '<option value="TV" class="TV">Tv</option><option value="AC">Air Conditioner</option>';
		content += '<option value="WH">Water Heater</option></select>';
		content += '<input type="submit" data-inline="true" value="Submit"></form>'; */
		var content = '<ul data-role="listview" id="ListAllDevices"></ul>';
		content += '<input type="button" value="remove Room" onclick="removeRoom('+groupID+')" class="clearRoom"/>';
		return content;
	}


//	Get devices in room by groupID
	function getDevicesInRoom(groupID)
	{
		alert("in function getDevicesInRoom");
		$.ajax({
			type: 'GET',
			url: '/HouseControl/api/devices_group/get_devices/'+groupID,
			contentType: "application/json",
			dataType: 'json',
			success: function(result)
			{
				for (var i=0; i<result.data.length; i++){
					//var appendText = "<li>"+ result.data[i].name +"</li>"; //add 
					alert(result.data[i].name );
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



//	when you add device to room -> get DeviceID -> connect DeviceID with GroupID
	$("#formAddDeviceToRoom").submit( function()
			{
		var parameters = {};
		var deviceSelected = $("#deviceType option:selected").text();
		parameters.deviceID = deviceSelected;
		var parametersStringified = JSON.stringify(parameters);
		$.mobile.loading("show");
		$.ajax({
			type: 'POST',
			url: '/HouseControl/api/devices_group/add_device',
			data: parametersStringified,
			dataType: "json",
			success: function(result)
			{
				alert(deviceSelected);
				$.mobile.loading("hide");
				alert(result.status);

			},
			error: function(xhr, ajaxOptions, thrownError)
			{
				$.mobile.loading("hide");
				alert(xhr.status);
				alert(thrownError); 
			}


		});

			});
	
	
	//	List All Devices
	function ShowAllDevices()
	{
		var deviceID, name;
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
					pageReadyDevice(deviceID);
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
	
	
	//when new room is actually created 
	function pageReadyDevice(deviceID)
	{
		$(document).on("pagecreate","#"+deviceID,function(){
			   alert("device was created with "+ deviceID);
			   $('#'+deviceID).append(DeviceHtml(deviceID));
			});
	}
	
	
	//actual Html of every device
	function DeviceHtml(deviceID)
	{
		var content = '<a href="#AddDeviceDialog" data-rel="popup" data-transition="pop" data-position-to="window" data-inline="true" data-icon="external-link" data-role="button" data-transition="pop">Add Device</a>';
		content +='<label for="flip2b">Current State :</label>';
		content +='<div class="ui-flipswitch ui-shadow-inset ui-bar-inherit ui-corner-all waves-effect waves-button waves-light waves-effect waves-button waves-light">';
		content += '<a href="#" class="ui-flipswitch-on ui-btn ui-shadow ui-btn-inherit waves-button waves-button">On</a><span class="ui-flipswitch-off">Off</span>';
		content +='<select name="flip2" id="flip2b" data-role="flipswitch" class="ui-flipswitch-input">';
        content += '<option value="off">Off</option> <option value="on">On</option> </select></div>';
		content += '<a href="#" onclick="connectDeviceToRelayPort(3,'+deviceID+')" class="ui-btn ui-btn-icon-left waves-effect waves-button waves-effect waves-button"><i class="zmdi zmdi-plus"></i> Connect Device To Relay</a>';
		content += '<a href="#" onclick="DisconnectDeviceFromRelayPort('+deviceID+')" class="ui-btn ui-btn-icon-left waves-effect waves-button waves-effect waves-button"><i class="zmdi zmdi-unfold-less"></i></i> DisConnect Device From Relay</a>';
		content += '<a href="#" onclick="removeDevice('+deviceID+')" class="ui-btn ui-btn-icon-left waves-effect waves-button waves-effect waves-button"><i class="zmdi zmdi-delete ui-pull-left"></i> remove Device </a>';
		return content;
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
	