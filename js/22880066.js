const API = 'https://web1-api.vercel.app/api';
const AUTHENTICATH_API = 'https://web1-api.vercel.app/users';

async function loadData(request, templateId, viewId) {
    const response = await fetch(`${API}/${request}`);
    const data = await response.json();

    // var source = document.getElementById(templateId).innerHTML;
    // var template = Handlebars.compile(source);
    var template = Handlebars.templates[`${templateId}`];
    var context = { data: data };
    var view = document.getElementById(viewId);
    view.innerHTML = template(context);
};

async function getAuthenticaToken(username, password) {
    let response = await fetch(`${AUTHENTICATH_API}/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({username, password})
    });
    let result = await response.json();
    if(response.status == 200) {
        return result.token;
    }
    throw new Error(result.message);
};

async function login(e) {
    e.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    document.getElementById('errorMessage').innerHTML = '';

    try {
        let token = await getAuthenticaToken(username, password);
        if(token) {
            localStorage.setItem('token', token);
            document.getElementsByClassName('btn-close')[0].click(); //dong modal login
            displayControls(); // dong nut login, hien nut logout
        }
    } catch(error) {
        document.getElementById('errorMessage').innerHTML = error;
        displayControls(false);
    }
};

function displayControls(isLogin = true) {
    let linkLogins = document.getElementsByClassName('linkLogin');
    let linkLogouts = document.getElementsByClassName('linkLogout');

    let displayLogin = 'none';
    let displayLogout = 'block';
    if(!isLogin) {
        displayLogin = 'block';
        displayLogout = 'none';
    }
    for(let i=0; i<2; i++) { // linkLogins.length = 2 do co 2 nut login moi trang
        linkLogins[i].style.display = displayLogin;
        linkLogouts[i].style.display = displayLogout;
    } 

    let leaveComment = document.getElementById('leave-comment');
    if(leaveComment) {
        leaveComment.style.display = displayLogout;
    }
}

async function checkLogin() {
    let isLogin = await verifyToken();
    displayControls(isLogin);
}

async function verifyToken() {
    let token = localStorage.getItem('token');
    if(token) {
        let response = await fetch(`${AUTHENTICATH_API}/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if(response.status == 200) {
            return true;
        }
    }
    return false;
}

function logout() {
    localStorage.clear();
    displayControls(false);
}