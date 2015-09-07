/*
	Author: ran yamin
	date 20/08/2015 
	javascript for faq page
	Last Modification : 
 */

//at the moment no javascript is needed here

$('#Faq').on('pagebeforeshow', function()
{ 
	authentication(loadFaqPage);		
});

$(function() 
{});

function loadFaqPage()
{
	document.getElementById("Faq").style.display = "inline";
}

	


