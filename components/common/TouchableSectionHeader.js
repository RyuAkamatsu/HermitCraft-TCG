import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native'

import { getTouchableHeaderStyle } from "../../../styles";

const TouchableHeader = (props) => {

    const {
        touchLeft,
        touchLeftVal,
        touchRight,
        touchRightVal,
        leftText,
        rightText,
        activePage,
        upperCase,
        viewStyling,
        textStyling } = props;

    const { textStyle, viewStyle } = getTouchableHeaderStyle();
    const textRight = upperCase ? rightText.toUpperCase() : rightText;
    const textLeft = upperCase ? leftText.toUpperCase() : leftText;
    let leftStyle = {...textStyle, ...textStyling};
    let rightStyle = {...textStyle, ...textStyling};

    if (activePage === "left") {
        leftStyle = {...leftStyle, color: 'white'};
    } else {
        rightStyle = {...rightStyle, color: 'white'}
    }

    return (
        <View style={{...viewStyle, ...viewStyling}}>

            <TouchableOpacity onPress={() => touchLeft(touchLeftVal)} hitSlop={{top: 50, bottom: 50, left: 55, right: 40}}>
                <Text style={leftStyle}>{textLeft}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => touchRight(touchRightVal)} hitSlop={{top: 50, bottom: 50, left: 40, right: 55}}>
                <Text style={rightStyle}>{textRight}</Text>
            </TouchableOpacity>

        </View>
    )
};

export default TouchableHeader;