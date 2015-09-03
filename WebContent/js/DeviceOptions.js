var currentDay;
var currentMonth;
var currentYear;
var currentHour;
var currentMin;
var currentSec;
var delay = 300;

$(function() 
{
    $(document).ready(function()
    {
    	
    	authentication(loadDeviceOptionsPage);	
    });
    
    $("#addNewTimer").click(function()
    {
    	
    	$("#textBoxTimerName").val("");
    	initTimerStartTime();
    	$("#popupNewTimerStart").click();
    });
    
    $("#formStartTimer").validate(
			{
				errorPlacement: function(error, element) 
				{
					error.insertAfter(element);
				},
				rules:
				{
					timername:
					{
						required: true,
						minlength: 2,
						maxlength: 20,
					},					
				},
				submitHandler: function(form) 
				{
					window.location = "#";
					setTimeout(
							  function() 
							  {
								  initTimerEndTime();
								  $("#popupNewTimerEnd").click();
							  }, delay);
				} 
			});
    
    $("#buttoncancel1").click(function()
    {
    	window.location = "#";
    });
    
    $("#buttoncancel2").click(function()
    {
    	window.location = "#";
    });
    
    $("#buttoncontinue").click(function()
    {
    	window.location = "#";
    });
    
    $("#buttondone").click(function()
    {
    	
    	var startTime = convertDate($("#startDatePicker").val(), $("#startHour").val(), $("#startMin").val(),$("#startSec").val());
    	var endTime = convertDate($("#endDatePicker").val(), $("#endHour").val(), $("#endMin").val(),$("#endSec").val());

		var parameters = {};
		var deviceJ = {};
		var nameJ = {};
		
		deviceJ.deviceID = localStorage.deviceoptionsDeviceID;
		nameJ.userID = localStorage.userID;
		parameters.device = deviceJ;
		parameters.timerName = $("#textBoxTimerName").val();
		parameters.user = nameJ;
		parameters.turnOnTime = startTime;
		parameters.turnOffTime = endTime;
		parameters.state = "Active";
		var parametersStringified = JSON.stringify(parameters);
		
		$.ajax({
			type: 'POST',
			url: '/HouseControl/api/timer/create',
            data: parametersStringified,
            dataType: 'json',
			success: function(result)
			{
				if (result.status === "ok")
				{
					window.location = "DeviceOptions.html";
				}
				else
				{
					errorPopup(result.data);
				}
			},
			error: function()
			{
				errorPopup("Connection Error");
			},	
		});
    });
  
});

function loadDeviceOptionsPage()
{
	if (!localStorage.deviceoptionsName)
	{
		window.location = "UserHome.html";
	}
	else
	{
		$("#deviceName").text(localStorage.deviceoptionsName);
		loadActiveTimers();
		$("#startDatePicker").datepicker();
		$("#endDatePicker").datepicker();
		$("#startDatePicker").datepicker('option', 
		{
			dateFormat: 'dd-mm-yy',
		}).datepicker("refresh");
		$("#endDatePicker").datepicker('option', 
		{
			dateFormat: 'dd-mm-yy',
		}).datepicker("refresh");
	}

}

function loadActiveTimers()
{	
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/timer/get_timers_of_device/' + localStorage.deviceoptionsDeviceID,
        dataType: 'json',
		success: function(result)
		{	
			if (result.status === "ok")
			{
				var listOfTimers = {};
				listOfTimers = result.data;
				for (var i = 0; i < listOfTimers.length; i++) 
				{
					
					$("#listOfActiveTimer").append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-icon="false"><li class="ui-first-child ui-last-child"><a id="'+listOfTimers[i].userID+'" class="ui-btn waves-effect waves-button waves-effect waves-button"><h2>'+listOfTimers[i].timerName+'</h2>\n\
							<p><b>Turn On: </b>'+listOfTimers[i].turnOnTime+'</p>\n\
							<p><b>Turn Off: </b>'+listOfTimers[i].turnOffTime+'</p></a></li></ul>');
					
				}
			}
		},
		error: function()
		{
			errorPopup("Connection Error");
		},	
	});	
}

function convertDate(date, hour, min, sec)
{
	var dateToConvert = date;
	var tempHour;
	var tempMin;
	var tempSec;
	var ampm;
	var startMin = min;
	var startSec = sec;

	
	if (hour === "0")
	{
		tempHour = 12;
		ampm = "AM";
	}
	else if (hour >= 12)
	{
		if (hour === "12")
		{
			tempHour = 12;
		}
		else
		{
			tempHour = "0" + (hour - 12).toString();
		}
		ampm = "PM";
	}
	else if(hour < 10)
	{
		tempHour = "0" + hour.toString();
		ampm = "AM";
	}
	else
	{
		tempHour = hour.toString();
		ampm = "AM";
	}
	
	if (min < 10)
	{
		tempMin = "0" + min.toString();
	}
	else
	{
		tempMin = min.toString();
	}

	if (sec < 10)
	{
		tempSec = "0" + sec.toString();
	}
	else
	{
		tempSec = sec.toString();
	}

	
	var dateToReturn = "";
	var monthNames = new Array("Jan", "Feb", "Mar", 
			"Apr", "May", "Jun", "Jul", "Aug", "Sep", 
			"Oct", "Nov", "Dec");
			var dateParts = dateToConvert.match(/\d+/g); 
			var cDate = dateParts[0];
			var cMonth = (parseInt(dateParts[1]))-1;
			var cYear = dateParts[2];
			var dateToReturn = monthNames[cMonth] + " " +cDate  + ", " +cYear + " " + tempHour + ":" + tempMin + ":" + tempSec + " " + ampm;

			return dateToReturn;
}

function initTimerStartTime()
{
	$("#startDatePicker").datepicker('setDate', Date.now());
	$("#startDatePicker").datepicker('option', 
	{
		minDate: 0
	}).datepicker("refresh");
	
	setTimerStartToSpecificTime(0,0,0);
}

function initTimerEndTime()
{
	$("#endDatePicker").datepicker('setDate', Date.now());
	$("#endDatePicker").datepicker('option', 
	{
		minDate: 0
	}).datepicker("refresh");

	setTimerEndToSpecificTimer(0, 0, 0);
}


function setTimerStartToSpecificTime(hour, min, sec)
{
	$("#startHour").attr('min', hour);
	$("#startHour").attr('value', hour);
	$("#startHour").val(hour).slider("refresh");
	$("#startMin").attr('min', min);
	$("#startMin").attr('value', min);
	$("#startMin").val(min).slider("refresh");
	$("#startSec").attr('min', sec);
	$("#startSec").attr('value', sec);
	$("#startSec").val(sec).slider("refresh");
}

function setTimerEndToSpecificTimer(hour, min, sec)
{
	$("#endHour").attr('min', hour);
	$("#endHour").attr('value', hour);
	$("#endHour").val(hour).slider("refresh");
	$("#endMin").attr('min', min);
	$("#endMin").attr('value', min);
	$("#endMin").val(min).slider("refresh");
	$("#endSec").attr('min', sec);
	$("#endSec").attr('value', sec);
	$("#endSec").val(sec).slider("refresh");
}

function errorPopup(message)
{
	window.location = "#";
    setTimeout(
    		function() 
    		{
    			$("#popupMessagetext").text("Error!");
    			$("#popupMessagesubtext").text(message);
    			$("#popupMessage").click();
    		}, delay);	
}	
