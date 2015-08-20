/*
	Author: ran yamin
	date 18/08/2015 
	javascript for Statistics main page
	Last Modification : --
 */
var UserID=1; //get it from local storage
var groups = [];
var voltage_series = [];


$(document).ready(function()
		{
			ShowAllRooms(UserID);
			createDynamicPieChart();
			ShowTotalConsumption("month");
		});

//List All Rooms
function ShowAllRooms(UserID)
	{
		var appendText, groupID, name, Index=0;
		$.ajax({
			type: 'GET',
			url: '/HouseControl/api/devices_group/user_devices_groups/' + UserID,
			contentType: "application/json",
			dataType: 'json',
			success: function(result)
			{
				for (var i=0; i<result.data.length; i++){
					groupID = result.data[i].groupID;
					name= result.data[i].name;
					createPage(groupID, name);
					appendText = ContentByIndex(Index, groupID, name);
					$(".ui-grid-b").append(appendText); Index++;
					if (Index >=3) Index=0;
					pageReadyGroup(groupID);
					
					groups[i] = name;
					voltage_series[i] = GetVoltageGroup(groups[i], "month"); 
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

//create page with id="groupId" and title="roomName" appending to body
function createPage(groupID, roomName) {
	//set whatever content you want to put into the new page
	var content = '<div data-role="page" id="'+groupID+'" data-theme="a">';
	content += '<div data-role="header" data-position="fixed" data-tap-toggle="false" class="ui-page-theme-a ui-header"><h1>'+ roomName +'</h1>';
	content += '<a href="#" data-rel="back" class="ui-btn-left ui-btn ui-icon-back ui-btn-icon-notext ui-shadow ui-corner-all"  data-role="button" role="button">Back</a></div>';
	content += '<div data-role="main" class="ui-content"></div></div>';
	$('body').append(content); 
}

//return context to grid view
function ContentByIndex(Index,groupID,name)
{
	var appendText;
	switch(Index)
	{
		case 0: {
			appendText = '<div class="ui-block-a"><a href="#'+groupID+'" class="ui-btn ui-btn-inline ui-corner-all">';
			appendText+= name + '</a></div>'; 
		} break;
		
case 1: {
		appendText = '<div class="ui-block-b"><a href="#'+groupID+'" class="ui-btn ui-btn-inline ui-corner-all">';
			appendText+= name + '</a></div>';
		} break;
		case 2: {
		appendText = '<div class="ui-block-c"><a href="#'+groupID+'" class="ui-btn ui-btn-inline ui-corner-all">';
			appendText+= name + '</a></div>';
		} break;
	
	default: 
	{
	appendText = '<div class="ui-block-a"><a href="#'+groupID+'" class="ui-btn ui-btn-inline ui-corner-all">';
			appendText+= name + '</a></div>';
	}
	
	}
	
	return appendText;
}

//when new room is actually created 
function pageReadyGroup(groupID)
{
	$(document).on("pagecreate","#"+groupID,function(){
		   alert("room was created with "+ groupID);
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
	
	var responsiveOptions = [
	               		  ['screen and (min-width: 640px)', {
	               		    chartPadding: 30,
	               		    labelOffset: 100,
	               		    labelDirection: 'explode',
	               		    labelInterpolationFnc: function(value) {
	               		      return value;
	               		    }
	               		  }],
	               		  ['screen and (min-width: 1024px)', {
	               		    labelOffset: 80,
	               		    chartPadding: 20
	               		  }]
	               		];
	new Chartist.Pie('.ct-chart', data, options, responsiveOptions);
}

function GetVoltageGroup (groupID ,timeframe)
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/statistics/devices_group'+ groupID +'/' +timeframe,
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

function ShowTotalConsumption(timeframe)
{
	$.ajax({
		type: 'GET',
		url: '/HouseControl/statistics/'+ timeframe +'/all',
		contentType: "application/json",
		dataType: 'json',
		success: function(result)
		{
			//$('#TotalConsumption').append ("Total Usage of all devices During the last month Was:"+ result.data.voltage);
			$('#TotalConsumption').append(result.data); 
		},

		error: function(xhr, ajaxOptions, thrownError)
		{
			$.mobile.loading("hide");
			alert(xhr.status);
			alert(thrownError); 
		}

	});
}

