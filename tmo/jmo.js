/**
 * Created by .
 * User: mark
 * Date: 25/06/11
 * Time: 14:29
 * To change this template use File | Settings | File Templates.
 */
var cFont;
var iFont;
var white = "#fff";
var black = "#000";
var calmRed = "#CC2213";
var paper;
var odd = true;

var borderSize = 3;
var width = 1000;
var height = 1000;
var noBlocksWide = 10;
var noBlocksHigh = 10;
var totaldrawn = noBlocksWide * noBlocksWide;
var padRoomX = borderSize * (noBlocksWide + 1);
var padRoomY = borderSize * (noBlocksHigh + 1);
var blockWidth = width / noBlocksWide;
var drawPause = 1000;

function allReady() {
    $('#view').click(requestTweets);
    //getTwitterJson();
    var drawingCanvas = document.getElementById('tmCanvas');
    paper = Raphael(drawingCanvas, width + padRoomX, height + padRoomY + borderSize);
    cFont = paper.getFont("Consolbs", 800);
    iFont = paper.getFont("Consolis", 800, "italic");
    //drawTweets();
}

function createBoard() {
    var c = paper.rect(0, 0, width + padRoomX, height + padRoomX);
    c.attr("stroke", black);
    c.attr("fill", white);
}

function requestTweets()
{
    paper.clear();

    var username =  $('#username').val();
    var bs = $('#blocksX').val();
    noBlocksWide =  parseInt(bs);
    bs = $('#blocksY').val();
    noBlocksHigh =  parseInt(bs);

    totaldrawn = noBlocksWide * noBlocksHigh;
    padRoomX = borderSize * (noBlocksWide + 1);
    padRoomY = borderSize * (noBlocksHigh + 1);
    blockWidth = width / noBlocksWide;
    height = blockWidth * noBlocksHigh;
    var drawingCanvas = document.getElementById('tmCanvas');
    paper = Raphael(drawingCanvas, width + padRoomX + borderSize, height + padRoomY + borderSize);
    //createBoard();
    liveTweets(username);
}

function drawTweet(tweetNo, xPos, yPos) {
    var tweet = getInfo(tweets[tweetNo]);
    var boxSize = blockWidth / tweet.side;
    var font;
    if (odd){
        font = iFont;
    }
    else{
        font = cFont;
    }
    odd = !odd;
    var textOffset = borderSize + (boxSize / 2);
    var startChar = 0;
    var endChar = tweet.side;
    var yOffset = textOffset;
    for (var textLine = 0; textLine < tweet.side; textLine++) {
        var c = paper.print(xPos, yPos + yOffset, tweet.text.substring(startChar, endChar), font, 1.8 * boxSize);
        for (var cIndex=0; cIndex < c.length; cIndex++){
            max = 45;
            var rotateBy = Math.floor(Math.random() * max * 2) - max;
            c[cIndex].rotate(rotateBy);
            //var plusVal = Math.floor(Math.random()*40);
            //var scaleBy = (80 + plusVal) / 1000.0;
            //alert(scaleBy);
           // c[cIndex].scale(scaleBy, scaleBy);
        }
        startChar += tweet.side;
        endChar += tweet.side;
        yOffset += boxSize;
    }

       // drawGrid(xPos, yPos,  tweet.side);
}
function drawTweets() {
    var len = tweets.length;
    var output = "";
    var xPos = borderSize;
    var yPos = borderSize;
    var tweetNo = 0;
    for (var i = 0; i < totaldrawn; i++) {

        (function(){
            var tn = tweetNo;
            var x = xPos;
            var y = yPos;
            setTimeout(function(){
                drawTweet(tn, x, y);
            }, i * drawPause );
        })();

        xPos += borderSize + width / noBlocksWide;
        if (xPos >= width) {
            xPos = borderSize;
            yPos += borderSize + blockWidth;
        }

        tweetNo++;
        if (tweetNo >= len) {
            tweetNo = 0;
        }
    }
}

function drawBox(x, y, boxSize) {
    var c = paper.rect(x, y, boxSize, boxSize);
    c.attr("stroke", black);
    c.attr("fill", white);
}
function drawGrid(startX, startY, side) {
    var bounds = width / noBlocksWide;
    var boxSize = blockWidth / side;

    var yPos = startY ;
    var yOffset = bounds;
    var xOffset = 0;
    for (var x = 0; x < side; x++) {
        xPos = startX + (x * boxSize);
        drawLine(xPos, yPos, xOffset, yOffset);
    }
    var xPos = startX;
    var xOffset = bounds;
    var yOffset = 0;
    for (var y = 0; y < side; y++) {
        yPos = startY + (y * boxSize);
        drawLine(xPos, yPos, xOffset, yOffset);
    }
}

function drawLine(xPos, yPos, xOffset, yOffset) {
    var command = "M" + xPos + " " + yPos + "L" + (xPos + xOffset) + " " + (yPos + yOffset);
    var c = paper.path(command);
    c.attr("stroke", black);
    c.attr("fill", white);
}

function getTwitterJson() {
    var len = tweets.length;
    var output = "";
    for (var i = 0; i < len; i++) {
        var tweet = getInfo(tweets[i]);
        output = output + tweet.date + ": " + tweet.length + ", " + tweet.side + "<br />";
    }
    $('#info').html(output);
}

function liveTweets(username)
{
     var numPosts = 130;
     var jsonData;
     var url = "http://twitter.com/status/user_timeline/" + username + ".json?count="+numPosts+"&callback=?";
     //var url = " http://api.twitter.com/1/statuses/user_timeline.json?screen_name=" + username + "&count="+numPosts+"&callback=?";

     $.getJSON( url, function( data ){
         tweets = data;
         drawTweets();
     //jsonData = JSON.stringify(data);
     //alert(jsonData);
     });
}

function getInfo(tweet) {
    return {date: tweet.created_at,
        text: tweet.text,
        length: tweet.text.length,
        side:  Math.round(Math.sqrt(tweet.text.length) + 0.5)
    }
}