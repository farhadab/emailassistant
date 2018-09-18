import {authenticate, getAccessToken} from './OutlookAuth';

const graphEndpoint = 'https://graph.microsoft.com/v1.0'


async function getDetails(id){
    console.debug('making call to get details');
    const accessToken = await getAccessToken();
    let url = graphEndpoint + `/me/messages/${id}`;
    return await makeApiCall(accessToken, 'GET', true, url);
}

export async function getMe(accessToken){
    // gets the user
    let url = graphEndpoint + '/me';
    
    // use query params to only get displayName and email
    let queryParams = '$select=displayName,mail';

    return await makeApiCall(accessToken, 'GET', false, url, queryParams);
}

export async function getMessages(accessToken){
    // gets the user
    let url = graphEndpoint + '/me/mailfolders/inbox/messages';
    
    // use query params to only get displayName and email
    let today = new Date;
    today.setHours(0,0,0);

    // https://docs.microsoft.com/en-us/previous-versions/office/office-365-api/api/version-2.0/complex-types-for-mail-contacts-calendar#OdataQueryParams
    let queryParams = {
        'top': '50',
        'select': 'id,receivedDateTime,subject,from,body',
        'filter': `receivedDateTime%20ge%20${today.toISOString()}`,
        'orderby': 'receivedDateTIme%20DESC'
    }
    let params = (
        '$top='+queryParams['top']
        + '&'
        + '$select='+queryParams['select']
        // + '&'
        // + '$filter='+queryParams['select'] // already doing top 10...
        + '&'
        + '$orderby='+queryParams['orderby']
    );

    return await makeApiCall(accessToken, 'GET', false, url, params);
}

async function makeApiCall(accessToken, method, getDetails, url, params='', payload=null){
    console.log(`making outlook api call: ${url}?${params}`);
    let prefer = getDetails ? 'html' : 'text';
    try{
        let response = await fetch(`${url}?${params}`, {
            method: method,
            headers: {
                'User-Agent': 'myapp/1.0',
                'Authorization': 'Bearer '+accessToken,
                'Accept': 'application/json',
                'Prefer': `outlook.body-content-type="${prefer}"` // default is html
            },
            body: payload
        });
        let responseJson = await response.json();
        //console.error(responseJson);
        return responseJson;
    } catch (error) {
        console.error(error);
    }
}

export async function onPressOutlook(navigation){ // or do "onPress = async () => {}"?
    console.log('Accessing Outlook account');
    var accessToken = await getAccessToken();
    // console.debug(accessToken);
    if (!accessToken){
        await authenticate(navigation);
        await navigation.state.params.onGoBack();
        navigation.goBack();
    } else{
        console.log('Getting messages');
        let messages = await getMessages(accessToken);
    
        navigation.navigate('MailBox', {mail: messages['value'], getDetails: getDetails});
    }

}