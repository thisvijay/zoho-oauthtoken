/******** replace below values with your own     ********/

let clientId    = '1000.1IOS3E7KA8K77RBCKPYA8NY8QAMF2C';                                       //YOUR CLIENT ID
let scope       = `Desk.tickets.ALL,Desk.basic.ALL`;                                           //YOUR SCOPES 
let redirectUri = 'https://thisvijay.github.io/zoho-oauthtoken/simple/redirect.html'; //YOUR REDIRECT URL 
let oauthDomain = 'https://accounts.zoho.com';

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
    console.log('current appserver - ' +appServer);
}

function initiateAuthorize(e){
    e.preventDefault();
    scope       = document.getElementById("scopes").value.trim();
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

function getParameterByName(name, hash) {
    let match = RegExp(`[#&]${name}=([^&]*)`).exec(hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getAccessToken(hash) {
    return getParameterByName('access_token', hash);
}
