$(document).ready(function() {

    /*** draw months ***/

    var month = moment();
    var outputMonth = "<ol class = 'month'>";
    for (i = 0; i < 1; i++) {
        var durationMonth = moment.duration({'months' : 1});
        outputMonth += "<li>";
        outputMonth += moment(month).format("MMM");
        outputMonth += "</li>";
        month = moment(month).subtract(durationMonth);
    }
    outputMonth += "</ol>";

    var output = "<ol><div class = 'week'>";
    var day = moment();

    /* Calculate the offset for days of the week to line up correctly */
    var dayOfWeekOffset = 6 - (parseInt(moment().format("d"),10));
    for (i = 0; i < (dayOfWeekOffset); i++) { output += "<li class = 'offset'></li>"; }

    /*** draw calendar ***/

    for (i = 31; i >= 0; i--) {
        output += "<li>";
        output += '<span class = "tooltip">' + moment(day).format("MM-DD-YY")  +  '</span>';
        output += "</li>";

        var duration = moment.duration({'days' : 1});
        day = moment(day).subtract(duration);
    }

    output += "</div></ol>";
    document.getElementById("month").innerHTML = outputMonth;
    document.getElementById("days").innerHTML = output;
});