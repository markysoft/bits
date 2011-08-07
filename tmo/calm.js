
var white = "#fff";
var calmRed = "#CC2213";
var wordOneColour = white;
var wordTwoColour = white;
var wordThreeColour = white;


function drawBox(paper, x, y, width, height, fill, stroke) {
    var c = paper.rect(x, y, width, height);
    c.attr("stroke", stroke);
    c.attr("fill", fill);
}

function drawText(paper, width, yPos, word, font, colour, size) {
    var printthefont = paper.print(width / 2, yPos, word, font, size).attr({ fill: colour });
    var textWidth = printthefont.getBBox().width;
    moveit = textWidth / 2;
    printthefont.translate(-moveit, 0);
    if (textWidth > width) {
        var scaleBy = (width - (6 * margin))/ textWidth;
        printthefont.remove();
        drawText(paper, width, yPos - (size * (1 - scaleBy)/2), word, font, colour, size * scaleBy);
    }

}


function drawPoster(paper, word1, word2, word3, textColour, backgroundColour, marginColour) {
    paper.clear();
    var calmFont = paper.getFont("Underground");
    //var calmFont = paper.getFont("Opera-Lyrics-Smooth");
    drawBox(paper, 0, 0, width, height, marginColour, marginColour);
    drawBox(paper, margin, margin, width - (2 * margin), height - (2 * margin), backgroundColour, backgroundColour);

    var wordSize = height / 8;
    var andSize = 0.45 * wordSize;

    drawText(paper, width, height * 0.333, word1, calmFont, textColour, wordSize);
    drawText(paper, width, height * 0.487, word2, calmFont, textColour, wordSize);
    drawText(paper, width, height * 0.575, "AND", calmFont, textColour, andSize);
    drawText(paper, width, height * 0.675, word3, calmFont, textColour, wordSize);

}

// function from http://www.netlobo.com/url_query_string_javascript.html
function gup(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
}