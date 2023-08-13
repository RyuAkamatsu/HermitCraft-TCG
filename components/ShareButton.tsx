import React from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Fonts, FontSize } from '../constants/Fonts';

interface Props {
    size: number,
    shareText?: string,
    shareContainerOverride?: any,
    showText?: boolean
}

function ShareButton({ size, shareText = '', shareContainerOverride = {}, showText = false }: Props) {

    const stylesObj = styles(size);
    const { shareButton, showIcon, shareTextStyle } = stylesObj;

    const shareContainer = { ...stylesObj.shareContainer, ...shareContainerOverride };

    const onShare = async () => {
        try {
            const result = await Share.share({ message: shareText });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            console.error(error.message);
        }
    };

    return (
        <View style={ shareContainer }>
            <Pressable
                onPress={ () => onShare() }
                style={ ({ pressed }) => [{ ...shareButton, opacity: pressed ? 0.5 : 1.0 }] }
            >
                <MaterialIcons name="share" size={ size } style={ showIcon } />
                { showText && <Text style={ shareTextStyle }>Share</Text> }
            </Pressable>
        </View>
    );
}

export { ShareButton };

const styles = (size: number) => StyleSheet.create({
    shareContainer: {
        alignSelf     : 'center',
        marginVertical: 10
    },
    shareButton: {
        height         : (size - 10) * 2.5,
        width          : (size - 10) * 2.5,
        backgroundColor: Colors.Grey40,
        borderRadius   : size / 2,
        justifyContent : 'center',
        alignItems     : 'center',
    },
    showIcon      : { color: 'white' },
    shareTextStyle: {
        textAlign : 'center',
        color     : 'white',
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Medium
    },
});
