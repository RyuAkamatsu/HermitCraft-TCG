import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import * as SplashScreen from 'expo-splash-screen';
import useCachedResources from '../../hooks/useCachedResources';

interface IProps {
    loadingComplete: () => void;
}

export default function Loading({ loadingComplete }: IProps) {
    const animation = useRef(null);
    const animationJson = require('../../assets/splash-screen.json');

    const isLoadingComplete = useCachedResources();

    if (isLoadingComplete) {
        loadingComplete();
        return null;
    }

    SplashScreen.hideAsync();

    return (
        <View style={ styles.splash }>
            <LottieView
                ref={ animation }
                source={ animationJson }
                autoPlay
                loop
                resizeMode="cover"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    splash: {
        flex      : 1,
        alignItems: 'center',
        margin    : 0
    }
});
