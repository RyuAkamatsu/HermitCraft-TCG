import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useInternetStatus = () => {
    const [reachable, setReachable] = useState(false);

    useEffect(() => {
        // Subscribe
        const unsubscribe = NetInfo.addEventListener(state => {
            setReachable(state.isInternetReachable ?? false);
            console.log('Connection type', state.type);
            console.log('Is internet Reachable?', reachable);
        });
        return () => {
            unsubscribe();
        };
    }, [reachable]);

    return reachable;
};

export default useInternetStatus;
