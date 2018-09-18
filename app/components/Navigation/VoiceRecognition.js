import React, {Component} from 'react';
import {
    TouchableOpacity,
    Image
} from 'react-native';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';
import {processISODate} from '../Util/Util';


export default class VoiceRecognition extends Component{
    constructor(props){
        super(props);
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        this.startRecognizing.bind(this);
        this.readEmail.bind(this);
    }

    // Speech recognition

    async startRecognizing() {
        console.debug('listening for commands...');
        try {
            // console.log(Voice);
            await Voice.start('en-US');
        } catch (e) {
          console.error(e);
        }
    }

    // Text to Speech

    onSpeechResults(e) {
        let results = e.value;
        console.log(results);
        // this is where to place logic to handle results (or pass through to server)
        // have processing be done in a function, which is determined from props
        // pass through the function as a prop.

        try{
            let words = results[0].split(' ');
            let verb = words[0].toLowerCase();
            let noun = words[1].toLowerCase();

            switch ([verb, noun].join(' ')){
                case 'read email':
                case 'read mail':
                    let attribute = words[2].toLowerCase();
                    console.log(attribute);
                    let searchTarget = words.slice(3, words.length).join(' ');
                    this.readEmail(attribute, searchTarget);
                    break;
                default:
                    throw new Error();
            }
        } catch(error) {
            console.log('Invalid action provided. Try "read email".');
            console.log(error);
            this.readQueue(["I don't understand. Try starting with 'read email', followed by the attribute, such as 'from'."]);
        }
    }

    async readEmail(attribute, searchTarget){
        console.debug(searchTarget);

        // due to how this component is mounted and unmounted and how it's
        // separated in the header, it works a bit strangely so props and
        // state can't be used as they normally could
        // seems like something that might need Redux?
        let navigation = this.props.properties.navigation;
        let mail = navigation.state.params.mail;
        let getDetails = navigation.state.params.getDetails;
        let navigate = navigation.navigate;

        let found = false;

        for(let i=0; i < mail.length; i++){
            let mailItem = mail[i];
            let id = mailItem.id;
            let attributeToMatch;
            let error = false;

            switch(attribute){
                case 'from':
                    attributeToMatch = mailItem.from.emailAddress.name;
                    break;
                case 'regarding':
                case 're':
                    attributeToMatch = mailItem.subject;
                    break;
                default:
                    error = true;

            }
            
            if(error){
                this.readQueue(["I don't understand. Try starting with 'read email', followed by the attribute, such as 'from', or 'regarding' (or 're:')."]);
                break;
            }

            if(attributeToMatch && attributeToMatch.toLowerCase().includes(searchTarget.toLowerCase())){
                console.log('Matched on '+attributeToMatch);
                let mailDetails = await getDetails(id);
                navigate('MailDetails', {
                    details: mailDetails,
                    mail: mail,
                    getDetails: getDetails
                });
                // read email
                let queue = [
                    'From: '+mailItem.from.emailAddress.name,
                    'Received: '+processISODate(mailItem.receivedDateTime),
                    'Subject: '+mailItem.subject,
                    'Contents: '+mailItem.body.content
                ];
                this.readQueue(queue);
                found = true;
                break;
            }
        }

        if(!found){
            this.readQueue([`No match found for email ${attribute} ${searchTarget}`]);
        }
    }

    readQueue(queue){
        let rawTextToSpeak = queue.join('. ');
        let textToSpeak = this.processText(rawTextToSpeak);

        console.debug('Raw text:')
        console.debug(rawTextToSpeak);
        // console.debug('Text to Speak:');
        // console.debug(textToSpeak);

        // break into sentences to be more dynamic
        // this way one bad sentence doesn't crash the whole thing
        // the regex matches periods followed by spaces or newlines
        let sentences = textToSpeak.replace(/(\.\s|\r?\n|\r)/gi, '.. ').split('. ');
        for(let i=0; i<sentences.length; i++){
            this.speak(sentences[i]);
        }
    }

    speak(utterance){
        console.debug(utterance);
        if(utterance){
            Tts.getInitStatus().then(() => {
                Tts.speak(utterance)
                .catch((error) => {
                    console.debug(error);
                    Tts.speak("...I can't read this utterance. ");
                    if(error.code == 'lang_missing_data'){
                        Tts.speak('Cannot determine language of text.');
                    } else {
                        Tts.speak('Error unknown.');
                    }
                });
            }).catch((error) => {
                console.debug(error);
            });
        }
    }

    processText(rawTextToSpeak){
        // remove links (http(s):// or just //), whether enclosed (<>, []) or not
        let linkRegex = /(<|\[)?(http(s)?:)?\/\/[^\s>\]]+(>|\])?/gi;
        let textToSpeak = rawTextToSpeak.replace(linkRegex, '');
        // replace new lines with periods
        let newLineRegex = /(\r?\n|\r)+/gi;
        textToSpeak = textToSpeak.replace(newLineRegex, '. ');
        return textToSpeak;
    }

    componentDidMount(){
        console.log('VoiceRecognition has mounted');
    }

    componentWillUnmount(){
        console.debug('VoiceRecognition unmounting');
        clearVoiceRecognition();
    }

    render(){
        return(
            <TouchableOpacity onPress={() => this.startRecognizing()}>
                <Image
                    style={
                        {
                            width: 30,
                            height: 30,
                            marginRight: 20
                        }
                    }
                    source={require('./button.png')}
                />
            </TouchableOpacity>
        )
    }
    
}

export function clearVoiceRecognition(){ 
    console.info('clearing voice recognition');
    Voice.destroy().then(Voice.removeAllListeners);
    try{
        Tts.stop();
    } catch(error){
        console.log('could not stop Tts');
        console.log(error);
    }
}