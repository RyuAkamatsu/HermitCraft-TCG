import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { CacheManager } from 'react-native-expo-image-cache';

function CacheImage(props: any) {
    const [imgURI, setImgURI] = useState(null as string|null);

    useEffect(() => {
        async function getCacheImage() {
            if (props.uri) {
                // console.log('Cache image uri:', props.uri);
                let path = props.uri;

                if (props.uri.indexOf('https://') > -1) {
                    path = await CacheManager.get(props.uri, props.options ?? {}).getPath();
                }

                if (path) {
                    setImgURI(path);
                }
            }
        }

        getCacheImage()
            .catch(console.error);

    }, [props.uri]);

    if (!imgURI) {
        return null;
    }

    return (
        <Image
            source={{ uri: imgURI }}
            resizeMode={ props.resizeMode }
            style={ props.style }
        />
    );
}

export default CacheImage;
