function countdown(minutes) {

    // Validate parameters
    var seconds = 60;
    var minutes = minutes;

    function tick() {

        var counter        = document.getElementById("time");
        var currentMinutes = minutes - 1;

        // Reduce a second
        seconds--;

        counter.innerHTML =
            currentMinutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);

        if(seconds > 0) {
            setTimeout(tick, 1000);
        } else {
            if(minutes > 1){
                setTimeout(function () { countdown(minutes - 1); }, 1000);
            } else {
                console.log('end');
            }
        }

    }


    // Second tick
    tick();

}


countdown(15);