import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Spinner, Button, Error } from '../../components/common';
import { Text } from '../../components/Themed';

import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { usernameChanged, passwordChanged, loginUser } from '../../slices/AuthSlice';
import { RootStackScreenProps } from '../../types';
import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import { Fonts, FontSize } from '../../constants/Fonts';


interface Auth {
    username: string,
    password: string,
    loginMessage: string | undefined,
    loginStatus: string | null
}

function LoginForm({ navigation }: RootStackScreenProps<'SignIn'>) {

    const dispatch = useAppDispatch();
    const { username, password, loginMessage, loginStatus } = useAppSelector(state => state.auth) as Auth;

    const loginDisabled = !username || !password;

    return (
        <SafeAreaView style={ Layout.SafeArea }>
            <ScrollView keyboardShouldPersistTaps="never" keyboardDismissMode="on-drag">
                <View style={ Layout.pageContainer }>
                    <View style={ styles.inputBlock }>
                        <Text style={ Layout.labelStyle }>Username</Text>
                        <Input
                            placeholder="username (enter a number between 1-5)"
                            onChangeText={ (field: any, value: string) => dispatch(usernameChanged(value)) }
                            value={ username }
                        />
                    </View>
                    <View style={ styles.inputBlock }>
                        <Text style={ Layout.labelStyle }>Password</Text>
                        <Input
                            secureTextEntry
                            placeholder="password"
                            onChangeText={ (field: any, value: string) => dispatch(passwordChanged(value)) }
                            value={ password }
                        />
                    </View>

                    <View>{ loginStatus === 'failed' ? <Error text={ loginMessage } /> : null }</View>

                    <View style={ styles.loginButtonContainer }>
                        { loginStatus === 'loading' ?
                            <Spinner /> : (
                                <Button
                                    upperCase={ false }
                                    { ...(loginDisabled ? { backgroundColor: Colors.Grey80 } : {}) }
                                    onPress={ () => (loginDisabled ? null : dispatch(loginUser())) }
                                >Login
                                </Button>
                            )}
                    </View>

                    <View style={ styles.forgotContainer }>
                        <Pressable onPress={ () => navigation.navigate('ForgottenPassword') }>
                            <Text style={ styles.forgotPassword }>Forgotten password?</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default LoginForm;

const styles = StyleSheet.create({
    inputBlock          : { marginBottom: 40 },
    loginButtonContainer: {
        marginVertical: 10,
        alignItems    : 'center'
    },
    forgotContainer: {
        flex           : 1,
        alignItems     : 'center',
        paddingVertical: 40
    },
    forgotPassword: {
        fontSize          : FontSize.Medium,
        fontFamily        : Fonts.Light,
        color             : Colors.Grey60,
        textDecorationLine: 'underline'
    }
});
