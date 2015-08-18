/*
	Author: ran yamin
	date 18/08/2015 
	javascript for Statistics Single page Room stats
	Last Modification : --
 */

var devices_labels = [];
var voltage_series = [];
var devicesID_array = [];

$(document).ready(function()
		{
			ShowAllDevices();
			createDynamicBarsChart();
		});

//	List All Devices
function ShowAllDevices()
{
	var deviceID, name, voltage;
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device/all',
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			for (var i=0; i<result.data.length; i++){
				deviceID = result.data[i].deviceID;  name = result.data[i].name; 
				devicesID_array[i] = deviceID;
				devices_labels[i] = name;
				voltage_series[i] = result.data[i].voltage;
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
		url: '/HouseControl/statistics/'+ timeframe +'/' +deviceID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			return result.data.voltage;
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




