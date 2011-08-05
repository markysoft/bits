maxImages = 6;
showTweetLinks = 'all';
blogData = "";


$(document).ready(showLatest);

function showLatest() {
    showBlogger();
    showFlickr();
}

function showBlogger() {
    $.getJSON("http://markyport.appspot.com/blogger?callback=?", bloggerCallback);
}

function bloggerCallback(data) {
    blogData = data;
    showPost(0);

    $("<h3>Older Posts</h3>").appendTo("#otherPosts");
    for (i in data) {
        $("<div class='linky' onclick='showPost(\""+ i + "\")'><a>" + data[i].title + "</a></div>").appendTo("#otherPosts");
    }

}

function showPost(i) {
    $("#latestPost").html("<h3>" + blogData[i].title + "</h3>" + blogData[i].content);
}

function showFlickr() {
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?id=93733517@N00&lang=en-us&format=json&jsoncallback=?", flickrCallback);
};

function flickrCallback(data) {
    $.each(data.items, appendImage);
}

function appendImage(i, item) {

    $("<div class='flickrImage'>" +
        "<a href='" + item.link + "' class='flickrLink'>" +
          "<img src='" + item.media.m + "' />" +
          "<div >" + item.title + "</div>" +
        "</a>" +
      "</div>").appendTo("#images");

    if (i == maxImages - 1) return false;
}