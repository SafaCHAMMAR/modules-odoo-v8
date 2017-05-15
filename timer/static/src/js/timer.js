
$(document).ready(function () {
	//alert("em=",em);

	
var the_form = $('.js_surveyform');
var submit_controller = the_form.attr("data-submit");
var minutes=$("#counter").attr("data-timer");
//var t1=$("#t1").attr("data-timeElapsed");
//console.log("t1= ",t1);
var m=parseInt(minutes)*60;
console.log("$.cookie(passtime) = ",$.cookie("passTime"))
console.log("$.cookie(elapsedTime) = ",$.cookie("elapsedTime"));
var em;
if(!_.isUndefined($.cookie("passTime"))|| !_.isUndefined($.cookie("elapsedTime")))
{
	/*var time=$.cookie("passTime");//temps ecoulé dans la page precedente
	var reg=new RegExp("[ :]+", "g");
	var tableau=time.split(reg);
	minute=parseInt(tableau[0]);
	sec=parseInt(tableau[1]);
	newM=minute*60+sec;
	if(newM>0){m=newM;}*/
    em=parseInt($.cookie("elapsedTime"));
    console.log("em=",em);
    if(em>0){m=em;}
    //if(em==0){m=1;}

  }
  if(em==0){
  		//alert("ajax em==0");
  		$.cookie('passTime','00:00',{path:'http://localhost:8069/survey/fill/'});
        $('.js_surveyform').ajaxForm({
            url:submit_controller,
            type: 'POST',                       // submission type
            dataType: 'json', 
            data:{"button_submit":"finish","testData":em},                // answer expected type
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

                //alert("response.redirect= "+response.redirect);
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
        $('.js_surveyform').submit();
        console.log("timeout!!!");
    }

//read initial timer
function get_elapsed_time_string(total_seconds) {
    function pretty_time_string(num) {return ( num < 10 ? "0" : "" ) + num;}
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
//var cookieTime=$.cookie('passTime');
console.log('hello');
passTime=$("#counter").text();
console.log(" hors set interval  ",$("#counter").text() );
//console.log('hello2');
//$.cookie('passTime',passTime, {expires: 7, path: '/'});



setInterval(function() { 
	console.log("ici set interval")   
    elapsed_seconds = elapsed_seconds - 1;
    //console.log("elapsed sec ds set interval ",elapsed_seconds)
    $.cookie('elapsedTime',elapsed_seconds,{path:'http://localhost:8069/survey/fill/'});
    passTime=$("#counter").text();
    //console.log("pfffffffffff passTime  ",passTime);

    var date = new Date();
    date.setTime(date.getTime() + (m * 1000));
    //$.cookie('passTime',passTime, {expires: date, path: 'http://localhost:8069/survey/fill/'});
    //console.log('\n set interval $.cookie(passtime) = ',$.cookie('passTime'));
    //$.cookie('test','True',{expires:1,path:'/'});
    if(elapsed_seconds>-1){
      $('#counter').text(get_elapsed_time_string(elapsed_seconds));}
      console.log("**em= ",em);
	//if ($.cookie('passTime')=='00:00'){


		//TIMEOUT
    if(em==1|| elapsed_seconds==0){//$.cookie('passTime')=='00:00'){
    	$('.js_surveyform').ajaxForm({
    		url:submit_controller,
    		type: 'POST',                       // submission type
        	dataType: 'json', 
        	data:{"button_submit":"finish","testData":elapsed_seconds},                // answer expected type
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

            	//alert("response.redirect= "+response.redirect);
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
    	$('.js_surveyform').submit();
    	console.log("timeout!!!");
    }

    /*setInterval(function() {
    	console.log("############setInterval 2###########");
    	$('.js_surveyform').ajaxForm({
        url: submit_controller,
        type: 'POST',                       // submission type
        dataType: 'json', 
        data:{"testData":elapsed_seconds},                // answer expected type
        beforeSubmit: function(){           // hide previous errmsg before resubmitting
            $('.js_errzone').html("").hide();
        },
        success: function(response, status, xhr, wfe){ // submission attempt
        	//console.log("hello");
        	//alert("hello");
        	//alert("*******response.state= "+response.state);
        	if(response.state=='done'){$.cookie('elapsedTime',0,{path:'http://localhost:8069/survey/fill/'});}
            if(_.has(response, 'errors')){  // some questions have errors
                _.each(_.keys(response.errors), function(key){
                    $("#" + key + '>.js_errzone').append('<p>' + response.errors[key] + '</p>').show();
                });
                return false;
            }
            else if (_.has(response, 'redirect')){      // form is ok
            	//alert("response.redirect= "+response.redirect)
				window.location.replace(response.redirect);
                //alert("******************************response.state= "+response.state);
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
    });},300);},1000);*/

    $('.js_surveyform').ajaxForm({
        url: submit_controller,
        type: 'POST',                       // submission type
        dataType: 'json', 
        data:{"testData":elapsed_seconds},                // answer expected type
        beforeSubmit: function(){           // hide previous errmsg before resubmitting
            $('.js_errzone').html("").hide();
            //passTime=$("#counter").text();
    		var date = new Date();
    		date.setTime(date.getTime() + (m * 1000));
    		//$.cookie('passTime',passTime, {expires: date, path: 'http://localhost:8069/survey/fill/'});
            /*alert("before submit");
            alert("read counter "+$("#counter").text());
        	alert("passtime"+$.cookie('passTime')+"em"+em);*/
        	//alert("cookie(elapsedTime)="+$.cookie("elapsedTime")+"ELAPSED_SECONDS="+elapsed_seconds);
        	//alert("before submit : "+$.cookie('elapsedTime'))
        	$.cookie('elapsedTime',elapsed_seconds, {expires: date, path: 'http://localhost:8069/survey/fill/'});
        	
        	//alert("before submit 2: "+$.cookie('elapsedTime'));
        },
        success: function(response, status, xhr, wfe){ // submission attempt
        	//setTimeout(function (){alert("succes"+$.cookie('elapsedTime'));
        	//$.cookie('elapsedTime',elapsed_seconds, {expires: date, path: 'http://localhost:8069/survey/fill/'});
        	//alert("succes method :cookie(elapsedTime)="+$.cookie("elapsedTime")+"ELAPSED_SECONDS="+elapsed_seconds);
        	//console.log("hello");
        	//alert("hello");
        	//alert("*******response.state= "+response.state);
        	/*passTime=$("#counter").text();
    		var date = new Date();
    		date.setTime(date.getTime() + (m * 1000));
    		$.cookie('passTime',passTime, {expires: date, path: 'http://localhost:8069/survey/fill/'});*/
        	/*alert("&&&&&&&&&&&&&&&&&&ajax&&&&&&&&&&&");
        	alert("read counter "+$("#counter").text());
        	alert($.cookie('passTime')+"em"+em);
        	alert("cookie(elapsedTime)="+$.cookie("elapsedTime")+"ELAPSED_SECONDS="+elapsed_seconds);*/
        	/*passTime=$("#counter").text();
    		alert("read counter "+$("#counter").text());
        	//alert($.cookie('passTime')+"*****"+em);
        	//$.cookie('elapsedTime',passTime, {expires: date, path: 'http://localhost:8069/survey/fill/'});
    		var date = new Date();
    		date.setTime(date.getTime() + (m * 1000));
    		$.cookie('passTime',passTime, {expires: date, path: 'http://localhost:8069/survey/fill/'});*/

        	if(response.state=='done'){$.cookie('elapsedTime',0,{path:'http://localhost:8069/survey/fill/'});}
            if(_.has(response, 'errors')){  // some questions have errors
                _.each(_.keys(response.errors), function(key){
                    $("#" + key + '>.js_errzone').append('<p>' + response.errors[key] + '</p>').show();
                });
                return false;
            }
            else if (_.has(response, 'redirect')){      // form is ok
            	//alert("response.redirect= "+response.redirect)
				window.location.replace(response.redirect);
                //alert("******************************response.state= "+response.state);
                return true;
            }
            else {                                      // server sends bad data
                console.error("Incorrect answer sent by server");
                return false;
            }
        //},200);

        },
        timeout: 5000,
        error: function(jqXHR, textStatus, errorThrown){ // failure of AJAX request
            $('#AJAXErrorModal').modal('show');
        }
    });
    
    }, 1000);

 


}) 


