import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '../../components/Themed';
import { Input, Button, Spinner, Error } from '../../components/common';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { resetPassword } from '../../slices/AuthSlice';
import Layout from '../../constants/Layout';
import { Fonts, FontSize } from '../../constants/Fonts';

function ForgottenPassword() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    const [username, setUsername] = useState('');
    const { resetStatus } = useAppSelector(state => state.auth) as { resetStatus: string };

    return (
        <View style={ Layout.SafeArea }>
            <View style={ styles.iconContainer }>
                <Pressable
                    onPress={ () => navigation.goBack() }
                    style={ ({ pressed }) => ({ opacity: pressed ? 0.5 : 1, flexDirection: 'row' }) }
                >
                    <MaterialIcons
                        name="arrow-left"
                        size={ 30 }
                        color="black"
                    />
                    <Text style={ styles.backText }>Back to login</Text>
                </Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={ false }>
                <View style={ Layout.pageContainer }>
                    <View style={ styles.inputBlock }>
                        <Text style={ Layout.labelStyle }>Enter your username to reset your password.</Text>
                        <Input
                            onChangeText={ (field: any, value: string) => setUsername(value) }
                            placeholder="Username"
                        />
                    </View>
                    { renderMessage() }
                    <View style={ styles.buttonContainer }>
                        { resetStatus === 'loading' ?
                            <Spinner /> :
                            <Button upperCase={ false } onPress={ () => dispatch(resetPassword(username)) }>Submit</Button> }
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}

const renderMessage = () => {
    const { resetStatus, resetMessage } = useAppSelector(state => state.auth) as { resetStatus: string, resetMessage: string | undefined };

    if (resetStatus === 'done' && resetMessage) {
        return <Error heading="Success" text={ resetMessage } />;
    }
    if (resetStatus === 'failed') {
        return <Error text={ resetMessage } />;
    }
    return null;
};

const styles = StyleSheet.create({
    iconContainer: { padding: 10 },
    backText     : {
        alignSelf : 'center',
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Small
    },
    inputBlock     : { marginBottom: 40 },
    buttonContainer: {
        marginVertical: 10,
        alignItems    : 'center'
    },
});

export default ForgottenPassword;
