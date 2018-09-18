import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Image
} from 'react-native';
import {setNavigationOptions} from '../Navigation/Navigation';
import {getAvailableAccounts} from '../Accounts/AvailableAccounts';


export default class AccountAdd extends Component{
    static navigationOptions = ({ navigation }) => {
        let backTitle = '';
        let properties = {
            navigation: navigation
        }
        return setNavigationOptions('Configure Accounts', backTitle, properties, false);
    };

    constructor(props){
        super(props);
        let accounts = getAvailableAccounts();
        this.state = {
            accounts: accounts
        }
    }

    componentDidMount(){
        console.log('AccountAdd has mounted');
    }

    componentWillUnmount(){
        console.debug('AccountAdd unmounting');
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <FlatList
                        data={this.state.accounts}
                        renderItem={({item}) => 
                        
                            <TouchableHighlight 
                                style={styles.button}
                                onPress={() => item.onPress(this.props.navigation)} 
                                underlayColor='#f2f2f2'>
                                {item.logo}
                            </TouchableHighlight>
                        }
                        renderSectionHeader={({section}) => 
                            <Text style={styles.section}>{section.title.toUpperCase()}</Text>
                        }
                        renderSectionFooter={({section}) => 
                            <Text style={styles.section}></Text>
                        }
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flex: 1,
        padding: 10,
        paddingBottom: 0,
        backgroundColor: '#ccc',
    },
    button: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 10,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    }
})