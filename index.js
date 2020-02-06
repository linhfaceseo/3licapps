/**
 * @format
 */
console.disableYellowBox =  true;
import React, { Component } from 'react';
import { AppRegistry, Text } from 'react-native';
import AppWithRedux from './App';
import { name as appName } from './app.json';


class App extends Component {
    constructor(props) {
        super(props);

        if (!!!Text.defaultProps) {
            Text.defaultProps = {};
        }
        Text.defaultProps.allowFontScaling = false; // Disallow dynamic type on iOS      
    }

    render() {
        return (
            <AppWithRedux />
        );
    }
}

AppRegistry.registerComponent(appName, () => App);
