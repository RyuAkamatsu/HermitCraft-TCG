import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';

import { store } from './slices/store';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { loadFonts, cacheImages } from './hooks/useCachedResources';

export default function App() {
    const colorScheme = useColorScheme();

    const images = [require('./assets/splash.png')];

    const [isLoadingComplete, setIsLoadingComplete] = useState(false);

    // Load any resources or data that we need prior to rendering the app
    useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                SplashScreen.preventAutoHideAsync();

                await Promise.all([
                    loadFonts(),
                    cacheImages(images),
                    new Promise(resolve => {
                        setTimeout(
                            resolve,
                            1500 // 1.5 second delay
                        );
                    })
                ])
                    .then(() => {
                        setIsLoadingComplete(true);
                    });
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            }
        }

        loadResourcesAndDataAsync();
    }, []);

    useEffect(() => {
        if (isLoadingComplete) {
            SplashScreen.hideAsync();
        }
    }, [isLoadingComplete]);

    return (
        <Provider store={ store }>
            { !isLoadingComplete ? (
                <View style={ styles.splash }>
                    {/* <LottieView
                        ref={ animation }
                        source={ animationJson }
                        autoPlay
                        loop
                        resizeMode="cover"
                    /> */}
                </View>
            ) : (
                <SafeAreaProvider>
                    <Navigation colorScheme={ colorScheme } />
                    <StatusBar />
                </SafeAreaProvider>
            ) }
        </Provider>
    );
}

const styles = StyleSheet.create({
    splash: {
        flex      : 1,
        alignItems: 'center',
        margin    : 0
    }
});
