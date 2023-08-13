import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

import { ButtonWithIcon, Message } from './common';

import { Fonts, FontSize } from '../constants/Fonts';
import Colors from '../constants/Colors';


interface Props {
    saveImage: (image: any) => void,
    chosenImage: any,
    displayText?: string,
}

function SingleImagePicker(props: PropsWithChildren<Props>) {

    const [hasCameraPermissions, setCameraPermissions] = useState(false);
    const [hasPhotoPermissions, setPhotoPermissions] = useState(false);

    const [chosenImage, setChosenImage] = useState(props.chosenImage);

    useEffect(() => {
        async function setPermissions() {
            let cameraPerm: boolean;
            let photoPerm: boolean;

            let cameraStatus = await Camera.getCameraPermissionsAsync();
            cameraPerm = cameraStatus.status === 'granted';

            if (!cameraPerm && cameraStatus.canAskAgain) {
                cameraStatus = await Camera.requestCameraPermissionsAsync();
                cameraPerm = cameraStatus.status === 'granted';
            }

            let photoStatus = await MediaLibrary.getPermissionsAsync();
            photoPerm = photoStatus.status === 'granted';

            if (!photoPerm && photoStatus.canAskAgain) {
                photoStatus = await MediaLibrary.requestPermissionsAsync();
                photoPerm = photoStatus.status === 'granted';
            }

            setCameraPermissions(cameraPerm);
            setPhotoPermissions(photoPerm);
        }

        setPermissions();
    }, []);

    useEffect(() => {
        if (chosenImage?.uri !== props.chosenImage?.uri) {
            props.saveImage(chosenImage);
        }
    }, [chosenImage]);

    async function openDeviceSettings() {
        if (Platform.OS === 'android') {
            await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_SETTINGS);
        } else {
            await Linking.openURL('app-settings://');
        }
    }

    const getAssetInfo = async (id: MediaLibrary.AssetRef) => {
        const res = await MediaLibrary.getAssetInfoAsync(id);

        const asset = {
            creationTime: res.creationTime,
            isFavorite  : res.isFavorite,
            localUri    : res.localUri,
        };

        return asset;
    };

    const saveImage = async (assets: ImagePicker.ImagePickerAsset[]) => {
        if (assets.length > 0) {
            const img = Object.assign(assets[0]);

            if (img.uri) {
                //const assetWithInfo = await getAssetInfo(img.assetId);
                //img.localUri = assetWithInfo.localUri;
                setChosenImage(img);
            }
        }
    };

    const pickImageAsync = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });

        if (!result.canceled) {
            await saveImage(result.assets);
        }
    };

    const takeNewPhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({ quality: 1 });

        if (!result.canceled) {
            await saveImage(result.assets);
        }
    };

    return (
        <View>
            { props.displayText && <Text style={{ textAlign: 'center', color: Colors.TextColor, marginBottom: 20 }}>{ props?.displayText }</Text> }
            { props.children }
            <View style={{ marginVertical: 10, gap: 10 }}>
                { !hasCameraPermissions ? (
                    <Message
                        heading="Unable to access camera"
                        text="You will need to allow access in your device's settings. Tap to go to the Settings app"
                        onPress={ () => openDeviceSettings() }
                    />
                ) : (
                    <ButtonWithIcon
                        onPress={ () => takeNewPhoto() }
                        buttonIcon="camera"
                        iconType="FontAwesome5"
                        iconColor="white"
                        overrideContainerStyle={ styles.buttonContainer }
                    >
                        <Text style={ styles.buttonText }>Take a new photo</Text>
                    </ButtonWithIcon>
                )}
                { !hasPhotoPermissions ? (
                    <Message
                        heading="Unable to access photo library"
                        text="You will need to allow access in your device's settings. Tap to go to the Settings app"
                        onPress={ () => openDeviceSettings() }
                    />
                ) : (
                    <ButtonWithIcon
                        onPress={ () => pickImageAsync() }
                        buttonIcon="picture-o"
                        iconType="FontAwesome"
                        iconColor="white"
                        overrideContainerStyle={ styles.buttonContainer }
                    >
                        <Text style={ styles.buttonText }>{ chosenImage?.uri ? 'Choose a new image' : 'Pick an existing image' }</Text>
                    </ButtonWithIcon>
                )}
            </View>
        </View>
    );
}

export default SingleImagePicker;

export const styles = StyleSheet.create({
    buttonContainer: { alignItems: 'center' },
    buttonText     : {
        fontSize  : FontSize.Medium,
        fontFamily: Fonts.Standard,
        color     : 'white',
        padding   : 15,
        textAlign : 'center'
    }
});
