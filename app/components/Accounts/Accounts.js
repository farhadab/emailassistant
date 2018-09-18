import React, {Component} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  SectionList
} from 'react-native';
import {setNavigationOptions} from '../Navigation/Navigation';
import {getAccounts} from './AvailableAccounts';


export default class Accounts extends Component{
    static navigationOptions = ({ navigation }) => {
        let backTitle = '';
        let properties = {
            navigation: navigation
        }
        return setNavigationOptions('Mailboxes', backTitle, properties, false);
    };

    constructor(props){
        super(props);
        this.state = {
            accounts: []
        }
        this.updateState.bind(this);
    }

    async componentDidMount(){
        console.log('Accounts has mounted');
        await this.updateState();
    }

    componentWillUnmount(){
        console.debug('Accounts unmounting');
    }

    addAccount(){
        this.props.navigation.navigate('AccountAdd', {
            onGoBack: async () => {
                console.debug('going back to Account listing');
                await this.updateState();
            }
        });
    }

    removeAccount(account){
        Alert.alert(
            'Remove Account',
            `Are you sure you want to remove ${account.name}?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: () => this.handleRemoveAccount(account)},
            ]
        );
    }

    async handleRemoveAccount(account){
        console.log('removing');
        await account.removeAccount();
        // update state
        await this.updateState();
    }

    async updateState(){
        let accounts = await getAccounts();
        this.setState({accounts: accounts});
        // console.debug('accounts after updating state');
        // console.debug(this.state.accounts);
        // console.debug(accounts);
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight 
                        onPress={this.addAccount.bind(this)}
                        style={styles.button} 
                        underlayColor='#f2f2f2'>
                        <Text style={styles.buttonText}>
                            ADD NEW ACCOUNT
                        </Text>
                    </TouchableHighlight>
                </View>
                {this.state.accounts.length > 0 ? (
                <SectionList
                    sections={[
                        {title: 'Accounts', data: this.state.accounts}
                    ]}
                    renderItem={({item}) => 
                    
                        <TouchableHighlight 
                            onPress={() => item.onPress(this.props.navigation)} 
                            onLongPress={() => this.removeAccount(item)}
                            underlayColor="#ccc">
                            <View style={styles.account}>
                                <Text style={styles.name}>{item.name}</Text>
                            </View>
                        </TouchableHighlight>
                    }
                    renderSectionHeader={({section}) => 
                        <Text style={styles.section}>{section.title.toUpperCase()}</Text>
                    }
                    renderSectionFooter={({section}) => 
                        <Text style={styles.section}></Text>
                    }
                    ItemSeparatorComponent={() => (<View style={styles.separatorContainer}><Text style={styles.separator}/></View>)}
                />) : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    separatorContainer: {
        paddingLeft: 20,
    },
    separator: {
        borderBottomWidth: 0.8
    },
    buttonContainer: {
        padding: 10,
        backgroundColor: '#ccc',
    },
    button: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18
    },
    section: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        fontSize: 18,
        color: '#ccc',
        backgroundColor: '#f2f2f2',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#ccc'
    },
    account: {
        flex: 1,
        flexDirection: 'row', // show subject and date on same row
        justifyContent: 'space-between', // with a space in between
        alignItems: 'flex-end', // aligned at the bottom of the line
        paddingLeft: 20,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5
    },
    name: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: '#333'
    }
})