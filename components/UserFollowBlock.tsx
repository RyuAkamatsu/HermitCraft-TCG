import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Text } from './common/Themed';
import { AvatarImage } from './AvatarImage';

import { Fonts, FontSize } from '../constants/Fonts';
import Colors from '../constants/Colors';

type propTypes = {
    loggedInUserId: string,
    user: any,
    acceptFollow: ((userId: string, accepted: boolean) => void)
}

function UserFollowBlock(props: propTypes) {
    const navigation = useNavigation();

    const [user, setUser] = useState(props.user);

    function navigateToProfile(userId: string) {
        props.loggedInUserId === userId ?
            navigation.navigate('MyProfile') :
            navigation.navigate('OtherProfile', { userId });
    }

    return (
        <View style={ styles.userContainer }>
            <View style={ styles.avatarContainer }>
                <AvatarImage avatar={ user.Avatar } handlePress={ () => navigateToProfile(user._id) } />
            </View>
            <View style={ styles.textContainer }>
                <Pressable
                    onPress={ () => navigateToProfile(user._id) }
                    style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1 }) }
                >
                    <Text style={ styles.usernameText }>@{ user.Username }</Text>
                    <Text style={ styles.nameText }>{ user.Name }</Text>
                </Pressable>
            </View>
            <View style={ styles.buttonContainer }>
                <Pressable
                    onPress={ () => props.acceptFollow(user._id, false) }
                    style={ ({ pressed }) => ({
                        opacity    : pressed ? 0.5 : 1,
                        borderColor: Colors.Grey70,
                        ...styles.iconButton
                    }) }
                >
                    <FontAwesome5 name="times" size={ 20 } color={ Colors.Grey70 } style={{ width: 20, height: 20, textAlign: 'center' }} />
                </Pressable>
                <Pressable
                    onPress={ () => props.acceptFollow(user._id, true) }
                    style={ ({ pressed }) => ({
                        opacity    : pressed ? 0.5 : 1,
                        borderColor: Colors.PrimaryColor,
                        ...styles.iconButton
                    }) }
                >
                    <FontAwesome5 name="check" size={ 20 } color={ Colors.PrimaryColor } style={{ width: 20, height: 20, textAlign: 'center' }} />
                </Pressable>
            </View>
        </View>
    );
}
// eslint-disable-next-line import/prefer-default-export
export { UserFollowBlock };

const styles = StyleSheet.create({
    userContainer: {
        backgroundColor: 'white',
        flexDirection  : 'row',
        borderRadius   : 10,
        padding        : 10,
        borderColor    : Colors.Grey70,
        borderWidth    : 2,
        borderStyle    : 'solid',
        margin         : 5,
    },
    avatarContainer: {
        marginRight   : 5,
        justifyContent: 'center'
    },
    textContainer: { flex: 6, paddingHorizontal: 5 },
    usernameText   : {
        color     : Colors.Grey50,
        fontSize  : FontSize.Small,
        fontFamily: Fonts.Light
    },
    nameText: {
        color     : Colors.Grey50,
        fontSize  : FontSize.Small,
        fontFamily: Fonts.Standard
    },
    buttonContainer: {
        flexDirection: 'row',
        gap          : 5,
        alignItems   : 'center'
    },
    iconButton: {
        borderStyle : 'solid',
        borderWidth : 2,
        borderRadius: 30,
        padding     : 12
    }
});
