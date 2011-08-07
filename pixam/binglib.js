// Begin jQuery functions
$(function() {
    $('#btnSearch').click(function() {
        Search();
    });

    // Replace the following string with the AppId you received from the
    // Bing Developer Center.
    var AppId = "AppId=8898364D49E980E9B888314449B32FDCC30B248A";
    var Query = "Query="
    var Sources = "Sources=image";
    var Version = "Version=2.0";
    var WebCount = 10;
    var WebOffset = 0;


    function Search() {
        var searchTerms = $('#txtQuery').val().replace(" ", "+");
        var arr = [AppId, Query + searchTerms, Sources, Version,
                  "Web.Count=" + WebCount, "Web.Offset=" + WebOffset,
                  "JsonType=callback", "JsonCallback=?"];

        var requestStr = "http://api.search.live.net/json.aspx?" + arr.join("&");

        $.ajax({
            type: "GET",
            url: requestStr,
            dataType: "jsonp",
            success: function(msg) {
                SearchCompleted(msg);
            },
            error: function(msg) {
                alert("Something hasn't worked\n" + msg.d);
            }
        });
    }

    function SearchCompleted(response) {

        var errors = response.SearchResponse.Errors;
        if (errors != null) {
            // There are errors in the response. Display error details.
            alert("errors: " + errors);
        }
        else {
            // There were no errors in the response. Display the Web results.
            var results = response.SearchResponse.Image.Results;
            //alert("hooray!" + results.length);
            for (var i=0; i < results.length; i++)
            {
                //$('#imageResults').append("<img src='"+ results[i].MediaUrl+"' />");
                //$('#imageResults').append("<img src='"+ results[i].Thumbnail.Url+"' />");
            }
        }
    }

});
