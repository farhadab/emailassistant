import React, {Component} from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback,
  FlatList
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Accounts from './app/components/Accounts/Accounts';
import AccountAdd from './app/components/AccountAdd/AccountAdd';
import Mail from './app/components/Mail/Mail';
import MailDetails from './app/components/MailDetails/MailDetails';


const RootStack = createStackNavigator(
    {
        Accounts: Accounts,
        AccountAdd: AccountAdd,
        MailBox: Mail,
        MailDetails: MailDetails
    },
    {
        initialRouteName: 'Accounts'
    }
);

export default class App extends Component{
    render(){
        return(
            <RootStack />
        );
    }
}