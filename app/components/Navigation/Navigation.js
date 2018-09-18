import React from 'react';
import {
    View,
    Text
} from 'react-native';
import VoiceRecognition from './VoiceRecognition';

export function setNavigationOptions(title, backTitle, properties, hasVoiceRecognition){
    // https://reactnavigation.org/docs/en/stack-navigator.html#navigationoptions-for-screens-inside-of-the-navigator
    console.debug('in setNavigationOptions');
    // variable to control voice recognition component (may parametize)
    return {
        headerBackTitle: backTitle, // for iOS
        headerTitle: (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{fontSize: 18, color: '#000'}}>{title}</Text>
                    </View>
        ),
        headerRight: hasVoiceRecognition ? (
            <VoiceRecognition 
                properties={properties}
            />
        ) : '',
    };
}