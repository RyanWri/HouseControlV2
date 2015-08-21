/*
	Author: ran yamin
	date 18/08/2015 
	javascript for Statistics main page
	Last Modification : --
 */
var UserID= localStorage.userID;

var groups = [];
var voltage_series = [];


$(document).ready(function()
		{
			ShowAllRooms(UserID);
			ShowTotalConsumption("month");
		});

//List All Rooms
function ShowAllRooms(UserID)
	{
		var appendText, groupID, name, picData;
		$.ajax({
			type: 'GET',
			url: '/HouseControl/api/devices_group/user_devices_groups/' + UserID,
			contentType: "application/json",
			dataType: 'json',
			success: function(result)
			{
				for (var i=0; i<result.data.length; i++){
					groupID = result.data[i].groupID; name= result.data[i].name; picData=result.data[i].picData;  
					groups[i] = name;
					voltage_series[i] = GetVoltageGroup(groupID, "month"); 
					
					$("#ListAllRooms").append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true">\n\
							<li class="ui-li-has-thumb ui-first-child ui-last-child"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="sendGroupID('+groupID+')">\n\
					        <img src="../img/devicesGroups/'+picData +'.png" class="button">\n\
					        <h2>'+ name+'</h2>\n\
					        </a></li></ul>');
				}
				
				//now we have all data create the pie chart
				createDynamicPieChart();

			},

			error: function(xhr, ajaxOptions, thrownError)
			{
				$.mobile.loading("hide");
				alert(xhr.status);
				alert(thrownError); 
			}

		});
	}


// Create dynamic pie chart
function createDynamicPieChart()
{	
	var data = {
			  labels: groups,
			  series: voltage_series
			};
	
	var options = {
			  labelInterpolationFnc: function(value) {
			    return value[0]
			  }
			};
	
	new Chartist.Pie('.ct-chart', data, options);
}

function GetVoltageGroup (groupID ,timeframe)
{
	var countVolt =0;
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device/statistics/devices_group/'+ groupID +'/' +timeframe,
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			for (var i=0; i<result.data.length; i++)
			{
				countVolt += result.data[i].map.voltageSum;
			}
			return countVolt;
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}

	});
}

function ShowTotalConsumption(timeframe)
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device/statistics/'+ timeframe +'/all',
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			$('#TotalConsumption').append('<h2>' + result.data+ '</h2>'); 
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}

	});
}

function sendGroupID( group)
{
	localStorage.statisticsGroupID = group;
	window.location = "Statistics_Single.html"; 
}

