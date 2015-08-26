/* 
	Author: ran yamin
	date 18/08/2015 
	javascript for Statistics Single page Room stats
	Last Modification : 20/08/2015
 */

var devices_labels = [];
var voltage_series = [];

var groupID = localStorage.statisticsGroupID;


$(document).ready(function()
		{
			ShowAllDevicesInRoom(groupID, "month");
		});


//showing all devices in the room
function ShowAllDevicesInRoom(groupID, timeframe)
{
		$.ajax({
			type: 'GET',
			url: '/HouseControl/api/device/statistics/devices_group/'+ groupID + '/' + timeframe,
			contentType: "application/json",
			dataType: 'json',
			success: function(result)
			{
				for (var i=0; i<result.data.myArrayList.length; i++){
					devices_labels[i] = result.data.myArrayList[i].map.deviceName; //get device name
					voltage_series[i] = result.data.myArrayList[i].map.voltageSum; //get device usage
				}
				
				 setTimeout( function() {
						createDynamicBarsChart();//now we have all data create the pie chart
				 }, 1200);
			},

			error: function(xhr, ajaxOptions, thrownError)
			{
				$.mobile.loading("hide");
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

//get data for 1 day
function DataForDay()
{
	ShowAllDevicesInRoom(groupID, "day");
}


//get data for 1 week
function DataForWeek()
{
	ShowAllDevicesInRoom(groupID, "week");
}


//get data for 1 monthe
function DataForMonth()
{
	ShowAllDevicesInRoom(groupID, "month");
}




