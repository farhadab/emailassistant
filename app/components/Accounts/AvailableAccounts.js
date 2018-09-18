import React from 'react';
import {
    AsyncStorage,
    Image
} from 'react-native';
import {onPressGmail} from './Gmail/GmailAPI';
import {onPressOutlook} from './Outlook/OutlookAPI';
import {removeGmail} from './Gmail/GmailAuth';
import {removeOutlook} from './Outlook/OutlookAuth';

const availableAccounts = {
    gmail: {
        key: '1',
        name: 'Gmail',
        // logo is an image because of sizing variation
        logo: (<Image
                style={
                    {
                        width: '20%',
                        height: 30
                    }
                }
                source={require('./Gmail/logo.png')}
            />),
        onPress: onPressGmail,
        removeAccount: removeGmail
    },
    outlook: {
        key: '2',
        name: 'Outlook',
        logo: (<Image
            style={
                {
                    width: '45%',
                    height: 30
                }
            }
            source={require('./Outlook/logo.png')}
        />),
        onPress: onPressOutlook,
        removeAccount: removeOutlook
    }
};

export async function getAccounts(){
    let gmail = await AsyncStorage.getItem('gmail');
    let outlook = await AsyncStorage.getItem('outlook');

    let setUpAccounts = [gmail, outlook];
    let accounts = [];

    console.debug('getAccounts');
    for(let i=0; i<setUpAccounts.length; i++){
        let account = setUpAccounts[i];
        console.debug(account);
        if(account){
            accounts.push(availableAccounts[account]);
            console.log(availableAccounts[account]['name']);
        }
    }

    return accounts;
}

export function getAvailableAccounts(){
    let accounts = [];
    let accountNameArray = Object.keys(availableAccounts);
    for(let i=0; i<accountNameArray.length; i++){
        let accountName = accountNameArray[i];
        accounts.push(availableAccounts[accountName]);
    }
    return accounts;
}