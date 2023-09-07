/*onload*/

var playMode = false;
var historyCounter = 0;
var secretR = 0;
var secretG = 0;
var secretB = 0;
var guesses = 0;
var totalGames;
var totalGuesses;



function onload() {
	processRGB(255, 255, 255);
	let myCookie = getCookie("totalGames");

	if (myCookie == null) {
		totalGames = 0;
		totalGuesses = 0;
		document.cookie = "totalGames=0";
		document.cookie = "totalGuesses=0";
	}
	else {

		totalGames = getCookie("totalGames");
		totalGuesses = getCookie("totalGuesses");
	}
}




/*check cookies*/



function getCookie(name) {
	var dc = document.cookie.toString();
	var prefix = name + "=";
	var begin = dc.indexOf("; " + prefix);
	if (begin == -1) {
		begin = dc.indexOf(prefix);
		if (begin != 0) return null;
		end = document.cookie.indexOf(";");
	}
	else {
		begin += 2;
		var end = document.cookie.indexOf(";", begin);
		if (end == -1) {
			end = dc.length;
		}
	}
	return decodeURI(dc.substring(begin + prefix.length, end));
}





function processRGB(r, g, b) {
	convertRGB(r, g, b);
	$("#colorBox").css("background-color","rgb(" + r + "," + g + "," + b + ")");
}

/* change from play and explore */
function modeToggle() {

	$("#congratsMessage").text("");
	if (playMode) {
		$("#lucky").css("display", "inline-block");
		$("#play").css("display", "inline-block");
		$("#save").css("display", "inline-block");
		$("#guess").css("display", "none");
		$("#explore").css("display", "none");
		$("#restart").css("display", "none");
	} else {
		$("#lucky").css("display", "none");
		$("#play").css("display", "none");
		$("#save").css("display", "none");
		$("#guess").css("display", "inline-block");
		$("#explore").css("display", "inline-block");
		$("#restart").css("display", "inline-block");
	}
	clearHistory();
	playMode = !playMode;
	if (playMode) {
		gameStart();
    }
}

/*clear history*/
function clearHistory() {
	historyCounter = 0;
	$("#history").html("<h2 id='historyTitle'>History</h2>");
}

/*saves current color to history*/
function save() {
	historyAdd($("#rInput").val(), $("#gInput").val(), $("#bInput").val());
}

/*manage history and guesses, max 10 items*/
function historyAdd(r, g, b) {
	if (historyCounter >= 10) {
		historyCounter = 9;
		$(".historyItem").last().remove();
	}
	historyCounter += 1;


	if (!playMode) {
		$("#historyTitle").after("<div class='historyItem'><p>" + r + ", " + g + ", " + b + "</p><div class='historyBox' style='display:inline-block;background-color:rgb(" + r + "," + g + "," + b + ")'></div></div>");
	} else {
		innerText = r;
		if (r > secretR) {
			innerText += "&darr;";
		} else if (r < secretR) {
			innerText += "&uarr;";
		}

		innerText += ", " + g;
		if (g > secretG) {
			innerText += "&darr;";
		} else if (g < secretG) {
			innerText += "&uarr;";
		}

		innerText += ", " + b;
		if (b > secretB) {
			innerText += "&darr;";
		} else if (b < secretB) {
			innerText += "&uarr;";
		}
		$("#historyTitle").after("<div class='historyItem'><p>" + innerText + "</p><div class='historyBox' style='display:inline-block;background-color:rgb(" + r + "," + g + "," + b + ")'></div></div>");

	}
		



    
}

/*convert RGB to hex and HSL*/
function convertRGB(r, g, b) {

	/* hex */

	let hex = "";
	for (const element of [r, g, b]) {
		if (element <= 15) {
			hex += "0";
			hex += element.toString(16);
		} else {
			hex += element.toString(16);
		}
	}
	$("#hexValue").text("Hex: " + hex);


	/* hsl */
	let h, s, l, cmax, cmin, delta, rprime, gprime, bprime;

	rprime = r / 255;
	gprime = g / 255
	bprime = b / 255;

	cmax = Math.max(rprime, gprime, bprime);
	cmin = Math.min(rprime, gprime, bprime);
	delta = cmax - cmin;
	
	
	l = (cmax + cmin) / 2;

	if (delta == 0) {
		s = 0;
		h = 0;
	} else {
		s = delta / (1 - Math.abs(2 * l - 1));

		if (rprime == cmax) {
			h = 60 * (gprime - bprime) / delta;
		} else if (gprime == cmax) {
			h = 120 + 60 * (bprime - rprime) / delta;
		} else {
			h = 240 + (rprime - gprime) / delta;
        }

		while (h < 360) {
			h += 360;
		}
		while (h > 360) {
			h -= 360;
        }

	}

	$("#hslValue").text("HSL: " + Math.round(h) + "\u00B0" + ", " + Math.round(s * 100) + "%, " + Math.round(l * 100) + "%");

}


/*generate random color (used for random button and game setup)*/
function randColorExplore() {
	let r = Math.floor(Math.random() * 256);
	let g = Math.floor(Math.random() * 256);
	let b = Math.floor(Math.random() * 256);
	processRGB(r, g, b);	
	$("#rInput").val(r);
	$("#gInput").val(g);
	$("#bInput").val(b);
	
}


/* game setup */
function gameStart() {
	secretR = Math.floor(Math.random() * 256);
	secretG = Math.floor(Math.random() * 256);
	secretB = Math.floor(Math.random() * 256);
	secretR = 100; secretG = 100; secretB = 100;
	$("#colorBox").css("background-color", "rgb(" + secretR + "," + secretG + "," + secretB + ")");
	$("#guess").css("display", "inline-block");
	$("#congratsMessage").text("");
	guesses = 0;
	clearHistory();
}

/*INCOMPLETE - check guess*/
function checkGuess() {
	/*check validity of input*/
	let guessR = $("#rInput").val();
	let guessG = $("#gInput").val();
	let guessB = $("#bInput").val();
	guesses += 1;
	if (guessR == secretR && guessG == secretG && guessB == secretB) {
		$("#guess").css("display", "none");
		totalGuesses = parseInt(totalGuesses) + guesses;
		totalGames = parseInt(totalGames) + 1;
		document.cookie = "totalGames=" + totalGames;
		document.cookie = "totalGuesses =" + totalGuesses;	

		if (guesses == 1){
			$("#congratsMessage").text("Congrats! You got it in	1 guess.");
		} else {
			$("#congratsMessage").text("Congrats! You got it in " + guesses + " guesses.");
		}
	} 
	historyAdd(guessR, guessG, guessB);
}


/*sanitize input*/
function updateValue() {
	
	let currentR = $("#rInput").val();
	let currentG = $("#gInput").val();
	let currentB = $("#bInput").val();
	let setR = 0;
	let setG = 0;
	let setB = 0;


	for (let i = 0; i < currentR.length; i++) {
		if (currentR[i] >= '0' && currentR[i] <= '9') {
			
			setR *= 10;
			setR += parseInt(currentR[i]);
			
        }
	}
	for (let i = 0; i < currentG.length; i++) {
		if (currentG[i] >= '0' && currentG[i] <= '9') {

			setG *= 10;
			setG += parseInt(currentG[i]);

		}
	}
	for (let i = 0; i < currentB.length; i++) {
		if (currentB[i] >= '0' && currentB[i] <= '9') {

			setB *= 10;
			setB += parseInt(currentB[i]);

		}
	}

	setR = setBounds(setR);
	setG = setBounds(setG);
	setB = setBounds(setB);

	$("#rInput").val(setR);
	$("#gInput").val(setG);
	$("#bInput").val(setB);

	if (!playMode) {
		processRGB(setR, setG, setB);
	} else {
		convertRGB(setR, setG, setB);
    }

}

function setBounds(colorNum) {
	if (colorNum < 0) {
		return 0;
	} if (colorNum > 255) {
		return 255;
	} return colorNum;
}

/*manipulating HTML for help and stats screen*/
function displayHelp() {

	$("#grayout").toggle(10);

	$("#helpPage").toggle(900);
}

function displayStats() {
	if (getCookie("totalGames") == 0) {
		$("#avgGuess").text(0);
	}
	else {
		$("#avgGuess").text(Math.round((getCookie("totalGuesses") / getCookie("totalGames")) * 10) / 10);
	}
	$("#gamesPlayed").text(getCookie("totalGames"));
	$("#grayout").toggle(10);

	$("#statsPage").toggle(900);
}

function back(id) {
	$("#grayout").toggle(10);
	$(id).toggle(900);
}


