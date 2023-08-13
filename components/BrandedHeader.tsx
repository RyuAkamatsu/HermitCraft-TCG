import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import moment from 'moment';
import { MaterialIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AvatarImage } from './AvatarImage';

import { useAppSelector } from '../hooks/useRedux';
import { useGetQuestionByDateQuery } from '../slices/questionAPI';

import homeScreen from '../navigation/utils';
import { Fonts, FontSize } from '../constants/Fonts';
import Colors from '../constants/Colors';
import { useGetUserByIdQuery } from '../slices/userAPI';

function BrandedHeader(
    props: { navigation: { toggleDrawer: () => void; navigate: (arg0: string) => void; }; }
) {
    const insets = useSafeAreaInsets();

    const [homeNavigation, setHomeNavigation] = useState<any>(null);

    const { loggedInUserId: userId, hasUnreadNotification } = useAppSelector(state => state.auth);
    const { data: { user } = {} } = useGetUserByIdQuery(userId, { skip: !userId });
    const { data: { question } = {} } = useGetQuestionByDateQuery(moment().format('YYYY-MM-DD'));

    useEffect(() => {
        async function getHomeLocation() {
            setHomeNavigation(await homeScreen(userId, !!question));
        }

        getHomeLocation();
    }, []);

    return (
        <View style={ styles.headerContainer }>
            <View style={ styles.logoContainer }>
                <Pressable
                    onPress={ () => {
                        props.navigation.navigate(homeNavigation);
                    } }
                    style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1 }) }
                >
                    <Text style={{ ...styles.logoText, marginTop: insets.top }}>pose</Text>
                </Pressable>
            </View>

            <View style={{ ...styles.iconContainer, left: 10, paddingTop: insets.top + 10 }}>
                <Pressable
                    onPress={ () => props.navigation.toggleDrawer() }
                    style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1 }) }
                >
                    <MaterialIcons
                        name="menu"
                        size={ 50 }
                        color={ Colors.PrimaryColor }
                        fontWeight="bold"
                    />
                </Pressable>
            </View>

            { userId && (
                <View style={{ ...styles.iconContainer, right: 10, paddingTop: insets.top + 10 }}>
                    <Pressable
                        onPress={ () => props.navigation.navigate('NotificationCentre') }
                        style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1 }) }
                    >
                        <>
                            <FontAwesome5
                                name="bell"
                                size={ 34 }
                                color={ Colors.Grey40 }
                            />
                            { hasUnreadNotification && (
                                <FontAwesome
                                    name="circle"
                                    size={ 14 }
                                    color={ Colors.PrimaryColor }
                                    style={ styles.notificationDot }
                                />
                            ) }
                        </>
                    </Pressable>
                    <View style={{ marginLeft: 10 }}>
                        { user?.Avatar ? (
                            <AvatarImage avatar={ user.Avatar } size="Header" handlePress={ () => props.navigation.navigate('MyProfile') } />
                        ) : (
                            <Pressable
                                onPress={ () => props.navigation.navigate('MyProfile') }
                                style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1 }) }
                            >
                                <FontAwesome name="user-circle-o" size={ 34 } color={ Colors.Grey40 } />
                            </Pressable>
                        ) }
                    </View>
                </View>
            ) }
        </View>
    );
}

export default BrandedHeader;

const styles = StyleSheet.create({
    headerContainer: {
        position       : 'relative',
        backgroundColor: Colors.SecondaryColor,
        marginVertical : -10
    },
    logoContainer: { alignSelf: 'center' },
    logoText     : {
        fontSize     : FontSize.Exclamation,
        fontFamily   : Fonts.Logo,
        color        : Colors.PrimaryColor,
        letterSpacing: -1.0,
    },
    iconContainer: {
        position      : 'absolute',
        flexDirection : 'row',
        justifyContent: 'center',
        alignItems    : 'center',
        height        : '100%'
    },
    notificationDot: {
        position: 'absolute',
        right   : 0
    }
});
