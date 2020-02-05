/******** replace below values with your own     ********/

let clientId    = '1000.XW4A2RAUWKKQ05215BO6PRCXYAU6XJ';                                       //YOUR CLIENT ID
let scope       = `Desk.tickets.ALL,Desk.basic.ALL`;                                           //YOUR SCOPES 
let redirectUri = 'https://zoho-opensource.herokuapp.com/zoho-oauthtoken/redirect.html'; //YOUR REDIRECT URL 
let oauthDomain = 'https://accounts.zoho.com';

let scopesHistory = [];

var clientConfig = {
   "live" : {
       "clientId" : '1000.XW4A2RAUWKKQ05215BO6PRCXYAU6XJ',
       "domain"   : 'https://accounts.zoho.com'
   },
   "local": {
       "clientId" : '1000.O2PAIXXPJPRB00906JV3O4EANCX0D9',
       "domain"   : 'https://accounts.localzoho.com'
   },
   "dev": {
       "clientId" : '1000.AMN31L2YFY7T24662IZKBUR9U2JOT6',
       "domain"   : 'https://accounts.csez.zohocorpin.com'
   }
};

let currentAppServer = 'live';
let callback_after_authorize = (function(generatedOauthToken){
                                    document.getElementById("oauthtoken").innerHTML = generatedOauthToken;
                                    console.log('OAuthtoken = ' + generatedOauthToken );
                                });

/******** replace above values with your own     ********/


let ci;
let ct;
let generatedOauthToken = null;

function initiateAuthroizeFromInput(e){
    console.log(e);
    e.preventDefault();
    clientId    = document.getElementById("client_id").value.trim();
    scope       = document.getElementById("scopes").value.trim();
    redirectUri = document.getElementById("redirect_uri").value.trim();
    initiateAuthorize();
}

function selectAppServer(appServer){
    currentAppServer = appServer;
    clientId    = clientConfig[appServer].clientId;
    oauthDomain = clientConfig[appServer].domain;
    window.localStorage.setItem("last_appserver", appServer);
    console.log('current appserver - ' +appServer);
}

function initiateAuthorize(e){
    e.preventDefault();
    scope       = document.getElementById("scopes").value.trim();
    window.localStorage.setItem("last_scope", scope);
    if(scopesHistory.indexOf(scope)<0){
      scopesHistory.push(scope);
      window.localStorage.setItem("scopesHistory", JSON.stringify(scopesHistory));
    }
    let authWindow = window.open(`${oauthDomain}/oauth/v2/auth?response_type=token&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=1234`,
                            '_blank',
                            'width=500,height=500'
                    );
    let authPromise = new Promise((res, rej) => {
        ci = setInterval(() => { /*checking hash value in every one second till reached 50sec or throw reject timeout */
            try {
                let hashData = authWindow.location.hash;
                if(hashData) {
                    res(hashData);
                    authWindow.close();
                }
            }
            catch (e) {
                console.log('hash not yet received');
            }
      }, 1000);
      ct = setTimeout(() => {
                rej('timeout reached');
                ci();
                authWindow.close();
          }, 50000);
    });
    authPromise.then(
        hash => {
            generatedOauthToken = getAccessToken(hash);
            callback_after_authorize(generatedOauthToken);
        },
        err => console.log(' error... ', err)
    );
}

(function() {
    if (location.href.indexOf('http://zoho-opensource.herokuapp.com')===0) {
        location.protocol = "https:";
    }
})();

function syncScopesForAutoFill(){
    window.localStorage.setItem("last_scope", document.getElementById("scopes").value.trim());
}

function selectHistory(scope){
    document.getElementById("scopes").value = scope;
    window.localStorage.setItem("last_scope", scope);
    if(scopesHistory.indexOf(scope)>=0){
      var index = scopesHistory.indexOf(scope);
      if (index > -1) {
        scopesHistory.splice(index, 1);
      }
    }
    scopesHistory.push(scope);
    window.localStorage.setItem("scopesHistory", JSON.stringify(scopesHistory));
    hideElem('scopes_history');
}

function initDefaultValue(){
  if(window.localStorage.scopesHistory){
    scopesHistory = JSON.parse(window.localStorage.scopesHistory);
  }
  if(!window.localStorage.last_scope){
        window.localStorage.setItem("last_scope", "Desk.tickets.ALL,Desk.settings.ALL,Desk.search.READ,Desk.basic.READ");
    }
    document.getElementById("scopes").value = window.localStorage.last_scope;
    if(window.localStorage.last_scope){
      document.getElementById(window.localStorage.last_appserver).click();
    }
}

function showScopesHistory(){
  document.getElementById('scopes_history_screen').innerHTML = "";
  document.getElementById('scopes_history').style.display = "block";
  scopesHistory.forEach(function(scope) {
    document.getElementById('scopes_history_screen').insertAdjacentHTML('afterbegin', `<div onclick="selectHistory('${scope}')" class="hist_item">${scope}</div>`);
  });
}

function hideElem(id){
  document.getElementById(id).style.display='none';
}

function getParameterByName(name, hash) {
    let match = RegExp(`[#&]${name}=([^&]*)`).exec(hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getAccessToken(hash) {
    return getParameterByName('access_token', hash);
}
