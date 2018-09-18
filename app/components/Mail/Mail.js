import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight
} from 'react-native';
import {processISODate} from '../Util/Util'
import {setNavigationOptions} from '../Navigation/Navigation';


export default class Mail extends Component{
    static navigationOptions = ({ navigation }) => {
        let backTitle = navigation.getParam('accountName', 'Accounts');
        let properties = {
            mail: navigation.getParam('mail', ''),
            getDetails: navigation.getParam('getDetails'),
            navigation: navigation
        };
        return setNavigationOptions('Inbox', backTitle, properties, true);
    };

    constructor(props){
        super(props);
        // console.debug(this.props.navigation);
        messages = this.props.navigation.getParam('mail', '');
        getDetails = this.props.navigation.getParam('getDetails');
        this.state = {
            mail: messages,
            getDetails: getDetails
        }
        this.onPress.bind(this);
    }

    componentDidMount(){
        console.log('Mail has mounted');
    }

    componentWillUnmount(){
        console.debug('Mail unmounting');
    }


    async onPress(id){
        console.info(`pressed item id ${id}`);
        let mailItem = await this.state.getDetails(id);
        this.props.navigation.navigate('MailDetails', {
            details: mailItem,
            mail: this.state.mail,
            getDetails: this.state.getDetails
        });
    }

    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.mail}
                    renderItem={({item}) => 
                    <TouchableHighlight onPress={() => this.onPress(item.id)} underlayColor="#ccc">
                        <View style={styles.mailContainer}>
                            <View style={styles.mailItem}>
                                <View style={styles.header}>
                                    <Text numberOfLines={1} style={styles.sender}>{item.from.emailAddress.name}</Text>
                                    <Text numberOfLines={1} style={styles.date}>{processISODate(item.receivedDateTime)}</Text>
                                </View>
                                <View style={styles.details}>
                                    <Text numberOfLines={1} style={styles.subject}>{item.subject}</Text>
                                    <Text numberOfLines={2} style={styles.body}>{item.body.content}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                    }
                    keyExtractor={(item, index) => item.id}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        backgroundColor: '#fff',
    },
    mailContainer:{
        paddingLeft: 40,
        paddingTop: 10
    },
    mailItem: {
        flex: 1,
        // paddingLeft: 20,
        paddingRight: 15,
        paddingBottom: 10,
        borderBottomWidth: 0.5
    },
    header: {
        flex: 1,
        flexDirection: 'row', // show subject and date on same row
        justifyContent: 'space-between', // with a space in between
        alignItems: 'flex-end', // aligned at the bottom of the line
    },
    sender: {
        marginRight: 20,
        flex: 1, // without this long names push date off
        fontSize: 18,
        color: '#000'
    },
    date: {
        fontSize: 15,
    },
    details: {
        flex: 1
    },
    subject: {
        fontSize: 15,
        fontWeight: '500'
    },
    body: {
    }
})