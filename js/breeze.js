/**
 * Created by quetwo on 2/8/2017.
 *
 * This is provided as an example on how to use the Avaya ECC Component.  No warranty provided on this code.  Use at your own risk.
 */

function placePhoneCall(callFrom, callTo, serverIP)
{
    // this function makes an AJAX call to the EDP server to place a phone call.  The important things to note on this
    // is the type (post), the URL (going to the EngagementCallControl snap-in), and the content-type.  The cross-domain
    // portion is so that the AJAX call is allowed to a different domain than is hosting this JS file, and the xhrFields
    // to allow the CORS to be transmitted.
    //
    // success will return a JS object with two fields, callId and the statusUrl.

    $.ajax
    (
        {
            type : "POST",
            url  : "http://" + serverIP + "/services/EngagementCallControl/calls",
            data : '{"from" :' + callFrom + ', "to": ' + callTo + ' }',
            contentType: "application/json",
            crossDomain: true,
            xhrFields: {withCredentials: true},
            success: finishPlacePhoneCall
        }
    )
}

function finishPlacePhoneCall(data)
{
    console.log(data);
    writeToServerResponseArea('Make Call Succeeded with the following data\n'+"callID : " + data.callId + '\n' + "statusUrl: " + data.statusUrl);
}

function getPhoneConnectionData(callFrom, serverIP)
{
    $.get( "http://" + serverIP + "/services/EngagementCallControl/addresses/" + callFrom + "/connections", finishGetPhoneConnectionData);
}

function finishGetPhoneConnectionData(data)
{
    console.log(data);
    callId = data.connections[0].callId;
    connectionId = data.connections[0].id;
    writeToServerResponseArea('Query was successful.\ncallId = ' + callId + '\nconnectionId = ' + connectionId);
}




function writeToServerResponseArea(entry)
{
    $("#logArea").append("[ " + new Date().toTimeString() + " ] " + entry + "\n");
}
