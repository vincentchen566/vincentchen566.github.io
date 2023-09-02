function stageOne(){
	$("#main").append("<p class='waitingMessage'>Please wait</p>");
}

function stageTwo(){
	$(".waitingMessage").text("This is taking a bit longer than expected...please wait");
}

function stageThree(){
	$(".waitingMessage").text("Almost there...please wait");
}

function stageFour(){
	$("#loadingImage").remove();
	$(".waitingMessage").text("Thank you for waiting! Enjoy the video.");
	$("#main").append("<iframe width='70%' height ='500px' align='center' src='https://www.youtube.com/watch?v=JTEFKFiXSx4'></iframe>");
}


function onload(){
	stageOne();
	setTimeout(stageTwo,20000);
	/*setTimeout(()=> {stageTwo();},200000);*/
	setTimeout(stageThree,100000);
	setTimeout(stageFour,273000);
}