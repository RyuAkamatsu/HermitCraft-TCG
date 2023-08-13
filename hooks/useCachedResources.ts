import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
// eslint-disable-next-line camelcase
import { NotoSansJP_100Thin } from '@expo-google-fonts/noto-sans-jp';
// eslint-disable-next-line camelcase
import { Inter_400Regular, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';
import { getQuestion, getQuestionCount } from '../slices/QuestionSlice';
import { useAppDispatch } from './useRedux';

export default function useCachedResources() {
    const dispatch = useAppDispatch();
    const [isLoadingComplete, setLoadingComplete] = useState(false);

    // Load any resources or data that we need prior to rendering the app
    useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                Promise.all([
                    loadFonts(),
                    dispatch(getQuestionCount()),
                    dispatch(getQuestion(1)),
                    new Promise(resolve => {
                        setTimeout(
                            resolve,
                            3000 // 3 second delay
                        );
                    })
                ])
                    .then(() => {
                        setLoadingComplete(true);
                    });
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            }
        }

        loadResourcesAndDataAsync();
    }, []);

    return isLoadingComplete;
}

async function loadFonts() {
    // Load fonts
    await Font.loadAsync({
        ...FontAwesome.font,
        'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        // eslint-disable-next-line camelcase
        'noto-sans'  : NotoSansJP_100Thin,
        // eslint-disable-next-line camelcase
        Inter400    : Inter_400Regular,
        // eslint-disable-next-line camelcase
        Inter700    : Inter_700Bold,
        // eslint-disable-next-line camelcase
        Inter900    : Inter_900Black
    });
}
