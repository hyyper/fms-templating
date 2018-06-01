/*! TimeR v2.0.2 */
"use strict";

/**
 * Represents a timer.
 * @constructor
 * @param {object} options - Settings for TimeR
 */
var TimeR = function (options) {

    this.defaults = {
        id: "TimeR",
        message: "All Sold Out!",
        now: moment(),
        end: moment(),
        dateFormat: "MM/DD/YYYY HH:mm:ss"
    };


    // CSS Selector
    this.id = options.hasOwnProperty("id") ? options.id : this.defaults.id;

    // Finishing Message
    this.message = options.hasOwnProperty("message") ? options.message : this.defaults.message;

    // Current Date / Time
    this.now = options.hasOwnProperty("now") ? moment(options.now, this.defaults.dateFormat) : this.defaults.now;

    // End Date / Time
    this.end = options.hasOwnProperty("end") ? moment(options.end, this.defaults.dateFormat) : this.defaults.end;

    this.time = moment.duration(moment(this.end).diff(this.now));

    /**
     * time object - {days, hours, minutes, months, seconds}, units {days, hours, milliseconds, minutes, months, seconds, years}
     * until string - Month Dayth
     * complete boolean
     */
    this.format = options.format;

    this.unitNames = options.unitNames;


    // Global setInterval, used for clearing
    this.setInterval;

    this.cycleDates = [];


};

// Time from now till the end
TimeR.prototype._durationTillEnd = function () {
    // End Date / Time
    this.time = moment.duration(moment(this.end).diff(this.now));
};


TimeR.prototype.cycle = function (options) {

    // Check there are any cycleDates
    if (this.cycleDates.length > 0) {
        this._closestTimeToNow();
        return;
    }

    // Start Date
    this.start = options.hasOwnProperty("start") ? moment(options.start, this.defaults.dateFormat) : moment();

    // cycle interval
    this.interval = options.hasOwnProperty("interval") ? options.interval : 1;


    /*
     * Available Options:
     * years
     * quarters
     * months
     * weeks
     * days
     * hours
     * minutes
     */
    this.leap = options.hasOwnProperty("leap") ? options.leap : "weeks";


    this._getDateCycle();


    /*
     *
     * cycle -> getDateCyle -> getClosestDayFromNow() ->
     */

    // lets see all the date cycles
    this._closestTimeToNow();

};


TimeR.prototype._getDateCycle = function () {

    // Get each date in full cycle
    for (var i = 0; i <= this.interval; i++) {

        // Increase from start date.
        this.start = this.start.add(1, this.leap);

        // Add to array
        this.cycleDates.push(moment(this.start, this.defaults.dateFormat));
    }

};


TimeR.prototype._closestTimeToNow = function () {

    if (this.cycleDates && this.cycleDates.length > 0 && typeof this.cycleDates === "array") {

    }

    // Check for the cloest end Date / Time
    for (var s in this.cycleDates) {

        if (this.cycleDates[s].diff(this.now, "seconds") > 0) {

            this.end = this.cycleDates[s];

            // Create new end date.
            this._durationTillEnd();
            this.countDown();

            return;
        }


    }

    this._completeTimeR();


};

// Sends "complete" to format method
TimeR.prototype._completeTimeR = function () {

    /// Stop countdown interval
    clearInterval(this.setInterval);

    // Forces finished message to display
    this.display(false);

};


/**
 *
 * Initiates countDown, subtracts 1 second on each interval and
 * adds 1 second to 'now'
 *
 */
TimeR.prototype.countDown = function () {

    var that = this;

    this.setInterval = setInterval(function() {

        // Subtract 1 second
        that.time = that.time.subtract(1, "seconds");

        that.now = that.now.add(1, "seconds");

        // Detect
        that.time.units = that._changeSingularPlural(that.time);


        // Check if countDown is complete
        that._checkTimeRComplete({
            years  : that.time.years(),
            months : that.time.months(),
            days   : that.time.days(),
            hours  : that.time.hours(),
            minutes: that.time.minutes(),
            seconds: that.time.seconds(),
            units  : that.time.units
        });

    }, 1000);

};

// Checks if countDown is complete
TimeR.prototype._checkTimeRComplete = function (time) {

    for (var type in time) {

        if (type == "unit") {
            continue;
        }

        if (time.hasOwnProperty(type)) {

            if (time[type] > 0) {
                return this.display(time);
                break;
            }
        }

    }

    // End timer
    clearInterval(this.setInterval);

    //
    this.cycle({
        start: this.start,
        leak: this.leap,
        interval: this.interval
    });

};

/*
 * Renames Unit Name.
 */
TimeR.prototype._renameUnit = function (unit) {

    for (var name in this.unitNames) {

        if (this.unitNames.hasOwnProperty(unit)) {
            return this.unitNames[unit];
        }

    }

    return unit;

};


// Displays the correct units
TimeR.prototype._changeSingularPlural = function (time) {

    var units = [];

    for (var s in time["_data"]) {

        if (time["_data"][s] <= 1) {
            // remove "s"
            units[s] = this._renameUnit(s).slice(0, -1);
        } else {
            units[s] = this._renameUnit(s);
        }

    }

    return units;

}


/**
 * Controls the display of the TimeR & Until date / time
 * @param {object} time
 */
TimeR.prototype.display = function (time) {

    var until = this.end.format("MMMM Do");

    // Check if format is set
    if (typeof this.format === "function") {

        var complete = (!time) ? true : false;
        return this.format(time, until, complete);

    } else {

        if (document.getElementById("until")) {
            document.getElementById("until").innerHTML = "until " + this.end.format("MMMM Do");
        }

    }


    // Inserts default countdown structure if format function isn't used
    document.getElementById(this.id).innerHTML = (time) ? '<div class="countdown"> <div class="countdown--digit"> <span id="countdown--days">' + time.days + '</span><div class="countdown--unit">' + time.units['days'] + '</div></div><div class="countdown--digit"><span id="countdown--hours">' + time.hours + '</span><div class="countdown--unit">' + time.units['hours'] + '</div></div><div class="countdown--digit"><span id="countdown--minutes">' + time.minutes + '</span><div class="countdown--unit">' + time.units['minutes'] + '</div></div><div class="countdown--digit"><span id="countdown--seconds">' + time.seconds + '</span><div class="countdown--unit">' + time.units['seconds'] + '</div></div></div>' : this.message;

};