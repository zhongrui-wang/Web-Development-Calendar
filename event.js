function addeventAjax(){
    const event_title = document.getElementById("event_title").value; //get the event name from the input
    const date = document.getElementById("date").value; //get the event date from the input
    const time = document.getElementById("time").value; //get the event time from the input
    const urgent = document.getElementById("set_urgent").checked;
    // const token = document.getElementById("csrf_token").value;

    const data = {'event_title': event_title, 'date': date, 'time': time, 'urgent': urgent, 'token': sessionCookie};

    fetch("addevent_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => alert(data.success ? "Event has been added!" : `Error: event has not been added! ${data.message}`))
        // .catch(error => console.error('Error:',error));
        if(is_loggedin){
            // is_loggedin = true;
            updateCalendar(is_loggedin);
        }
}

document.getElementById("groupevent_btn").addEventListener("click", function(event){
    $("#group_dialog").dialog();
    document.getElementById("addgroup_btn").addEventListener("click", function(event){
        const event_title = document.getElementById("group_eventtitle").value; //get the event name from the input
        const date = document.getElementById("group_date").value; //get the event date from the input
        const time = document.getElementById("group_time").value; //get the event time from the input
        const urgent = document.getElementById("set_groupurgent").checked;
        const teammate = document.getElementById("teammate").value;
        // const token = document.getElementById("csrf_token").value;

        const data = {'event_title': event_title, 'date': date, 'time': time, 'urgent': urgent, 'teammate': teammate,'token': sessionCookie};

        fetch("addgroupevent_ajax.php", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => alert(data.success ? "Event has been added!" : `Error: event has not been added! ${data.message}`))
            // .catch(error => console.error('Error:',error));
            if(is_loggedin){
                // is_loggedin = true;
                updateCalendar(is_loggedin);
            }
    },false);
},false);

function shareeventAjax(){
    const friendname = document.getElementById("share_to").value;
    const data = {'friendname': friendname, 'token': sessionCookie};
    fetch("shareEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => alert(data.success ? "Event has been shared!" : `Error: event has not been shared! ${data.message}`))
}

function getEvents(day) {
    const date = new Date(day);
    const sqldate = date.toISOString().substring(0,10);

    const data = {'sqldate': day}
    let show_urgent = false;
    show_urgent = document.getElementById("show_urgent").checked;
    show_shared  = document.getElementById("show_shared").checked;
    if(!show_shared){
        if(!show_urgent){
            fetch("getEvent_ajax.php", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
                })
                .then(response => response.json())
                // .then(data => console.log(data.event_titles))
                .then(data => {
                    if (data.success) {
                        // var br = document.createElement("br");
                        // var singleevent = document.createElement("p")
                        
                        // var extraevents = document.createElement("p");
                        // extraevents.setAttribute("class", "extraevents");
                        // console.log(data.event_titles)
                        //show event title in calendar
                        
                        for (var j = 0; j< data.event_titles.length; j++){
                            var event_id = data.event_ids[j];
                            var username = data.username;
                            var event_title = document.createElement("div");
                            //add div to display events
                            event_title.appendChild(document.createTextNode(data.event_titles[j]));
                            event_title.appendChild(document.createTextNode("--"));
                            event_title.appendChild(document.createTextNode(data.event_times[j]));
                            event_title.appendChild(document.createElement("br"));
                            event_title.setAttribute("id", "edit_id");
                            event_title.setAttribute("class", "edit_events");
                            var ebtn = document.createElement("BUTTON");
                            var unique_ebtn = event_id + "edit";
                            ebtn.innerHTML = "Edit";
                            ebtn.setAttribute("id", unique_ebtn);
                            event_title.appendChild(ebtn)
                            var sbtn = document.createElement("BUTTON");
                            var unique_sbtn = event_id + "save";
                            sbtn.innerHTML = "Save";
                            sbtn.setAttribute("id", unique_sbtn);
                            event_title.appendChild(sbtn)
                            var dbtn = document.createElement("BUTTON");
                            var unique_dbtn = event_id + "delete";
                            dbtn.innerHTML = "Delete";
                            dbtn.setAttribute("id", unique_dbtn);
                            event_title.appendChild(dbtn)


                            //add event to the table cell
                            document.getElementById(sqldate).appendChild(event_title);

                            document.getElementById(unique_ebtn).addEventListener("click", function(event){
                                $("#event_dialog").dialog();
                                var new_date;
                                var new_eventtitle;
                                var new_time;
                                // var new_urgent;
                                document.getElementById("firstedit_btn").addEventListener("click", function(event){
                                    new_eventtitle = document.getElementById("new_eventtitle").value; //get the event name from the input
                                    new_date = document.getElementById("new_date").value; //get the event date from the input
                                    new_time = document.getElementById("new_time").value; //get the event time from the input
                                    // new_urgent = document.getElementById("set_newurgent").checked;
                                    if(new_eventtitle != null && new_date != null){
                                        alert("Event has been edited! Press save changes button to save edit!" );
                                    }
                                },false);
                                document.getElementById(unique_sbtn).addEventListener("click", function(event){
            
                                    const data = {'event_id': event_id, 'new_eventtitle': new_eventtitle, 'new_date': new_date, 'new_time': new_time, 'token': sessionCookie};
            
                                    fetch("editEvent_ajax.php", {
                                            method: 'POST',
                                            body: JSON.stringify(data),
                                            headers: { 'content-type': 'application/json' }
                                        })
                                        .then(response => response.json())
                                        .then(data => alert(data.success ? "Edit has been saved!" : `Event has not been saved! ${data.message}`))
                                        // .catch(error => console.error('Error:',error));
                                        if(is_loggedin){
                                            // is_loggedin = true;
                                            updateCalendar(is_loggedin);
                                        }
                                },false);

                            },false);

                            document.getElementById(unique_dbtn).addEventListener("click", function() {
                                const data = {'event_id': event_id, 'username': username, 'token': sessionCookie};

                                fetch("deleteEvent_ajax.php", {
                                    method: 'POST',
                                    body: JSON.stringify(data),
                                    headers: { 'content-type': 'application/json' }
                                })
                                .then(response => response.json())
                                .then(data => window.alert(data.success ? "Delete successfully!" : `Try delete again! ${data.message}`))
                                // .catch(error => console.error('Error:',error));
                                if(is_loggedin){
                                    // is_loggedin = true;
                                    updateCalendar(is_loggedin);
                                }
                            },false);
                        }

                    }
                });
            }
            else{
                fetch("getUrgentEvent_ajax.php", {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'content-type': 'application/json' }
                    })
                    .then(response => response.json())
                    // .then(data => console.log(data.event_titles))
                    .then(data => {
                        if (data.success) {
                            // var br = document.createElement("br");
                            // var singleevent = document.createElement("p")
                            
                            // var extraevents = document.createElement("p");
                            // extraevents.setAttribute("class", "extraevents");
                            console.log(data.event_titles)
                            //show event title in calendar
                            
                            for (var j = 0; j< data.event_titles.length; j++){
                                var event_id = data.event_ids[j];
                                var username = data.username;
                                var event_title = document.createElement("div");
                                //add div to display events
                                event_title.appendChild(document.createTextNode(data.event_titles[j]));
                                event_title.appendChild(document.createTextNode("--"));
                                event_title.appendChild(document.createTextNode(data.event_times[j]));
                                event_title.appendChild(document.createElement("br"));
                                event_title.setAttribute("id", "edit_id");
                                event_title.setAttribute("class", "edit_events");
                                var ebtn = document.createElement("BUTTON");
                                var unique_ebtn = event_id + "edit";
                                ebtn.innerHTML = "Edit";
                                ebtn.setAttribute("id", unique_ebtn);
                                event_title.appendChild(ebtn)
                                var sbtn = document.createElement("BUTTON");
                                var unique_sbtn = event_id + "save";
                                sbtn.innerHTML = "Save";
                                sbtn.setAttribute("id", unique_sbtn);
                                event_title.appendChild(sbtn)
                                var dbtn = document.createElement("BUTTON");
                                var unique_dbtn = event_id + "delete";
                                dbtn.innerHTML = "Delete";
                                dbtn.setAttribute("id", unique_dbtn);
                                event_title.appendChild(dbtn)
        
        
                                //add event to the table cell
                                document.getElementById(sqldate).appendChild(event_title);
        
                                document.getElementById(unique_ebtn).addEventListener("click", function(event){
                                    $("#event_dialog").dialog();
                                    var new_date;
                                    var new_eventtitle;
                                    var new_time;
                                    var new_urgent;
                                    document.getElementById("firstedit_btn").addEventListener("click", function(event){
                                        new_eventtitle = document.getElementById("new_eventtitle").value; //get the event name from the input
                                        new_date = document.getElementById("new_date").value; //get the event date from the input
                                        new_time = document.getElementById("new_time").value; //get the event time from the input
                                        new_urgent = document.getElementById("set_newurgent").checked;
                                        if(new_eventtitle != null && new_date != null){
                                            alert("Event has been edited! Press save changes button to save edit!" );
                                        }
                                    },false);
                                    document.getElementById(unique_sbtn).addEventListener("click", function(event){
                
                                        const data = {'event_id': event_id, 'new_eventtitle': new_eventtitle, 'new_date': new_date, 'new_time': new_time, 'new_urgent': new_urgent, 'token': sessionCookie};
                
                                        fetch("editEvent_ajax.php", {
                                                method: 'POST',
                                                body: JSON.stringify(data),
                                                headers: { 'content-type': 'application/json' }
                                            })
                                            .then(response => response.json())
                                            .then(data => alert(data.success ? "Edit has been saved!" : `Event has not been saved! ${data.message}`))
                                            // .catch(error => console.error('Error:',error));
                                            if(is_loggedin){
                                                // is_loggedin = true;
                                                updateCalendar(is_loggedin);
                                            }
                                    },false);
        
                                },false);
        
                                document.getElementById(unique_dbtn).addEventListener("click", function() {
                                    const data = {'event_id': event_id, 'username': username, 'token': sessionCookie};
        
                                    fetch("deleteEvent_ajax.php", {
                                        method: 'POST',
                                        body: JSON.stringify(data),
                                        headers: { 'content-type': 'application/json' }
                                    })
                                    .then(response => response.json())
                                    .then(data => window.alert(data.success ? "Delete successfully!" : `Try delete again! ${data.message}`))
                                    // .catch(error => console.error('Error:',error));
                                    if(is_loggedin){
                                        // is_loggedin = true;
                                        updateCalendar(is_loggedin);
                                    }
                                },false);
                            }
        
                        }
                    });
            }
    }
    else{
        if(!show_urgent){
            fetch("getShareEvent_ajax.php", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
                })
                .then(response => response.json())
                // .then(data => console.log(data.event_titles))
                .then(data => {
                    if (data.success) {
                        // var br = document.createElement("br");
                        // var singleevent = document.createElement("p")
                        
                        // var extraevents = document.createElement("p");
                        // extraevents.setAttribute("class", "extraevents");
                        // console.log(data.event_titles)
                        //show event title in calendar
                        
                        for (var j = 0; j< data.event_titles.length; j++){
                            var event_id = data.event_ids[j];
                            var username = data.username;
                            var event_title = document.createElement("div");
                            //add div to display events
                            event_title.appendChild(document.createTextNode(data.event_titles[j]));
                            event_title.appendChild(document.createTextNode("--"));
                            event_title.appendChild(document.createTextNode(data.event_times[j]));
                            event_title.appendChild(document.createElement("br"));
                            event_title.setAttribute("id", "edit_id");
                            event_title.setAttribute("class", "edit_events");
                            // var ebtn = document.createElement("BUTTON");
                            // var unique_ebtn = event_id + "edit";
                            // ebtn.innerHTML = "Edit";
                            // ebtn.setAttribute("id", unique_ebtn);
                            // event_title.appendChild(ebtn)
                            // var sbtn = document.createElement("BUTTON");
                            // var unique_sbtn = event_id + "save";
                            // sbtn.innerHTML = "Save";
                            // sbtn.setAttribute("id", unique_sbtn);
                            // event_title.appendChild(sbtn)
                            // var dbtn = document.createElement("BUTTON");
                            // var unique_dbtn = event_id + "delete";
                            // dbtn.innerHTML = "Delete";
                            // dbtn.setAttribute("id", unique_dbtn);
                            // event_title.appendChild(dbtn)


                            //add event to the table cell
                            document.getElementById(sqldate).appendChild(event_title);

                            // document.getElementById(unique_ebtn).addEventListener("click", function(event){
                            //     $("#event_dialog").dialog();
                            //     var new_date;
                            //     var new_eventtitle;
                            //     var new_time;
                            //     // var new_urgent;
                            //     document.getElementById("firstedit_btn").addEventListener("click", function(event){
                            //         new_eventtitle = document.getElementById("new_eventtitle").value; //get the event name from the input
                            //         new_date = document.getElementById("new_date").value; //get the event date from the input
                            //         new_time = document.getElementById("new_time").value; //get the event time from the input
                            //         // new_urgent = document.getElementById("set_newurgent").checked;
                            //         if(new_eventtitle != null && new_date != null){
                            //             alert("Event has been edited! Press save changes button to save edit!" );
                            //         }
                            //     },false);
                            //     document.getElementById(unique_sbtn).addEventListener("click", function(event){
            
                            //         const data = {'event_id': event_id, 'new_eventtitle': new_eventtitle, 'new_date': new_date, 'new_time': new_time, 'token': sessionCookie};
            
                            //         fetch("editEvent_ajax.php", {
                            //                 method: 'POST',
                            //                 body: JSON.stringify(data),
                            //                 headers: { 'content-type': 'application/json' }
                            //             })
                            //             .then(response => response.json())
                            //             .then(data => alert(data.success ? "Edit has been saved!" : `Event has not been saved! ${data.message}`))
                            //             // .catch(error => console.error('Error:',error));
                            //             if(is_loggedin){
                            //                 // is_loggedin = true;
                            //                 updateCalendar(is_loggedin);
                            //             }
                            //     },false);

                            // },false);

                            // document.getElementById(unique_dbtn).addEventListener("click", function() {
                            //     const data = {'event_id': event_id, 'username': username, 'token': sessionCookie};

                            //     fetch("deleteEvent_ajax.php", {
                            //         method: 'POST',
                            //         body: JSON.stringify(data),
                            //         headers: { 'content-type': 'application/json' }
                            //     })
                            //     .then(response => response.json())
                            //     .then(data => window.alert(data.success ? "Delete successfully!" : `Try delete again! ${data.message}`))
                            //     // .catch(error => console.error('Error:',error));
                            //     if(is_loggedin){
                            //         // is_loggedin = true;
                            //         updateCalendar(is_loggedin);
                            //     }
                            // },false);
                        }

                    }
                });
            }
            else{
                fetch("getShareUrgentEvent_ajax.php", {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'content-type': 'application/json' }
                    })
                    .then(response => response.json())
                    // .then(data => console.log(data.event_titles))
                    .then(data => {
                        if (data.success) {
                            // var br = document.createElement("br");
                            // var singleevent = document.createElement("p")
                            
                            // var extraevents = document.createElement("p");
                            // extraevents.setAttribute("class", "extraevents");
                            console.log(data.event_titles)
                            //show event title in calendar
                            
                            for (var j = 0; j< data.event_titles.length; j++){
                                var event_id = data.event_ids[j];
                                var username = data.username;
                                var event_title = document.createElement("div");
                                //add div to display events
                                event_title.appendChild(document.createTextNode(data.event_titles[j]));
                                event_title.appendChild(document.createTextNode("--"));
                                event_title.appendChild(document.createTextNode(data.event_times[j]));
                                event_title.appendChild(document.createElement("br"));
                                event_title.setAttribute("id", "edit_id");
                                event_title.setAttribute("class", "edit_events");
                                // var ebtn = document.createElement("BUTTON");
                                // var unique_ebtn = event_id + "edit";
                                // ebtn.innerHTML = "Edit";
                                // ebtn.setAttribute("id", unique_ebtn);
                                // event_title.appendChild(ebtn)
                                // var sbtn = document.createElement("BUTTON");
                                // var unique_sbtn = event_id + "save";
                                // sbtn.innerHTML = "Save";
                                // sbtn.setAttribute("id", unique_sbtn);
                                // event_title.appendChild(sbtn)
                                // var dbtn = document.createElement("BUTTON");
                                // var unique_dbtn = event_id + "delete";
                                // dbtn.innerHTML = "Delete";
                                // dbtn.setAttribute("id", unique_dbtn);
                                // event_title.appendChild(dbtn)
        
        
                                //add event to the table cell
                                document.getElementById(sqldate).appendChild(event_title);
        
                                // document.getElementById(unique_ebtn).addEventListener("click", function(event){
                                //     $("#event_dialog").dialog();
                                //     var new_date;
                                //     var new_eventtitle;
                                //     var new_time;
                                //     var new_urgent;
                                //     document.getElementById("firstedit_btn").addEventListener("click", function(event){
                                //         new_eventtitle = document.getElementById("new_eventtitle").value; //get the event name from the input
                                //         new_date = document.getElementById("new_date").value; //get the event date from the input
                                //         new_time = document.getElementById("new_time").value; //get the event time from the input
                                //         new_urgent = document.getElementById("set_newurgent").checked;
                                //         if(new_eventtitle != null && new_date != null){
                                //             alert("Event has been edited! Press save changes button to save edit!" );
                                //         }
                                //     },false);
                                //     document.getElementById(unique_sbtn).addEventListener("click", function(event){
                
                                //         const data = {'event_id': event_id, 'new_eventtitle': new_eventtitle, 'new_date': new_date, 'new_time': new_time, 'new_urgent': new_urgent, 'token': sessionCookie};
                
                                //         fetch("editEvent_ajax.php", {
                                //                 method: 'POST',
                                //                 body: JSON.stringify(data),
                                //                 headers: { 'content-type': 'application/json' }
                                //             })
                                //             .then(response => response.json())
                                //             .then(data => alert(data.success ? "Edit has been saved!" : `Event has not been saved! ${data.message}`))
                                //             // .catch(error => console.error('Error:',error));
                                //             if(is_loggedin){
                                //                 // is_loggedin = true;
                                //                 updateCalendar(is_loggedin);
                                //             }
                                //     },false);
        
                                // },false);
        
                                // document.getElementById(unique_dbtn).addEventListener("click", function() {
                                //     const data = {'event_id': event_id, 'username': username, 'token': sessionCookie};
        
                                //     fetch("deleteEvent_ajax.php", {
                                //         method: 'POST',
                                //         body: JSON.stringify(data),
                                //         headers: { 'content-type': 'application/json' }
                                //     })
                                //     .then(response => response.json())
                                //     .then(data => window.alert(data.success ? "Delete successfully!" : `Try delete again! ${data.message}`))
                                //     // .catch(error => console.error('Error:',error));
                                //     if(is_loggedin){
                                //         // is_loggedin = true;
                                //         updateCalendar(is_loggedin);
                                //     }
                                // },false);
                            }
        
                        }
                    });
            }

    }
    // .catch(error => console.error('Error:',error));
  
  } 

document.getElementById("add_btn").addEventListener("click", addeventAjax, false); // Bind the AJAX call to add event button 
document.getElementById("share_btn").addEventListener("click", shareeventAjax, false); 
// document.getElementById("addgroup_btn").addEventListener("click", addGroupEventAjax, false); 