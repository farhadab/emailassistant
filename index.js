import { AppRegistry } from 'react-native';
import App from './App';
// https://stackoverflow.com/questions/49789150/warning-ismounted-is-deprecated-in-plain-javascript-classes
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

AppRegistry.registerComponent('emailassistant', () => App);
