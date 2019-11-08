var is_loggedin = false
$(".function").toggle(false);
$(".share").toggle(false);
$(".mydialog").toggle(false);
$(".event_dialog").toggle(false);
$(".edit_dialog").toggle(false);
$(".group_dialog").toggle(false);
var today = new Date();
// console.log(today.getDate())
var month_index = today.getMonth();
var currentYear = today.getFullYear();
var currentMonth = new Month(currentYear, month_index);
var current_month = new Month(currentYear, month_index);
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
updateCalendar(is_loggedin);

document.getElementById("previous").addEventListener("click", function(event){
	currentMonth = currentMonth.prevMonth();
	if (month_index>=0){
		month_index -= 1
	}
	else{
		month_index = 11
		currentYear -= 1
	}
	updateCalendar(is_loggedin);
}, false);

document.getElementById("next").addEventListener("click", function(event){
	currentMonth = currentMonth.nextMonth();
	if (month_index<=10){
		month_index += 1
	}
	else{
		month_index = 0
		currentYear += 1
	}
	updateCalendar(is_loggedin);
}, false);

document.getElementById("show_urgent").addEventListener("change", function(event){
	updateCalendar(is_loggedin);
}, false)

document.getElementById("show_shared").addEventListener("change", function(event){
	updateCalendar(is_loggedin);
}, false)

function updateCalendar(is_loggedin){
	let inner_calendar = document.getElementById("calendar_body");
	while(inner_calendar.childNodes.length > 0){
		inner_calendar.removeChild(inner_calendar.lastChild);
	} 
	document.getElementById("current_month").innerHTML = months[month_index] + " " + currentYear;
	let weeks = currentMonth.getWeeks();
	for(let i in weeks){
		let days = weeks[i].getDates();
		let row = document.createElement("tr");
		//alert("Week starting on "+days[0]);
		for(let j in days){
			if (days[j].getMonth() != currentMonth.month) {
				let cell = document.createElement("td");
				cell.appendChild(document.createTextNode(""));
				row.appendChild(cell);
			}
			else {
				let cell = document.createElement("td");
				cell.appendChild(document.createTextNode(days[j].getDate()));
				cell.setAttribute("id", days[j].toISOString().substring(0,10));
				cell.setAttribute("class", "editable");
				row.appendChild(cell);
				let sqlday = days[j].toISOString().substring(0,10);
        		if (is_loggedin == true) {
        			getEvents(sqlday);
        		}
			}
			document.getElementById('calendar_body').appendChild(row);
		}
	}
//   if(document.getElementById('show_shared').checked){
//     loadSharedCalendars(sqlday);
//   }else{
//     var events = document.getElementsByClassName("sharedEvents");
//     for(var i=0; i<events.length; i++){
//       events[i].style.visibility = hidden;
//     }
}

// jQuery(document).on("click", ".editable", function() {
// 	if (loggedin == true) {
// 	  $("#event_dialog").dialog();
// 	  document.getElementById('date').value = event.target.id;
// 	//   $('#title').val("");
// 	//   $('#description').val("");
// 	//   $('#time').val("");
// 	//   $('#save_btn').show();
// 	//   $('#save_changes_btn').hide();
  
// 	}
//   });



(function () {
	"use strict";

	/* Date.prototype.deltaDays(n)
	 * 
	 * Returns a Date object n days in the future.
	 */
	Date.prototype.deltaDays = function (n) {
		// relies on the Date object to automatically wrap between months for us
		return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
	};

	/* Date.prototype.getSunday()
	 * 
	 * Returns the Sunday nearest in the past to this date (inclusive)
	 */
	Date.prototype.getSunday = function () {
		return this.deltaDays(-1 * this.getDay());
	};
}());

/** Week
 * 
 * Represents a week.
 * 
 * Functions (Methods):
 *	.nextWeek() returns a Week object sequentially in the future
 *	.prevWeek() returns a Week object sequentially in the past
 *	.contains(date) returns true if this week's sunday is the same
 *		as date's sunday; false otherwise
 *	.getDates() returns an Array containing 7 Date objects, each representing
 *		one of the seven days in this month
 */
function Week(initial_d) {
	"use strict";

	this.sunday = initial_d.getSunday();
		
	
	this.nextWeek = function () {
		return new Week(this.sunday.deltaDays(7));
	};
	
	this.prevWeek = function () {
		return new Week(this.sunday.deltaDays(-7));
	};
	
	this.contains = function (d) {
		return (this.sunday.valueOf() === d.getSunday().valueOf());
	};
	
	this.getDates = function () {
		var dates = [];
		for(var i=0; i<7; i++){
			dates.push(this.sunday.deltaDays(i));
		}
		return dates;
	};
}

/** Month
 * 
 * Represents a month.
 * 
 * Properties:
 *	.year == the year associated with the month
 *	.month == the month number (January = 0)
 * 
 * Functions (Methods):
 *	.nextMonth() returns a Month object sequentially in the future
 *	.prevMonth() returns a Month object sequentially in the past
 *	.getDateObject(d) returns a Date object representing the date
 *		d in the month
 *	.getWeeks() returns an Array containing all weeks spanned by the
 *		month; the weeks are represented as Week objects
 */
function Month(year, month) {
	"use strict";
	
	this.year = year;
	this.month = month;
	
	this.nextMonth = function () {
		return new Month( year + Math.floor((month+1)/12), (month+1) % 12);
	};
	
	this.prevMonth = function () {
		return new Month( year + Math.floor((month-1)/12), (month+11) % 12);
	};
	
	this.getDateObject = function(d) {
		return new Date(this.year, this.month, d);
	};
	
	this.getWeeks = function () {
		var firstDay = this.getDateObject(1);
		var lastDay = this.nextMonth().getDateObject(0);
		
		var weeks = [];
		var currweek = new Week(firstDay);
		weeks.push(currweek);
		while(!currweek.contains(lastDay)){
			currweek = currweek.nextWeek();
			weeks.push(currweek);
		}
		
		return weeks;
	};
}