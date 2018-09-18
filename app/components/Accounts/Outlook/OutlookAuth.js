// import React from 'react';
import {
    AsyncStorage,
    Linking
  } from 'react-native';
import Config from 'react-native-config';

// versions can be a configuration variable.
const authBaseUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/'

const clientID = Config.OUTLOOK_CLIENT_ID;
const redirectUri = `${Config.URL_SCHEME}://${Config.URL_HOST}`;

const scopes = [
    'openid', 
    'User.Read', 
    'Mail.Read', 
    'offline_access' // used to refresh token silently
]

export async function authenticate(){
    Linking.openURL(`${authBaseUrl}authorize?response_type=code&client_id=${clientID}&scope=${scopes.join('+')}&redirect_uri=${redirectUri}`);
    Linking.addEventListener('url', async (responseUrl) => {
        // console.debug(responseUrl);
        let authCode = responseUrl.url.split('?code=')[1];
        await getTokenFromCode(authCode);
    });
    // set the account
    await AsyncStorage.setItem('outlook', 'outlook');
}

function buildGrant(grantType, grant, grantValue){
    return {
        'grant_type': grantType,
        'grant': grant,
        'grant_value': grantValue
    }
}

async function getTokenFromCode(authCode){
    // console.debug(authCode);
    let grant = buildGrant('authorization_code', 'code', authCode);
    return await getToken(grant);
}

async function getTokenFromRefreshToken(refreshToken){
    // console.debug(refreshToken);
    let grant = buildGrant('refresh_token', 'refresh_token', refreshToken);
    return await getToken(grant);
}

async function getToken(grant){
    let token;
    let auth = `grant_type=${grant['grant_type']}&${grant['grant']}=${grant['grant_value']}`

    try{
        let response = await fetch(`${authBaseUrl}token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `${auth}&client_id=${clientID}&scope=${scopes.join('+')}&redirect_uri=${redirectUri}`,
        });

        token = await response.json();
        await updateSessionWithToken(token);
    } catch (error){
        console.error(error);
    }

    // console.debug('printing token to return');
    // console.debug(token);
    return token;
}

async function updateSessionWithToken(token){
    let accessToken = token['access_token'];
    let refreshToken = token['refresh_token'];
    let expiresIn = token['expires_in'];
    // epoch time
    let now = (new Date).getTime()/1000|0;

    // expires_in is in seconds, get the expiration date with 5 min cushion
    let expiration = now + expiresIn - 300;

    // should override if already exist in storage
    console.info('updating storage with outlook token');
    // console.debug(token);
    await AsyncStorage.setItem('outlook_access_token', accessToken);
    await AsyncStorage.setItem('outlook_refresh_token', refreshToken);
    await AsyncStorage.setItem('outlook_token_expires', expiration.toString());
}

export async function getAccessToken(){
    
    let currentToken = await AsyncStorage.getItem('outlook_access_token');
    let expiration = await AsyncStorage.getItem('outlook_token_expires');
    let now = (new Date).getTime()/1000|0;

    if (currentToken && now < parseInt(expiration)){
        console.log('Returning token');
        return currentToken;
    } else {
        console.log('Refreshing token');
        let refreshToken = await AsyncStorage.getItem('outlook_refresh_token');
        if(refreshToken){
            let newToken = await getTokenFromRefreshToken(refreshToken);
    
            return newToken['access_token'];
        }
    }
    return null;
}

export async function removeOutlook(){
    console.log('clearing stored cache for outlook')
    await AsyncStorage.removeItem('outlook_access_token');
    await AsyncStorage.removeItem('outlook_refresh_token');
    await AsyncStorage.removeItem('outlook_token_expires');
    await AsyncStorage.removeItem('outlook');
    // remove account from home page
}