/*TODO

error handling for failing to connect
rewrite affirmation database so no need to download all of it
display previously gotten message if already drawn
*/


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, push, child, set, get } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
//setup firebase
const firebaseConfig = {
    apiKey: "AIzaSyAKEMSytCUecQU9qB2j2Iqu5AZPO7fJGuE",
    authDomain: "affirmation-generator-7ea6e.firebaseapp.com",
    databaseURL: "https://affirmation-generator-7ea6e-default-rtdb.firebaseio.com",
    projectId: "affirmation-generator-7ea6e",
    storageBucket: "affirmation-generator-7ea6e.appspot.com",
    messagingSenderId: "1014236230461",
    appId: "1:1014236230461:web:428ca2d055efaf5b9f0b54"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();
const proposedRef = ref(database, 'proposed');
const affRef = ref(database, 'affirmations');



var affList = [];
var keyList = [];

var currentDate = new Date();
var lastAffirmDate, lastSubmitDate;
var affirmAvailable = false;
var submitAvailable = false;



//onload
lastAffirmDate = getCookie("affirmDate");
//checking if claiming affirmation available
if (lastAffirmDate == null) {
    affirmAvailable = true;
} else {
    
    lastAffirmDate = Date.parse(lastAffirmDate);
    lastAffirmDate = new Date(lastAffirmDate);
  
    if (currentDate.getDate() != lastAffirmDate.getDate() || currentDate.getMonth() != lastAffirmDate.getMonth() || currentDate.getFullYear() != lastAffirmDate.getFullYear()) {
        affirmAvailable = true;
    } else {
        affirmAvailable = false;
    }
}

//checking if uploading affirmation available
lastSubmitDate = getCookie("submitDate");
if (lastSubmitDate == null) {
    submitAvailable = true;
} else {
    lastSubmitDate = Date.parse(lastSubmitDate);
    lastSubmitDate = new Date(lastSubmitDate);
    if (currentDate.getDate() != lastSubmitDate.getDate() || currentDate.getMonth() != lastSubmitDate.getMonth() || currentDate.getFullYear() != lastSubmitDate.getFullYear()) {
        submitAvailable = true;
    } else {
        submitAvailable = false;
    }
}
//updating buttons based on availability
if (affirmAvailable) {

    get(affRef).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            affList.push(childSnapshot.val());
            keyList.push(childSnapshot.ref.key);
        })
    });
    $("#claimButton").click(claimOnclick);
} else {
    $("#claimButton").html("<p>You already claimed your affirmation for today</p>");
    $("#claimButton").addClass("wait");
}

if (!submitAvailable) {
    $("#uploadButton").html("<p>You already uploaded an affirmation today");
    $("#uploadButton").addClass("wait");
} else {
    $("#uploadButton").click(uploadOnclick);
}



//onclick functions for buttons
//gets random affirmation  + claims, increments # claims by 1, and passes to display affirmation function
function claimOnclick() {
    setCookie("affirmDate", currentDate);
    let index = Math.floor(Math.random() * affList.length);
    let claimedRef = ref(database, "affirmations/" + keyList[index]);
    let currentLikes;
    get(claimedRef).then((snapshot) => {
        currentLikes = snapshot.val().claimed;
        currentLikes += 1;
        set(ref(database, "affirmations/" + keyList[index] + "/claimed"), currentLikes);

        $("#claimButton").html("<p>You already claimed your affirmation for today</p>");
        $("#claimButton").addClass("wait");
        $("#claimButton").off();
        affirmAvailable = false;

        displayAffirmation(affList[index].text, currentLikes);
    })



}

//prompts user for affirmation and uploads to proposed database
function uploadOnclick() {
    $("#grayout").toggle(100);
    $("#grayout").click(closeSubmit);
    $("#affirmationPromptDisplay").toggle(500);
    $("#submitButton").click(submitAffirmationOnclick);

}

//close submit window
function closeSubmit() {
    $("#grayout").toggle(100);
    $("#grayout").off("click");
    $("#affirmationPromptDisplay").toggle(500);
}

//submit affirmation to db
function submitAffirmationOnclick() {
    let message = $("#affirmationInput").val();
    proposeAffirmation(message);
    let d = new Date();
    setCookie("submitDate", d);
    $("#uploadButton").html("<p>You already uploaded an affirmation today</p>");
    $("#uploadButton").addClass("wait");
    $("#uploadButton").off();
    submitAvailable = false;

    $("#pleaseEnterMessage").text("Thank you for submitting your affirmation.");
    $("#submitButton").toggle();
    $("#affirmationInput").toggle();
}

function displayAffirmation(message, likes) {
    $("#grayout").toggle(100);
    $("#grayout").click(closeClaim);
    $("#affirmationDisplay").toggle(500);
    $("#affirmationMessage").text(message);
    $("#claimedNumber").text("Claimed by " + likes);
}

//close affirmationdisplay panel
function closeClaim() {
    $("#affirmationDisplay").toggle(500);
    $("#grayout").toggle(100);
    $("#grayout").off('click');
}


//push proposed affirmation to database
function proposeAffirmation(affirmationText) {
    set(push(proposedRef), {text: affirmationText});
}

//function for reading cookies
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


function setCookie(cookieName, cookieValue) {
    const d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}
