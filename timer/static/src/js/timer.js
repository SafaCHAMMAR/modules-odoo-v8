
$(document).ready(function () {
    
var the_form = $('.js_surveyform');
var submit_controller = the_form.attr("data-submit");
var minutes=$("#counter").attr("data-timer");
var m=parseInt(minutes)*60;

if(!_.isUndefined($.cookie("passTime"))){
    var time=$.cookie("passTime");//temps ecoulé dans la page precedente
    var reg=new RegExp("[ :]+", "g");
    var tableau=time.split(reg);
    minute=parseInt(tableau[0]);
    sec=parseInt(tableau[1]);
    newM=minute*60+sec;
    if(newM>0){m=newM;}
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
var cookieTime=$.cookie('passTime');

setInterval(function() {    
    elapsed_seconds = elapsed_seconds - 1;
    passTime=$("#counter").text();
    var date = new Date();
    date.setTime(date.getTime() + (m * 1000));
    $.cookie('passTime',passTime, {expires: date, path: '/'});
    $.cookie('test','True',{expires:1,path:'/'});
    if(elapsed_seconds>-1){
      $('#counter').text(get_elapsed_time_string(elapsed_seconds));}
    if ($.cookie('passTime')=='00:00'){
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
    
    }, 1000);

 


}) 


