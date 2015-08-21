/*
	Author: ran yamin
	date 18/08/2015 
	javascript for Statistics Single page Room stats
	Last Modification : 20/08/2015
 */

var devices_labels = [];
var voltage_series = [];
var devicesID_array = [];

var groupID = localStorage.statisticsGroupID;


$(document).ready(function()
		{
			ShowAllDevicesInRoom(groupID);
		});


//showing all devices in the room
function ShowAllDevicesInRoom(groupID)
{
	var deviceID, name;
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/devices_group/get_devices/' + groupID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			for (var i=0; i<result.data.length; i++){
				deviceID = result.data[i].deviceID;  name = result.data[i].name;  
				devicesID_array[i] = deviceID;
				devices_labels[i] = name;
				voltage_series[i] = GetVoltageDevice("day", deviceID);
			}
			createDynamicBarsChart();
			

		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}

	});
}


// Create dynamic bars chart
function createDynamicBarsChart()
{		
	var data = {
			  labels: devices_labels,
			  series: voltage_series
			};
	
	new Chartist.Bar('.ct-chart',data, {distributeSeries: true });
}




function GetVoltageDevice (timeframe , deviceID)
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device/statistics/'+ timeframe +'/' +deviceID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			return result.data.map.voltageSum;
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}

	});
}

//get data for 1 day
function DataForDay()
{
	var deviceID;
	for (i=0; i< devicesID_array.length(); i++)
		{
			deviceID = devicesID_array[i];
			voltage_series[i] = GetVoltageDevice("day", deviceID);
		}
	
	createDynamicBarsChart(); //for 1 day
}


//get data for 1 week
function DataForWeek()
{
	var deviceID;
	for (i=0; i< devicesID_array.length(); i++)
		{
			deviceID = devicesID_array[i];
			voltage_series[i] = GetVoltageDevice("week", deviceID);
		}
	
	createDynamicBarsChart(); //for 1 week
}


//get data for 1 monthe
function DataForMonth()
{
	var deviceID;
	for (i=0; i< devicesID_array.length(); i++)
		{
			deviceID = devicesID_array[i];
			voltage_series[i] = GetVoltageDevice("month", deviceID);
		}
	
	createDynamicBarsChart(); //for 1 month

}




