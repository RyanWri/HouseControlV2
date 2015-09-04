/* 
	Author: ran yamin
	date 18/08/2015 
	javascript for Statistics Single page Room stats
	Last Modification : 03/09/2015
 */

var devices_labels = [];
var voltage_series = [];

var groupID = localStorage.statisticsGroupID;


$(document).ready(function()
{
	$('#Week').click(function(){
		$(this).css('background-color','green');
		 $('#Day').css('background-color','white');
		 $('#Month').css('background-color','white');
	  });
	
	  $('#Day').click(function(){
		  $(this).css('background-color','green');
		  $('#Week').css('background-color','white');
		  $('#Month').css('background-color','white');
	  });
	  
	$('#Month').click(function(){
		$(this).css('background-color','green');
		 $('#Day').css('background-color','white');
		 $('#Week').css('background-color','white');
		 });
	
	authentication(loadStatisticsSinglePage);		
});

function loadStatisticsSinglePage()
{
	ShowRoomName();	
}


//showing all devices in the room
function ShowAllDevicesInRoom(groupID, timeframe)
{
		$.mobile.loading("show");
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
				
				createDynamicBarsChart();//now we have all data create the pie chart
				$.mobile.loading("hide");
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


function ShowRoomName()
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/devices_group/get_group/'+ groupID,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			$('#RoomName').append(result.data.name+ "	Statistics");
			
			DataForMonth(); //show bar chart for month
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
		}

	});

}



