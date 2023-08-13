import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { store } from './slices/store';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Loading from './screens/login/Loading';

export default function App() {

    const [isLoadingComplete, setLoadingComplete] = useState(false);

    SplashScreen.preventAutoHideAsync();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return (
            <Provider store={ store }>
                <Loading loadingComplete={ () => { setLoadingComplete(true); } } />
            </Provider>
        );
    }

    return (
        <Provider store={ store }>
            <SafeAreaProvider>
                <Navigation colorScheme={ colorScheme } />
                <StatusBar />
            </SafeAreaProvider>
        </Provider>
    );

}
