import React, { Component } from 'react';
import { FlatList, Image, Linking, Modal, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as IntentLauncher from 'expo-intent-launcher';
import * as MediaLibrary from 'expo-media-library';

import { uniqBy } from 'lodash';

import { Button, CustomModal, Error, Spinner } from '..';
import { CHECK, CAMERA_ICON, ARROW_LEFT } from '../../../assets/images';

import { Fonts, FontSize } from '../../../constants/Fonts';
import Colors from '../../../constants/Colors';
import GlobalStyles from '../../../constants/Layout';

class SingleImageChooserOld extends Component {

    constructor(props) {
        super(props);

        this.state = {
            albumName: this.props.albumName || 'App',

            hasPhotoPermissions : true,
            hasCameraPermissions: true,

            photos          : [],
            chosenImage     : null,
            photoListVisible: false,
            photoSubmitting : props.photoSubmitting || false,

            showDeleteModal: false,

            showCamera         : false,
            photoTaken         : false,
            numberOfPhotosTaken: 0,

            displayText: this.props.displayText || "Select 'Add Photo' to choose an image from your photo library or take a new photo"
        };
    }

    async componentDidMount() {
        // This is needed, but not sure why. Bug with Naomi's phone, wouldn't ask for Camera permissions unless getAsync was called first
        const cameraPermissions = await Permissions.getAsync(Permissions.CAMERA);
        const photoPermissions = await Permissions.getAsync(Permissions.CAMERA_ROLL);

        const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
        const { status: photosStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        this.setState({
            hasCameraPermissions: cameraStatus === 'granted',
            hasPhotoPermissions : photosStatus === 'granted'
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.state.hasCameraPermissions || !this.state.hasPhotoPermissions) {
            // const cameraPermissions = await Permissions.getAsync(Permissions.CAMERA);
            // const photoPermissions = await Permissions.getAsync(Permissions.CAMERA_ROLL);

            const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
            const { status: photosStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            this.setState({ hasCameraPermissions: cameraStatus === 'granted', hasPhotoPermissions: photosStatus === 'granted' });

            return true;
        }
        if (this.state.hasCameraPermissions && this.state.hasPhotoPermissions && this.state.photos.length === 0) {
            await this.fetchPhotos();

            return true;
        }
        if (this.props.photoSubmitting !== prevProps.photoSubmitting) {
            this.setState({ photoSubmitting: this.props.photoSubmitting });

            return true;
        }
        if (this.state.chosenImage && prevState.chosenImage !== this.state.chosenImage && this.props.hideSaveButton) {
            this.props.saveImage(this.state.chosenImage);

            return true;
        }

        return false;
    }

    async openDeviceSettings() {
        if (Platform.OS === 'android') {
            await IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_SETTINGS);
        } else {
            await Linking.openURL('app-settings://');
        }
    }

    async fetchPhotos() {
        const { hasPhotoPermissions } = this.state;
        if (hasPhotoPermissions) {
            try {
                const { assets } = await MediaLibrary.getAssetsAsync({ first: 500, sortBy: MediaLibrary.SortBy.modificationTime });

                const pics = uniqBy(assets, p => p.uri);
                // Push {takePhoto: true} so that the first item can be the 'take photo' functionality
                // pics.unshift({ takePhoto: true });
                this.setState({ photos: pics });
            } catch (e) {
            }
        }
    }

    /* deleteImageModalPressed() {
        this.setState({ showDeleteModal: true });
    }; */

    deleteImage() {
        this.setState({ showDeleteModal: false, chosenImage: null });
    }

    takePhoto = () => {

        const { hasPhotoPermissions, albumName, numberOfPhotosTaken } = this.state;

        // photoTaken = true sets the screen to white for UX purposes. We also increment the photo counter.
        this.setState({ photoTaken: true }, async () => {
            if (hasPhotoPermissions) {
                // Take the photo, then save to camera roll. Finally, remove the white screen 'flash'.
                const { uri } = await this.camera.takePictureAsync({ quality: 0.5 });

                try {
                    await MediaLibrary.getAlbumAsync(albumName)
                        .then(async album => {
                            const asset = await MediaLibrary.createAssetAsync(uri);

                            if (album) {
                                await MediaLibrary.addAssetsToAlbumAsync(asset, album, false);
                            } else {
                                await MediaLibrary.createAlbumAsync(albumName, asset);
                            }
                        });

                    this.setState({ numberOfPhotosTaken: numberOfPhotosTaken + 1, photoTaken: false });
                } catch (error) {
                    console.log(error.message);
                }
            } else {
                this.setState({ photoTaken: false });
            }
        });
    };

    async showCamera() {
        if (this.state.hasCameraPermissions) {

            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

            this.setState({ photoListVisible: false, showCamera: true });
        }
    }

    renderImageGallery = () => {

        const { modalContainer, headerContainer, header, done, modalContent } = ImageChooserStyles;

        const { photos, photoListVisible } = this.state;

        return (
            <Modal
                animationType="slide"
                supportedOrientations={ ['portrait'] }
                presentationStyle="fullScreen"
            >
                <SafeAreaView style={{ ...GlobalStyles.SafeArea, backgroundColor: Colors.Grey60 }}>
                    <View style={ modalContainer }>
                        <View style={ headerContainer }>
                            <View style={{ flex: 1 }} />
                            <Text style={ header }>Photos</Text>
                            <TouchableOpacity
                                onPress={ () => this.setState({
                                    photoListVisible   : !photoListVisible,
                                    numberOfPhotosTaken: 0
                                }) }
                                style={{ flex: 1 }}
                            >
                                <Text style={ done }>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={ modalContent }>
                            <FlatList
                                keyExtractor={ item => item.modificationTime }
                                numColumns={ 4 }
                                data={ photos }
                                extraData={ this.state }
                                renderItem={ ({ item, index }) => this.renderImageList(item, index) }
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    };

    renderImageList(item, index) {

        const { chosenImage } = this.state;
        const { takePhotoContainer, takePhotoIcon, takePhotoText, imageContainer, selectedImage, imageStyle, check } = ImageChooserStyles;

        if (index === 0 && item.takePhoto) {
            return (
                <TouchableOpacity key={ index } style={ takePhotoContainer } onPress={ () => this.showCamera() }>
                    <Image source={ CAMERA_ICON } style={ takePhotoIcon } />
                    <Text style={ takePhotoText }>Take photo</Text>
                </TouchableOpacity>
            );
        }

        if (item) {
            const selected = chosenImage && !!chosenImage.find(img => img.uri === item.uri);

            return (
                <TouchableOpacity key={ item.modificationTime } style={ imageContainer } onPress={ () => this.setState({ chosenImage: item, photoListVisible: false }) }>
                    <Image resizeMode="cover" style={ imageStyle } source={{ uri: item.uri }} />
                    { selected && (
                        <View style={ selectedImage }>
                            <Image style={ check } source={ CHECK } />
                        </View>
                    ) }
                </TouchableOpacity>
            );
        }

        return null;

    }

    renderCamera = () => {

        const { hasCameraPermissions, photoTaken, numberOfPhotosTaken } = this.state;
        const { cameraSectionTop, cameraSectionBottom, cameraBack, cameraPhotoCount, cameraCircle } = ImageChooserStyles;

        const backButtonFn = async () => {
            // Hide the camera, show the image modal, refresh the images in the modal
            await this.fetchPhotos();

            this.setState({
                showCamera      : false,
                photoListVisible: true
            }, async () => {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            });
        };

        if (!hasCameraPermissions) {
            return null;
        }

        return (
            <Camera ref={ ref => this.camera = ref } style={{ flex: 1 }} type={ Camera.Constants.Type.back } ratio="16:9" autofocus={ false } useCamera2Api >
                <View style={{ flex: 1, backgroundColor: photoTaken ? '#FFFFFF80' : 'transparent' }}>
                    <View style={ cameraSectionTop }>
                        <TouchableOpacity onPress={ () => backButtonFn() } hitSlop={{ left: 20, top: 20, right: 60, bottom: 50 }}>
                            <Image source={ ARROW_LEFT } style={ cameraBack } />
                        </TouchableOpacity>
                        <Text style={ cameraPhotoCount }>Photos taken: { numberOfPhotosTaken }</Text>
                    </View>
                    <View style={ cameraSectionBottom }>
                        <TouchableOpacity style={ cameraCircle } onPress={ () => this.takePhoto() } />
                    </View>
                </View>
            </Camera>
        );
    };

    saveImage() {
        this.setState({ photoSubmitting: true });
        this.props.saveImage(this.state.chosenImage);
    }

    renderSelectedImage = () => {
        const { singleImageStyle } = ImageChooserStyles;
        const { chosenImage: { uri }, photoSubmitting } = this.state;

        const submitPhotoButton = !this.props.hideSaveButton ? (!photoSubmitting ?
            <Button onPress={ () => this.saveImage() }>Submit photo</Button> : (
                <View style={{ backgroundColor: Colors.ButtonColour, flexDirection: 'row', margin: 5 }}>
                    <Spinner />
                </View>
            )) : null;

        return (
            <View style={{ flex: 1 }}>
                { !this.props.hideBackButton && (
                    <View style={{ backgroundColor: Colors.Grey95 }}>
                        <Button onPress={ this.props.onBack }>Back</Button>
                    </View>
                )}
                <Image style={ singleImageStyle } source={{ uri }} resizeMode="contain" />
                <View style={{ backgroundColor: Colors.Grey95 }}>
                    <Button onPress={ () => this.deleteImage() }>Remove photo</Button>
                    { submitPhotoButton }
                </View>
            </View>
        );
    };

    renderDeleteImageModal = () => (
        <CustomModal
            title="Delete Image"
            description="Are you sure you want to delete this image?"
            buttons={ [
                { buttonText: 'Yes', onClick: () => this.deleteImage() },
                {
                    buttonText     : 'No',
                    onClick        : () => this.setState({ showDeleteModal: false }),
                    backgroundColor: Colors.Grey40
                }
            ] }
        />
    );

    render() {

        // TODO: Need to find a new home for this
        /* <View>
            <Button overrideStyle={overrideButtonStyle} backgroundColor={Colors.Grey40} onPress={() => this.setState({chosenImages: []}, () => this.saveJson())}>Remove photo</Button>
            <Text style={styles.imagePromptText}>Tap an image to delete it.</Text>
        </View> */

        const { hasPhotoPermissions, hasCameraPermissions, photoListVisible, showDeleteModal, showCamera, chosenImage } = this.state;

        if (!hasPhotoPermissions) {
            return (
                <View style={{ flex: 1 }}>
                    <Error heading="Unable to access photo library" text={ "You will need to allow access in your device's settings. Tap to go to the Settings app" } onPress={ () => this.openDeviceSettings() } />
                </View>
            );
        }
        if (!hasCameraPermissions) {
            return (
                <View style={{ flex: 1 }}>
                    <Error heading="Unable to access camera" text={ "You will need to allow access in your device's settings. Tap to go to the Settings app" } onPress={ () => this.openDeviceSettings() } />
                </View>
            );
        }
        if (photoListVisible) {
            return this.renderImageGallery();
        }
        if (showCamera) {
            return this.renderCamera();
        }
        if (showDeleteModal) {
            return this.renderDeleteImageModal();
        }
        if (chosenImage) {
            return this.renderSelectedImage();
        }

        return (
            <View style={{ flex: 1 }}>
                { !this.props.hideBackButton && (
                    <View style={{ flexDirection: 'row', backgroundColor: Colors.Grey95 }}>
                        <Button overrideStyle={{ flex: 1 }} onPress={ this.props.onBack }>Back</Button>
                    </View>
                )}
                <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'center' }}>{this.state.displayText}</Text>
                </View>
                <View style={{ flexDirection: 'column', backgroundColor: Colors.Grey95 }}>
                    <Button onPress={ () => this.setState({ photoListVisible: true }) }>Add photo</Button>
                    { !this.props.hideSaveButton &&
                        <Button backgroundColor={ Colors.Grey80 } disabled>Submit photo</Button>}
                </View>
            </View>
        );
    }
}

export default SingleImageChooserOld;

const ImageChooserStyles = StyleSheet.create({
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
    singleImageStyle: {
        flex : 1,
        width: '100%',
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
        color     : Colors.MainColour,
        fontSize  : FontSize.Medium,
        fontFamily: Fonts.Medium,
        textAlign : 'center'
    },
    done: {
        color     : Colors.ButtonColour,
        fontSize  : FontSize.Medium,
        fontFamily: Fonts.Medium,
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
        fontFamily    : Fonts.Standard,
        fontSize      : FontSize.Small,
        color         : 'white',
        marginVertical: 5
    },
    imageStyle   : { flex: 1 },
    selectedImage: {
        justifyContent : 'center',
        alignItems     : 'center',
        height         : 22,
        width          : 22,
        borderRadius   : 50,
        borderWidth    : 1,
        borderColor    : Colors.MainColour,
        backgroundColor: Colors.ButtonColour,
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
        color     : Colors.MainColour,
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
        fontFamily : Fonts.Medium,
        fontSize   : FontSize.Large,
        color      : 'white',
        alignSelf  : 'center',
        marginRight: 30
    }
});
