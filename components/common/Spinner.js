import React from 'react';
import { View } from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import Colors from '../../constants/Colors';

function Spinner({ size = null }) {
    return (
        <View style={ spinnerStyle }>
            <UIActivityIndicator size={ size || 40 } color={ Colors.ButtonColour } />
        </View>
    );
}

const spinnerStyle = {
    flex          : 1,
    height        : '100%',
    justifyContent: 'center',
    alignItems    : 'center'
};

// eslint-disable-next-line import/prefer-default-export
export { Spinner };
