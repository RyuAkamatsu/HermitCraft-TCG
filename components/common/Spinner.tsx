import React from 'react';
import { View } from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import Colors from '../../constants/Colors';

interface Props {
    size?: number
}

function Spinner({ size = 40 }: Props) {
    return (
        <View style={ spinnerStyle }>
            <UIActivityIndicator size={ size } color={ Colors.ButtonColor } />
        </View>
    );
}

const spinnerStyle = {
    flex          : 1,
    height        : '100%',
    justifyContent: 'center',
    alignItems    : 'center',
    marginVertical: 10
};

// eslint-disable-next-line import/prefer-default-export
export { Spinner };
