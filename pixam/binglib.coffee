AppId = "AppId=8898364D49E980E9B888314449B32FDCC30B248A";
Query = "Query="
Sources = "Sources=image"
Version = "Version=2.0"
count = 50
offset = 0

doMyThing = ->
    $('#imageResults').html ""
    searchTerms = $('#txtQuery').val().replace(" ", "+")
    count = $('#webCount').val()
    arr = [AppId,
           Query + searchTerms,
           Sources,
           Version,
           "Image.Count=" + count,
           "Image.CountSpecified=true"
           "Image.Offset=" + offset,
           "JsonType=callback",
           "JsonCallback=?"]

    requestStr = "http://api.search.live.net/json.aspx?" + arr.join("&")
    #alert requestStr
    $.ajax
            type: "GET"
            url: requestStr
            dataType: "jsonp"
            success: (msg) ->  searchCompleted(msg)
            error: (msg)  ->   alert "Something hasn't worked\n" + msg

searchCompleted = (response) ->
    errors = response.SearchResponse.Errors
    if errors?
        #There are errors in the response. Display error details.
        alert "errors: " + errors

    else
        # There were no errors in the response. Display the Web results.
        results = response.SearchResponse.Image.Results;
        for result in results
            $('#imageResults').append "<a href='#{result.MediaUrl}'><img src='#{result.Thumbnail.Url}' /></a>"


registerSearch = ->
    $('#btnSearch').click -> doMyThing()
    $('#txtQuery, #webCount').keypress (e) -> if e.which == 13 then doMyThing()

$(document).ready ->
    registerSearch()