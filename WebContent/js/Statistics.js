 /* 
	Author: ran yamin
	date 18/08/2015 
	javascript for Statistics main page (highcharts used)
	Last Modification : 03/09/2015
 */

$('#Statistics').on('pagebeforeshow', function()
{ 
	authentication(loadStatisticsPage);
});

function loadStatisticsPage()
{
	var UserID= localStorage.userID;
	$.mobile.loading("show");
	ShowAllRooms(UserID);
	document.getElementById("Statistics").style.display = "inline";
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
				
				ShowTotalConsumption("month"); //set card for total usage
				
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
			//usage
			var answer = "During the last month is: <br>"+ result.data +"KW";
			var content = '<div class="nd2-card card-media-right card-media-small"><div class="card-media"><img src="../img/Stats_logo.png">';
			content +='</div><div class="card-title"><h6 class="card-primary-title nd2-subhead">Total Usage</h6>';
			content += '<h6 class="card-subtitle nd2-subhead">' + answer + '</h6></div></div>';
			$('#TotalConsumption').append(content);
		
			//Cost 
			var PricePerWatt = 0.54;
			var cost = PricePerWatt*(result.data/1000);
			content = '<div class="nd2-card card-media-right card-media-small"><div class="card-media"><img src="../img/CostLogo.png">';
			content +='</div><div class="card-title"><h6 class="card-primary-title nd2-subhead">Monthly Cost</h6>';
			content += '<h6 class="card-subtitle nd2-subhead">' + cost.toFixed(2) +" NIS" + '</h6></div></div>';
			$('#TotalConsumption').append(content);
			
			
			refreshPage(); //creates the pie chart	
			
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
		}

	});
	
}



function SetDataForChart()
{
	var KeyValueArray = [];
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
			createChart(KeyValueArray);
			
			$.mobile.loading("hide");
			
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
		}

	});

}

function createChart( KeyValueArray)
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
	$.mobile.loading("show");
	SetDataForChart();
}

