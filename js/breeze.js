/**
 * Created by quetwo on 2/8/2017.
 *
 * This is provided as an example on how to use the Avaya ECC Component.  No warranty provided on this code.  Use at your own risk.
 *
 * This code is licensed under the Apache 2.0 License.  Please refer to the LICENSE file for more information.
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
    // the "get phone connection" has the breeze server query the AES server to find out of there are any active phone calls
    // the AES server will only know about phones that are "watched", so it may return no results even though there is a call
    // connected.  You will need to subscribe to events in order to get a guaranteed accurate picture.

    $.get( "http://" + serverIP + "/services/EngagementCallControl/addresses/" + callFrom + "/connections", finishGetPhoneConnectionData);
}

function finishGetPhoneConnectionData(data)
{
    console.log(data);
    callId = data.connections[0].callId;
    connectionId = data.connections[0].id;
    writeToServerResponseArea('Query was successful.\ncallId = ' + callId + '\nconnectionId = ' + connectionId);
}

function transferCall(callTo, serverIP)
{
    // this will transfer a call to another user.  We will assume we've done the "get call data" button and populated the
    // callId and ConnectionID fields.  You can also get this from the events that are sent via a subscription (this is
    // the preferred method).

    $.ajax
    (
        {
            type : "POST",
            url  : "http://" + serverIP + "/services/EngagementCallControl/calls/" + callId + "/connections/" + connectionId + "?action=transfer",
            data : "{transferTo:" + callTo + "}",
            contentType: "application/json",
            crossDomain: true,
            xhrFields: {withCredentials: true},
            success     : finishTransferCall
        }
    )
}

function finishTransferCall(data)
{
    console.log(data);
    writeToServerResponseArea('Transfer is complete.');
}


// the following function is used to show the log on the screen.

function writeToServerResponseArea(entry)
{
    $("#logArea").append("[ " + new Date().toTimeString() + " ] " + entry + "\n");
}
