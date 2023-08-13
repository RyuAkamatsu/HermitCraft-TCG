import React from 'react';
import { View } from 'react-native';
import Image from 'react-native-scalable-image';

import { ResponsiveImageStyles } from "../../../styles";

/**
 * This Image component is intended to be responsive by filling the width of the space is it placed
 * in and then scaling its height based on the image's aspect ratio.
 */
const ResponsiveImage = (props) => {

    let { containerStyle, imageStyle } = ResponsiveImageStyles;

    return (
        <View style={containerStyle}>
            <Image
                source={{uri: props.source}}
                style={{...imageStyle, ...props.imageStyle}}
                resizeMode="cover"
            />
        </View>
    )
};

export { ResponsiveImage };