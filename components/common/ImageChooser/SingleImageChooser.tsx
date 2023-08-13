import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Linking, Modal, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Camera } from 'expo-camera';
import * as IntentLauncher from 'expo-intent-launcher';
import * as MediaLibrary from 'expo-media-library';

import { uniqBy } from 'lodash';

import { Button, CustomModal, Message } from '../index';
import { CHECK, CAMERA, ARROW_LEFT } from '../../../assets/images';

import { Fonts, FontSize } from '../../../constants/Fonts';
import Colors from '../../../constants/Colors';
import GlobalStyles from '../../../constants/Layout';

interface Props {
    albumName?: string,
    buttonText?: string,
    photoSubmitting?: boolean,
    displayText?: string,
    hideRender?: boolean,
    hideSaveButton?: boolean,
    hideBackButton?: boolean,
    saveImage: (image: any) => void,
    onBack?: () => void
}

function SingleImageChooser(props: Props) {
    let camera: any = null;

    const albumName = props?.albumName ?? 'App';

    const [hasCameraPermissions, setCameraPermissions] = useState(false);
    const [hasPhotoPermissions, setPhotoPermissions] = useState(false);

    const [photos, setPhotos] = useState<any[]>([]);
    const [chosenImage, setChosenImage] = useState<any>(null);
    const [photoListVisible, setPhotoListVisible] = useState(false);
    // const [photoSubmitting, setPhotoSubmitting] = useState(props?.photoSubmitting ?? false);

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const [showCamera, setShowCamera] = useState(false);
    const [photoTaken, setPhotoTaken] = useState(false);
    const [numberOfPhotosTaken, setNumberOfPhotosTaken] = useState(0);

    // const prevPhotoSubmitting = useRef<boolean>(photoSubmitting);
    const prevChosenImage = useRef(chosenImage);

    useEffect(() => {
        async function setPermissions() {
            let permissionStatus;
            let cameraPerm: boolean;
            let photoPerm: boolean;

            permissionStatus = await Camera.getCameraPermissionsAsync();
            cameraPerm = permissionStatus.status === 'granted';

            permissionStatus = await MediaLibrary.getPermissionsAsync();
            photoPerm = permissionStatus.status === 'granted';

            if (!cameraPerm) {
                permissionStatus = await Camera.requestCameraPermissionsAsync();
                cameraPerm = permissionStatus.status === 'granted';
            }

            if (!photoPerm) {
                permissionStatus = await MediaLibrary.requestPermissionsAsync();
                photoPerm = permissionStatus.status === 'granted';
            }

            setCameraPermissions(cameraPerm);
            setPhotoPermissions(photoPerm);
        }

        setPermissions();
    }, []);

    useEffect(() => {

        // prevPhotoSubmitting.current = photoSubmitting;

        async function setActions() {
            if (hasCameraPermissions && hasPhotoPermissions && photos.length === 0) {
                await fetchPhotos();
            /* } else if (props.photoSubmitting && props.photoSubmitting !== prevPhotoSubmitting.current) {
                setPhotoSubmitting(props.photoSubmitting); */
            } else if (prevChosenImage.current !== chosenImage && props.hideSaveButton) {
                await saveImage();
            }
        }

        setActions();
        prevChosenImage.current = chosenImage;

    }, [hasCameraPermissions, hasPhotoPermissions, chosenImage]);

    async function openDeviceSettings() {
        if (Platform.OS === 'android') {
            await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_SETTINGS);
        } else {
            await Linking.openURL('app-settings://');
        }
    }

    async function fetchPhotos() {

        if (hasPhotoPermissions) {
            try {
                const { assets } = await MediaLibrary.getAssetsAsync({ first: 99, sortBy: MediaLibrary.SortBy.modificationTime });

                const pics = uniqBy(assets, (p: { uri: any; }) => p.uri) as any[];

                /*for (const p of pics) {
                    const assetWithInfo = await getAssetInfo(p.id);
                    p.localUri = assetWithInfo.localUri;
                }*/

                // Push {takePhoto: true} so that the first item can be the 'take photo' functionality
                pics.unshift({ takePhoto: true });

                setPhotos(pics);
            } catch (e) { /* empty */ }
        }
    }

    function deleteImage() {
        setDeleteModalVisible(false);
        setChosenImage(null);
    }

    async function takePhoto() {

        // photoTaken = true sets the screen to white for UX purposes. We also increment the photo counter.
        setPhotoTaken(true);

        if (hasPhotoPermissions && camera) {
            // Take the photo, then save to camera roll. Finally, remove the white screen 'flash'.
            const { uri } = await camera.takePictureAsync({ quality: 0.5 });

            try {
                await MediaLibrary.getAlbumAsync(albumName)
                    .then(async (album: any) => {
                        const asset = await MediaLibrary.createAssetAsync(uri);

                        if (album) {
                            await MediaLibrary.addAssetsToAlbumAsync(asset, album, false);
                        } else {
                            await MediaLibrary.createAlbumAsync(albumName, asset);
                        }
                    });

                setNumberOfPhotosTaken(numberOfPhotosTaken + 1);
                setPhotoTaken(false);
            } catch (error : any) {
                console.log(error.message);
            }
        } else {
            setPhotoTaken(false);
        }
    }

    function renderImageGallery() {
        return (
            <Modal
                animationType="slide"
                supportedOrientations={ ['portrait'] }
                presentationStyle="fullScreen"
            >
                <SafeAreaView style={{ ...GlobalStyles.SafeArea, backgroundColor: Colors.Grey60 }}>
                    <View style={ styles.modalContainer }>
                        <View style={ styles.headerContainer }>
                            <View style={{ flex: 1 }} />
                            <Text style={ styles.header }>Photos</Text>
                            <TouchableOpacity
                                onPress={ () => {
                                    setPhotoListVisible(!photoListVisible);
                                    setNumberOfPhotosTaken(0);
                                } }
                                style={{ flex: 1 }}
                            >
                                <Text style={ styles.done }>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={ styles.modalContent }>
                            <FlatList
                                keyExtractor={ item => item.modificationTime }
                                numColumns={ 4 }
                                data={ photos }
                                renderItem={ ({ item, index }) => renderImageList(item, index) }
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }

    function renderImageList(item: any, index: number) {
        if (index === 0 && item.takePhoto) {
            return (
                <TouchableOpacity
                    key={ index }
                    style={ styles.takePhotoContainer }
                    onPress={ async () => {
                        if (hasCameraPermissions) {
                            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

                            setPhotoListVisible(false);
                            setShowCamera(true);
                        }
                    } }
                >
                    <Image source={ CAMERA } style={ styles.takePhotoIcon } />
                    <Text style={ styles.takePhotoText }>Take photo</Text>
                </TouchableOpacity>
            );
        }

        if (item) {
            let selected = false;
            if (chosenImage) {
                selected = chosenImage.uri === item.uri;
            }

            return (
                <TouchableOpacity
                    key={ item.modificationTime }
                    style={ styles.imageContainer }
                    onPress={ () => {
                        setChosenImage(item);
                        setPhotoListVisible(false);
                    } }
                >
                    <Image resizeMode="cover" style={ styles.imageStyle } source={{ uri: item.uri }} />
                    { selected && (
                        <View style={ styles.selectedImage }>
                            <Image style={ styles.check } source={ CHECK } />
                        </View>
                    ) }
                </TouchableOpacity>
            );
        }

        return null;
    }

    function renderCamera() {
        const backButtonFn = async () => {
            // Hide the camera, show the image modal, refresh the images in the modal
            await fetchPhotos();

            setShowCamera(false);
            setPhotoListVisible(true);

            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        };

        if (!hasCameraPermissions) {
            return null;
        }

        return (
            <Camera ref={ (ref: any) => { camera = ref; } } style={{ flex: 1 }} ratio="16:9" autoFocus={ false }>
                <View style={{ flex: 1, backgroundColor: photoTaken ? '#FFFFFF80' : 'transparent' }}>
                    <View style={ styles.cameraSectionTop }>
                        <TouchableOpacity onPress={ () => backButtonFn() } hitSlop={{ left: 20, top: 20, right: 60, bottom: 50 }}>
                            <Image source={ ARROW_LEFT } style={ styles.cameraBack } />
                        </TouchableOpacity>
                        <Text style={ styles.cameraPhotoCount }>Photos taken: { numberOfPhotosTaken }</Text>
                    </View>
                    <View style={ styles.cameraSectionBottom }>
                        <TouchableOpacity style={ styles.cameraCircle } onPress={ () => takePhoto() } />
                    </View>
                </View>
            </Camera>
        );
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

    async function saveImage() {

        const assetWithInfo = await getAssetInfo(chosenImage.id);
        chosenImage.localUri = assetWithInfo.localUri;

        // setPhotoSubmitting(true);
        props.saveImage(chosenImage);
    }

    function renderSelectedImage() {
        let submitPhotoButton = null;

        if (!props.hideSaveButton) {
            submitPhotoButton = /* !photoSubmitting ? */ (
                <Button onPress={ () => saveImage() }>Submit photo</Button>
            );
            /*  : (
                <View style={{ backgroundColor: Colors.ButtonColor, flexDirection: 'row', margin: 5 }}>
                    <Spinner />
                </View>
            ); */
        }

        return (
            <View>
                { !props.hideBackButton && props.onBack && (
                    <View style={{ backgroundColor: Colors.Grey95 }}>
                        <Button onPress={ () => props.onBack && props.onBack() }>Back</Button>
                    </View>
                )}
                { chosenImage && (
                    <View>
                        <Text style={{ textAlign: 'center', color: Colors.TextColor, marginBottom: 20 }}>{ props?.displayText }</Text>
                        <View style={{ justifyContent: 'center' }}>
                            <View style={ styles.singleImageContainer }>
                                <Image style={ styles.singleImageStyle } source={{ uri: chosenImage.uri }} resizeMode="cover" />
                            </View>
                        </View>
                    </View>
                ) }
                <View style={{ backgroundColor: Colors.Grey95, marginVertical: 10 }}>
                    <Button onPress={ () => deleteImage() }>Remove photo</Button>
                    { submitPhotoButton }
                </View>
            </View>
        );
    }

    function renderDeleteImageModal() {
        return (
            <CustomModal
                title="Delete Image"
                description="Are you sure you want to delete this image?"
                buttons={ [
                    { buttonText: 'Yes', onClick: () => deleteImage() },
                    {
                        buttonText     : 'No',
                        onClick        : () => setDeleteModalVisible(false),
                        backgroundColor: Colors.Grey40
                    }
                ] }
            />
        );
    }


    // TODO: Need to find a new home for this
    /* <View>
        <Button
            overrideStyle={overrideButtonStyle}
            backgroundColor={Colors.Grey40}
            onPress={() => this.setState({chosenImages: []}, () => this.saveJson())}
        >
            Remove photo
        </Button>
        <Text style={styles.imagePromptText}>Tap an image to delete it.</Text>
    </View> */

    if (!hasPhotoPermissions) {
        return (
            <Message
                heading="Unable to access photo library"
                text="You will need to allow access in your device's settings. Tap to go to the Settings app"
                onPress={ () => openDeviceSettings() }
            />
        );
    }

    if (!hasCameraPermissions) {
        return (
            <Message
                heading="Unable to access camera"
                text="You will need to allow access in your device's settings. Tap to go to the Settings app"
                onPress={ () => openDeviceSettings() }
            />
        );
    }

    if (photoListVisible) {
        return renderImageGallery();
    }

    if (showCamera) {
        return renderCamera();
    }

    if (deleteModalVisible) {
        return renderDeleteImageModal();
    }

    if (chosenImage && !props.hideRender) {
        return renderSelectedImage();
    }

    return (
        <>
            { !props.hideBackButton && (
                <View style={{ flexDirection: 'row', backgroundColor: Colors.Grey95 }}>
                    <Button overrideContainerStyle={{ flex: 1 }} onPress={ () => props.onBack && props.onBack() }>Back</Button>
                </View>
            )}
            { props?.displayText && !chosenImage && (
                <View style={{ flex: 1, marginBottom: 20 }}>
                    <Text style={{ textAlign: 'center', color: Colors.TextColor }}>{ props?.displayText }</Text>
                </View>
            ) }
            <Button onPress={ () => setPhotoListVisible(true) }>{ props?.buttonText ?? 'Add photo' }</Button>
            { !props.hideSaveButton && <Button backgroundColor={ Colors.Grey80 } onPress={ () => {} }>Submit photo</Button> }
        </>
    );
}

export default SingleImageChooser;

export const styles = StyleSheet.create({
    chosenImageContainer: {
        flex          : 1,
        flexDirection : 'row',
        flexWrap      : 'wrap',
        justifyContent: 'space-between',
        alignItems    : 'center'
    },
    multipleImageTouchStyle: {
        width         : '48%',
        aspectRatio   : 1.5,
        marginVertical: 5,
    },
    multipleImageStyle: {
        flex  : 1,
        width : '100%',
        height: 300
    },
    singleImageContainer: {
        justifyContent : 'center',
        alignSelf      : 'center',
        borderRadius   : 180,
        height         : 360,
        width          : 360,
        backgroundColor: Colors.Grey40
    },
    singleImageStyle: {
        borderRadius  : 180,
        height        : 350,
        width         : 350,
        justifyContent: 'center',
        alignSelf     : 'center',
        marginVertical: 20
    },
    modalContainer: { backgroundColor: 'white' },
    modalContent  : {
        paddingTop       : 20,
        paddingHorizontal: 10
    },
    headerContainer: {
        flexDirection    : 'row',
        paddingVertical  : 15,
        paddingHorizontal: 20,
        backgroundColor  : Colors.Grey60
    },
    header: {
        color     : 'white',
        fontSize  : FontSize.Medium,
        fontFamily: Fonts.Standard,
        textAlign : 'center'
    },
    done: {
        color     : Colors.ButtonColor,
        fontSize  : FontSize.Medium,
        fontFamily: Fonts.Standard,
        textAlign : 'right'
    },
    imageContainer: {
        flex       : 1,
        aspectRatio: 1,
        margin     : 2.5,
        position   : 'relative'
    },
    takePhotoContainer: {
        flex           : 1,
        aspectRatio    : 1,
        margin         : 2.5,
        position       : 'relative',
        backgroundColor: Colors.Grey40,
        justifyContent : 'center',
        alignItems     : 'center'
    },
    takePhotoIcon: {
        height: 25,
        width : 25,
    },
    takePhotoText: {
        fontFamily: Fonts.Standard,
        fontSize  : FontSize.Tiny,
        color     : 'white',
        margin    : 5
    },
    imageStyle   : { flex: 1 },
    selectedImage: {
        justifyContent : 'center',
        alignItems     : 'center',
        height         : 22,
        width          : 22,
        borderRadius   : 50,
        borderWidth    : 1,
        borderColor    : Colors.PrimaryColor,
        backgroundColor: Colors.ButtonColor,
        position       : 'absolute',
        top            : 5,
        right          : 5
    },
    check: {
        width : 13,
        height: 13
    },
    imagePromptText: {
        flex      : 1,
        marginTop : 10,
        color     : Colors.PrimaryColor,
        fontSize  : FontSize.Small,
        fontFamily: Fonts.Standard
    },
    cameraSectionTop: {
        flexDirection : 'row',
        marginVertical: 20,
        justifyContent: 'space-between',
        alignItems    : 'center'
    },
    cameraSectionBottom: {
        flex          : 1,
        marginVertical: 10,
        justifyContent: 'flex-end',
        alignItems    : 'center',
        paddingBottom : 10
    },
    cameraCircle: {
        width         : 75,
        height        : 75,
        borderRadius  : 100,
        borderWidth   : 5,
        borderColor   : '#E6FFFFFF',
        alignItems    : 'center',
        justifyContent: 'center'
    },
    cameraIcon: {
        height: 30,
        width : 30,
    },
    cameraBack: {
        width     : 30,
        height    : 30,
        alignSelf : 'center',
        marginLeft: 30
    },
    cameraPhotoCount: {
        fontFamily : Fonts.Standard,
        fontSize   : FontSize.Large,
        color      : 'white',
        alignSelf  : 'center',
        marginRight: 30
    }
});
