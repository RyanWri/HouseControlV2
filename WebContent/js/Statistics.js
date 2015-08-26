 /* 
	Author: ran yamin
	date 18/08/2015 
	javascript for Statistics main page
	Last Modification : 26/08/2015
 */

var groupID_array =[];
var groups = [];
var voltage_series = [];
var countVolt;

$(document).ready(function()
		{
			var UserID= localStorage.userID;
			ShowAllRooms(UserID);
			setTimeout( function() {
				createDynamicPieChart();//now we have all data create the pie chart
				ShowTotalConsumption("month");
			},1500);
		});

//List All Rooms
function ShowAllRooms(UserID)
	{
		var groupID, name, picData;
		$.ajax({
			type: 'GET',
			url: '/HouseControl/api/devices_group/user_devices_groups/' + UserID,
			contentType: "application/json",
			dataType: 'json',
			success: function(result)
			{
				for (var i=0; i<result.data.length; i++){
					groupID = result.data[i].groupID;  name= result.data[i].name; picData=result.data[i].picData;  
					groups[i] = name;
					
					groupID_array.push(groupID);
					
					$("#ListAllRooms").append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true">\n\
							<li class="ui-li-has-thumb ui-first-child ui-last-child"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="sendGroupID('+groupID+')">\n\
					        <img src="../img/devicesGroups/'+picData +'" class="button">\n\
					        <h2>'+ name+'</h2>\n\
					        </a></li></ul>');
				}
				SetStatsPerRoom();
				
			},
	
			
			error: function(xhr, ajaxOptions, thrownError)
			{
				$.mobile.loading("hide");
			}

		});


	
		
	}



function SetStatsPerRoom()
{
	for (var i=0; i< groupID_array.length; i++)
	{
		$.ajax({
			type: 'GET',
			url: '/HouseControl/api/device/statistics/devices_group/'+ groupID_array[i] +'/month',
			contentType: "application/json",
			dataType: 'json',
			success: function(result)
			{
				countVolt = 0;
				for (var j=0; j<result.data.myArrayList.length; j++)
				{
					countVolt += result.data.myArrayList[j].map.voltageSum; //count usage
				}
				
				voltage_series.push(countVolt);
			},

			error: function(xhr, ajaxOptions, thrownError)
			{
				$.mobile.loading("hide");
			}

		});
	}
	
}
	

//Create dynamic pie chart
function createDynamicPieChart()
{	
	var data = {
			  labels: groups,
			  series: voltage_series
			};

	new Chartist.Pie(".ct-chart", data);
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
		}

	});
}

function sendGroupID( group)
{
	localStorage.statisticsGroupID = group;
	window.location = "Statistics_Single.html"; 
}

/*
 * //delete all label with value 0
function CutZeroValueLabel()
{
	 for(var i = voltage_series.length; i--;) {
         if(voltage_series[i] === 0) {
             groups.splice(i, 1);
             voltage_series.splice(i, 1);
         }
     }
}
 * 
 */

