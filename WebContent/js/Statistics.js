 /* 
	Author: ran yamin
	date 18/08/2015 
	javascript for Statistics main page (highcharts used)
	Last Modification : 03/09/2015
 */

var groupID_array =[];
var KeyValueArray = [];

$(document).ready(function()
{
	authentication(loadStatisticsPage);
	SetDataForChart();
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
					
					
					$("#ListAllRooms").append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true">\n\
							<li class="ui-li-has-thumb ui-first-child ui-last-child"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r" onclick="sendGroupID('+groupID+')">\n\
					        <img src="../img/devicesGroups/'+picData +'" class="button">\n\
					        <h2>'+ name+'</h2>\n\
					        </a></li></ul>');
				}
				
				
				ShowTotalConsumption("month");				
				
			},
	
			
			error: function(xhr, ajaxOptions, thrownError)
			{
				$.mobile.loading("hide");
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
			var cutStr = result.data.slice(0,27);
			cutStr +='<br>' + result.data.slice(27,58) +'<br>' +result.data.slice(58);
			var content = '<div class="nd2-card card-media-right card-media-medium"><div class="card-media"><img src="../img/Stats_logo.png">';
			content +='</div><div class="card-title"><h3 class="card-primary-title">Total Usage</h3>';
			content += '<h5 class="card-subtitle">' + cutStr + '</h5></div></div>';
			$('#TotalConsumption').append(content);
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
		}

	});
	
}



function SetDataForChart()
{
	$.mobile.loading( "show" );
	KeyValueArray.splice(0,KeyValueArray.length); //first clear the array
	$.ajax({
		type: 'GET',
		url: '/HouseControl/api/device/statistics/all_groups',
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			var group_name, group_usage;
			for (var j=0; j<result.data.myArrayList.length; j++)
			{
				group_name = result.data.myArrayList[j].map.groupName;
				group_usage = result.data.myArrayList[j].map.groupConsumption;
				var obj = {name: group_name, y: group_usage};
				
				KeyValueArray.push(obj); //add data to array
			}
			
			//create pie chart
			setTimeout( function() {
				createChart();
				$.mobile.loading( "hide" );
			},1400);
			
			
			
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
            data: KeyValueArray
        }]
    });
}


//for statistics single room
function sendGroupID( group)
{
	localStorage.statisticsGroupID = group;
	window.location = "Statistics_Single.html"; 
}


//refresh stats data
function refreshPage()
{
	SetDataForChart();
}

