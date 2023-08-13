import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import getEnvVars from '../ENV';
import { useAppSelector } from '../hooks/useRedux';
import CacheImage from './common/CacheImage';
import Colors from '../constants/Colors';

interface Props {
    avatar: string,
    size?: 'Profile' | 'Inline' | 'Header',
    isPremium?: boolean,
    handlePress?: (() => void) | null
}

function AvatarImage({ avatar, size = 'Inline', isPremium = false, handlePress = null }: Props) {
    const { apiUrl } = getEnvVars();
    const { accessTokenKey } = useAppSelector(state => state.auth) as { accessTokenKey: string };

    const imageURI = avatar.indexOf('file:') > -1 ? avatar : `${apiUrl}/user/get-profile-picture/${avatar}`;

    let sizeNum = 0;
    let borderSize = 0;
    switch (size) {
        case 'Profile':
            sizeNum = 220;
            borderSize = 230;
            break;
        case 'Inline':
            sizeNum = 50;
            borderSize = 56;
            break;
        case 'Header':
            sizeNum = 34;
            borderSize = 40;
            break;
        default:
            break;
    }

    const { imageContainer, checkContainer, checkIcon, profilePicture } = styles(sizeNum, borderSize);

    function imageView() {
        return (
            <View style={ imageContainer }>
                { isPremium && (
                    <View style={ checkContainer }>
                        <MaterialIcons name="check" size={ 52 } style={ checkIcon } />
                    </View>
                ) }
                { avatar && (
                    <CacheImage
                        uri={ imageURI }
                        resizeMode="cover"
                        style={ profilePicture }
                        options={{ headers: { Authorization: `Bearer ${accessTokenKey}` } }}
                    />
                ) }
            </View>
        );
    }

    if (handlePress) {
        return (
            <Pressable
                onPress={ handlePress ? () => handlePress() : null }
                style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1 }) }
            >
                { imageView() }
            </Pressable>
        );
    }

    return imageView();
}

export { AvatarImage };

const styles = (sizeNum: number, borderSize: number) => StyleSheet.create({
    imageContainer: {
        position       : 'relative',
        justifyContent : 'center',
        alignSelf      : 'center',
        borderRadius   : borderSize / 2,
        height         : borderSize,
        width          : borderSize,
        backgroundColor: Colors.Grey40
    },
    checkContainer: {
        position       : 'absolute',
        backgroundColor: Colors.PrimaryColor,
        height         : 68,
        width          : 68,
        borderRadius   : 50,
        zIndex         : 100,
        top            : 0,
        right          : 0
    },
    checkIcon: {
        color         : 'white',
        justifyContent: 'center',
        alignSelf     : 'center',
        marginLeft    : -3,
        marginTop     : 7
    },
    profilePicture: {
        borderRadius  : sizeNum / 2,
        height        : sizeNum,
        width         : sizeNum,
        justifyContent: 'center',
        alignSelf     : 'center',
    },
});
