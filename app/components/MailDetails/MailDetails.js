import React, {Component} from 'react';
import {
    ActivityIndicator,
    WebView,
    View,
    Text,
    StyleSheet
} from 'react-native';
import {setNavigationOptions} from '../Navigation/Navigation';
import {clearVoiceRecognition} from '../Navigation/VoiceRecognition';

export default class MailDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        let backTitle = '';
        let properties = {
            navigation: navigation
        }
        return setNavigationOptions('', backTitle, properties, false);
    };

    constructor(props){
        super(props);
        let mailItem = this.props.navigation.getParam('details', '');
        // console.debug(mailItem);
        this.state = {
            details: mailItem
        }
    }

    componentDidMount(){
        console.log('MailDetails has mounted');
    }

    componentWillUnmount(){
        console.debug('MailDetails unmounting');
        clearVoiceRecognition();
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.mailDetails}>
                    <View style={styles.detailsTop}>
                        <Text style={styles.senderLabel}>From: <Text style={styles.sender}>{this.state.details.from.emailAddress.name}</Text></Text>
                    </View>
                    <View style={styles.detailsBottom}>
                        <Text style={styles.subject}>{this.state.details.subject}</Text>
                        <Text style={styles.date}>{(new Date(this.state.details.receivedDateTime)).toLocaleString()}</Text>
                    </View>
                </View>
                <WebView 
                    source={{html:this.state.details.body.content, baseUrl:''}}
                    // originWhitelist={['*']}
                    renderLoading={() => 
                        <ActivityIndicator
                            size='large'
                            style={styles.loading}
                        />
                    }
                    startInLoadingState={true}
                    style={styles.web}
                    //the below aren't working to disable links and scrolling
                    //originWhitelist={['']}
                    //scrollEnabled={false}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    mailDetails: {
        height: '25%',
        marginLeft: 20
    },
    detailsTop: {
        flex: 1,
        height: '30%',
        padding: 10,
        borderBottomWidth: 0.5
    },
    detailsBottom: {
        flex: 1,
        height: '45%',
        padding: 10,
        borderBottomWidth: 0.5
    },
    senderLabel: {
        fontSize: 18,
    },
    sender: {
        fontSize: 18,
        color: '#000'
    },
    subject: {
        fontSize: 15,
        fontWeight: '500'
    },
    date: {
        fontSize: 15,
    },
    web: {
        flex: 1,
        height: '100%',
        width: '100%'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    }
});