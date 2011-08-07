var cFont;
var iFont;
var white = "#fff";
var black = "#000";
var calmRed = "#CC2213";
var paper;
var odd = true;
var username;
var borderSize = 3;
var width = 1000;
var height = 1000;
var noBlocksWide = 10;
var noBlocksHigh = 10;
var judder = 15;
var totaldrawn = noBlocksWide * noBlocksWide;
var padRoomX = borderSize * (noBlocksWide + 1);
var padRoomY = borderSize * (noBlocksHigh + 1);
var blockWidth = width / noBlocksWide;
var drawPause = 1000;

function allReady() {
    $('#view').click(requestTweets);
    var drawingCanvas = document.getElementById('tmCanvas');
    paper = Raphael(drawingCanvas, width + padRoomX, height + padRoomY + borderSize);
    cFont = paper.getFont("Consolbs", 800);
    iFont = paper.getFont("Consolis", 800, "italic");
}

function createBoard() {
    var c = paper.rect(0, 0, width + padRoomX, height + padRoomX);
    c.attr("stroke", black);
    c.attr("fill", white);
}

function readFields() {
    username = $('#username').val();
    var bs = $('#blocksX').val();
    noBlocksWide = parseInt(bs);
    bs = $('#blocksY').val();
    noBlocksHigh = parseInt(bs);
    bs = $('#judder').val();
    judder = parseInt(bs);
    renderSpeed = $('#renderSpeed option:selected').val();
    if (renderSpeed == "fast") {
        drawPause = 1000;
    }
    else if (renderSpeed == "slow") {
        drawPause = 4000;
    }
    else {
        drawPause = 2000;
    }

}
function setCalculatedValues() {
    totaldrawn = noBlocksWide * noBlocksHigh;
    padRoomX = borderSize * (noBlocksWide + 1);
    padRoomY = borderSize * (noBlocksHigh + 1);
    blockWidth = width / noBlocksWide;
    height = blockWidth * noBlocksHigh;
}
function requestTweets() {
    readFields();
    setCalculatedValues();
    //var drawingCanvas = document.getElementById('tmCanvas');
    //paper = Raphael(drawingCanvas, width + padRoomX + borderSize, height + padRoomY + borderSize);
    paper.clear();
    liveTweets(username);
}

function drawTweet(tweetNo, xPos, yPos, odd) {
    var tweet = getInfo(tweets[tweetNo]);
    var boxSize = blockWidth / tweet.side;
    var font;
    if (odd) {
        font = iFont;
    }
    else {
        font = cFont;
    }
    var textOffset = borderSize + (boxSize / 2);
    var startChar = 0;
    var endChar = tweet.side;
    var yOffset = textOffset;
    for (var textLine = 0; textLine < tweet.side; textLine++) {
        var c = paper.print(xPos, yPos + yOffset, tweet.text.substring(startChar, endChar), font, 1.8 * boxSize);
        for (var cIndex = 0; cIndex < c.length; cIndex++) {
            var rotateBy = Math.floor(Math.random() * judder * 2) - judder;
            if (rotateBy != 0) {
                c[cIndex].rotate(rotateBy);
            }
        }
        startChar += tweet.side;
        endChar += tweet.side;
        yOffset += boxSize;
    }
}

function drawTweets() {
    var len = tweets.length;
    var output = "";
    var xPos = borderSize;
    var yPos = borderSize;
    var tweetNo = 0;
    for (var i = 0; i < totaldrawn; i++) {

        (function() {
            var tn = tweetNo;
            var x = xPos;
            var y = yPos;
            var o = odd;
            setTimeout(function() {
                drawTweet(tn, x, y, o);
            }, i * drawPause);
        })();

        xPos += borderSize + width / noBlocksWide;
        if (xPos >= width) {
            xPos = borderSize;
            yPos += borderSize + blockWidth;
            if ((noBlocksWide % 2) == 0) {
                //alert(odd);
                odd = !odd;
            }
        }

        tweetNo++;
        if (tweetNo >= len) {
            tweetNo = 0;
        }
        odd = !odd;
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

    var yPos = startY;
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

function liveTweets(username) {
    var numPosts = 130;
    var jsonData;
    var url = "http://twitter.com/status/user_timeline/" + username + ".json?count=" + numPosts + "&callback=?";

    $.getJSON(url, function(data) {
        tweets = data;
        drawTweets();
    });
}

function getInfo(tweet) {
    return {date: tweet.created_at,
        text: tweet.text,
        length: tweet.text.length,
        side:  Math.round(Math.sqrt(tweet.text.length) + 0.5)
    }
}