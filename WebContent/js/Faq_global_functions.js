/*
	Author: ran yamin
	date 20/08/2015 
	javascript global functions for all faq pages
	Last Modification : 20/08/2015
 */

$(document).ready(function(){
	var NumOfQuestions =5;
	for (var i=1; i<=NumOfQuestions; i++)
		{
			toggleAnswer(i);
		}
	
	function toggleAnswer(number)
	{
		 $('#question'+ number).click(function(){
		        $('#answer'+number).toggle();
		 });
		    
	}
});