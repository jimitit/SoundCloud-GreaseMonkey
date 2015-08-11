// ==UserScript==
// @name        SoundCloud
// @namespace   https://soundcloud.com/
// @description SoundCloud Script
// @include     https://soundcloud.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==

//Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function() {
   //alert($('.l-content').length);
});

waitForKeyElements(".soundStats", filter);

function filter (jNode) {
   //-- DO WHAT YOU WANT TO THE TARGETED ELEMENTS HERE.
  
  var playCntSpan = jNode.find('li:first').find("span[aria-hidden='true']");
  var playCnt = playCntSpan.html();
      playCnt = parseInt(playCnt.replace(/\,/g,''));
  
  if (playCnt < 50000)
  {
    $(playCntSpan).parents('li.soundList__item:first').hide();
  }
  //jNode.next('span:first').css ("background", "yellow"); // example
}


function waitForKeyElements (
selectorTxt,    /* Required: The jQuery selector string that:first.hide();
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
)
{
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                actionFunction (jThis);
                jThis.data ('alreadyFound', true);
            }
        } );
        btargetsFound   = true;
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                500
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
