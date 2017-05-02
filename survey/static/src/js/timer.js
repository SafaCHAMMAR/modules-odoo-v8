
$(document).ready(function () {
	

	//alert("hello world!");
	/*var temps;
	var arret=false;
	//var minutes= $('.js_surveyform').attr("data-timer");*/
	
	/*console.log(minutes);
	console.log(m);
	function tick(seconds,mins) {
		console.log("tick function");
        //This script expects an element with an ID = "counter". You can change that to what ever you want. 
        			console.log("mins "+mins);
        			console.log("seconds "+seconds);
        			var counter = document.getElementById("counter");
        			var current_minutes = mins-1
        			seconds--;
        			temps=current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
        			console.log("temps="+temps);
        			counter.innerHTML = temps;
        			//$("#counter").text(temps);
        			if(!arret){
        			console.log("arret"+arret);
        			if( seconds > 0 ) {
            		setTimeout(tick(seconds,mins), 3000);
        			} else {
            		if(mins > 1){
                	countdown(mins-1);           
            		}
       				}
    				}
    				console.log(mins+"fin tick()");
    			};

    			function countdown(x){
    				console.log("countdown function!!");
    				console.log("x="+x);
    				var seconds = 60;
    				var mins =x;
    				tick(seconds,mins);
    				console.log("fin countdown");
				};
				//function hello(){console.log("hello world!!");};
	$("#counter").click( function () {countdown(m);});//function(){console.log("hello world!!");});//countdown(m));

*/

/*var passTime=Cookies.get('counter');
var test=Cookies.get('test_id');
console.log(test);
console.log("cookies counter="+passTime);*/

/*function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
*/
/*function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var passTime=getCookie("counter");
    /*if (passTime != "") {
        alert("Welcome again " + user);
    } else {
       user = prompt("Please enter your name:","");
       if (user != "" && user != null) {
           setCookie("username", user, 30);
       }
    }*/

var the_form = $('.js_surveyform');
var submit_controller = the_form.attr("data-submit");

console.log("cookie passTime : "+$.cookie("passTime"));
//}
//console.log($("#counter").attr("data-timer"));
var minutes=$("#counter").attr("data-timer");
//console.log("$('#idtest').attr('value') "+$('#idtest').attr('value') );


var m=parseInt(minutes)*60;
console.log("timer "+minutes);
//console.log("temps precedent ="+$.cookie("passTime"));
if(!_.isUndefined($.cookie("passTime"))){
var time=$.cookie("passTime");//temps ecoulé dans la page precedente
console.log("$.cookie('passTime') 2 ="+$.cookie("passTime"))
var reg=new RegExp("[ :]+", "g");
    var tableau=time.split(reg);
    minute=parseInt(tableau[0]);
    sec=parseInt(tableau[1]);
    console.log("minute="+minute);
    console.log("sec="+sec);
    newM=minute*60+sec;
    console.log("newM="+newM);
if(newM>0){
    m=newM;
    //$('#idtest').attr('value',m)
    //console.log("$('#idtest').attr('value')(pres m) "+$('#idtest').attr('value') );
    }
  }


//console.log("test parseInt "+parseInt("02"));

//for cookie
//passTime=parseInt($("#counter").attr("data-timer"));
//$.cookie('passTime',passTime,{expires: 7, path: '/'});

//read initial timer


function get_elapsed_time_string(total_seconds) {
    function pretty_time_string(num) {
      return ( num < 10 ? "0" : "" ) + num;
    }

    var hours = Math.floor(total_seconds / 3600);
    total_seconds = total_seconds % 3600;
    var minutes = Math.floor(total_seconds / 60);
    total_seconds = total_seconds % 60;
    var seconds = Math.floor(total_seconds);
  // Pad the minutes and seconds with leading zeros, if required
    hours = pretty_time_string(hours);
    minutes = pretty_time_string(minutes);
    seconds = pretty_time_string(seconds);
  // Compose the string for display
    var currentTimeString = /*hours + ":" + */minutes + ":" + seconds;
    return currentTimeString;
  }


var elapsed_seconds =m;
var cookieTime=$.cookie('passTime');

setInterval(function() {    
    elapsed_seconds = elapsed_seconds - 1;
    passTime=$("#counter").text();
    var date = new Date();
   // var delai = 3;
    date.setTime(date.getTime() + (m * 1000));
    $.cookie('passTime',passTime, {expires: date, path: '/'});
    console.log("$.cookie('passTime')="+$.cookie('passTime'));
    //cookieTime=$.cookie('passTime');

    if(elapsed_seconds>-1){
      $('#counter').text(get_elapsed_time_string(elapsed_seconds));}
      $('.js_surveyform').ajaxForm({
        url: submit_controller,
        type: 'POST',                       // submission type
        dataType: 'json', 
        data:{"testData":elapsed_seconds},                // answer expected type
        beforeSubmit: function(){           // hide previous errmsg before resubmitting
            $('.js_errzone').html("").hide();
        },
        success: function(response, status, xhr, wfe){ // submission attempt
            if(_.has(response, 'errors')){  // some questions have errors
                _.each(_.keys(response.errors), function(key){
                    $("#" + key + '>.js_errzone').append('<p>' + response.errors[key] + '</p>').show();
                });
                return false;
            }
            else if (_.has(response, 'redirect')){      // form is ok
                window.location.replace(response.redirect);
                return true;
            }
            else {                                      // server sends bad data
                console.error("Incorrect answer sent by server");
                return false;
            }
        },
        timeout: 5000,
        error: function(jqXHR, textStatus, errorThrown){ // failure of AJAX request
            $('#AJAXErrorModal').modal('show');
        }
    });
    
    }, 1000);

//$("#test_id").click(function(){console.log(Cookies.get('test_id'));});
 


}) 


