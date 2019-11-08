let sessionCookie = 0;
//declare sessionCookie
fetch("csrf.php", {
    method: 'POST',
    body: JSON.stringify(),
    headers: { 'content-type': 'application/json' }
})
.then(response => response.json())
.then (data => setCSRF(data))
.catch(error => console.error('Error:',error));
//Pass tokens in forms to prevent CSRF attacks.
function setCSRF(data) {
    sessionCookie = data.token;
}

function loginAjax(event) {
    const username = document.getElementById("username").value; // get the username from the input
    const password = document.getElementById("password").value; // get the password from the input
    
    const data = { 'username': username, 'password': password };

    fetch("login_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        // .then(data => window.alert(data.success ? "You've loggedd in!" : `You were not logged in! ${data.message}`))
        .then(data => {
            window.alert(data.success ? "You've loggedd in!" : `You were not logged in! ${data.message}`)
            update_appearance(data)
        });
        // .then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`));

}

function registerAjax(event) {
    const r_username = document.getElementById("r_username").value; // Get the username from the form
    const r1_password = document.getElementById("r1_password").value; // Get the password from the form
    const r2_password = document.getElementById("r2_password").value; // Get the password from the form

    const data = { 'r_username': r_username, 'r1_password': r1_password, 'r2_password': r2_password };
    fetch("register_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => window.alert(data.success ? "You've been registered, please log in!" : `You were not registered! ${data.message}`));
        // .then(data => console.log(data.success ? "You've been registered!" : `You were not registered ${data.message}`));
}

function logoutAjax(event){
    fetch("logout_ajax.php", {
        method: 'POST',
        body: JSON.stringify(),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => update_appearance(data));
}

function update_appearance(data){
    $(".login").toggle(!data.success);
    $(".share").toggle(data.success);
    $(".function").toggle(data.success);
    is_loggedin = data.success;
    updateCalendar(is_loggedin);
    sessionCookie = data.token;//avoid attack
}


document.getElementById("login_btn").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click
document.getElementById("register_btn").addEventListener("click", registerAjax, false); 
document.getElementById("logout_btn").addEventListener("click", logoutAjax, false); 