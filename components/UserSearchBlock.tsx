import React, { useCallback } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from './common';
import { Text } from './common/Themed';
import { AvatarImage } from './AvatarImage';

import { SearchBlock } from '../slices/types';

import { Fonts, FontSize } from '../constants/Fonts';
import Colors from '../constants/Colors';

type propTypes = {
    loggedInUserId: string,
    searchUser: SearchBlock,
    requestFollow: ((userId: string) => void)
}

function UserSearchBlock(props: propTypes) {
    const navigation = useNavigation();

    const { searchUser, loggedInUserId, requestFollow } = props;

    const navigateToProfile = useCallback(() => {
        searchUser.UserId === loggedInUserId ?
            navigation.navigate('MyProfile') :
            navigation.navigate('OtherProfile', { userId: searchUser.UserId });
    }, []);

    if (!searchUser?.UserId) {
        return null;
    }

    let followText = 'Follow';
    let backgroundColor = Colors.Grey40;

    if (searchUser.UserFollowingStatus === 'Requested') {
        followText = 'Requested';
        backgroundColor = Colors.SecondaryColor;
    } else if (searchUser.UserFollowingStatus === 'Following') {
        followText = 'Following';
        backgroundColor = Colors.PrimaryColor;
    }

    return (
        <View style={ styles.userContainer }>
            <View style={ styles.avatarContainer }>
                <AvatarImage avatar={ searchUser.Avatar } handlePress={ () => navigateToProfile() } />
            </View>
            <View style={ styles.textContainer }>
                <Pressable
                    onPress={ () => navigateToProfile() }
                    style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1 }) }
                >
                    <Text style={ styles.usernameText }>@{ searchUser.Username }</Text>
                    <Text style={ styles.nameText }>{ searchUser.Name }</Text>
                </Pressable>
            </View>
            <View style={ styles.buttonContainer }>
                <Button
                    upperCase={ false }
                    onPress={ () => requestFollow(searchUser.UserId) }
                    backgroundColor={ backgroundColor }
                >
                    { followText }
                </Button>
            </View>
        </View>
    );
}
// eslint-disable-next-line import/prefer-default-export
export { UserSearchBlock };

const styles = StyleSheet.create({
    userContainer: {
        backgroundColor: 'white',
        flexDirection  : 'row',
        borderRadius   : 10,
        padding        : 6,
        borderColor    : Colors.Grey70,
        borderWidth    : 2,
        borderStyle    : 'solid',
        marginVertical : 5
    },
    avatarContainer: {
        marginRight   : 5,
        justifyContent: 'center'
    },
    textContainer: { flex: 6 },
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
        flex          : 5,
        justifyContent: 'center',
        marginLeft    : 10
    }
});
