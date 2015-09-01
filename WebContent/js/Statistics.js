 /* 
	Author: ran yamin
	date 18/08/2015 
	javascript for Statistics main page
	Last Modification : 27/08/2015
 */

var groupID_array =[];
var groups = [];
var voltage_series = [];
var countVolt;

$(document).ready(function()
{
	authentication(loadStatisticsPage);
});


function loadStatisticsPage()
{
	var UserID= localStorage.userID;
	ShowAllRooms(UserID);
}
 
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
					
					groups.push(name); //labels
					groupID_array.push(groupID); //for per room stats
					
					$("#ListAllRooms").append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true">\n\
							<li class="ui-li-has-thumb ui-first-child ui-last-child"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="sendGroupID('+groupID+')">\n\
					        <img src="../img/devicesGroups/'+picData +'" class="button">\n\
					        <h2>'+ name+'</h2>\n\
					        </a></li></ul>');
				}
				
				SetStatsPerRoom();
				ShowTotalConsumption("month");
				
				setTimeout( function() {
					createChart();
				},3000);
				
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
		setEachRoomStats(groupID_array[i]); //send every ajax with roomID
	}	
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

function setEachRoomStats(roomID)
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device/statistics/devices_group/'+ roomID +'/month',
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

function createChart()
{
    // Build the chart
    $('#chartdiv').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'House Consumption, September 2015'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: "Usage",
            colorByPoint: true,            
            data: createArray()
        }]
    });
}

function createArray()
{
	var length = groups.length;
	var data = new Array();
	for (var i = 0; i < length; i++)
	{
		  var obj = {name: groups[i], y: voltage_series[i]};
		  data.push(obj);
	}
	
	
	return data;
}
/*
            data: [{
                name: groups[0],
                y: 	voltage_series[0]
            }, {
                name: "Chrome",
                y: 24.03,
            }, {
                name: "Firefox",
                y: 10.38
            }, {
                name: "Safari",
                y: 4.77
            }, {
                name: "Opera",
                y: 0.91
            }, {
                name: "Proprietary or Undetectable",
                y: 0.2
            }]
*/