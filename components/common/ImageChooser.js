import React, {Component} from 'react';
import {SafeAreaView, Text, Platform, Image, View, FlatList, TouchableOpacity, Modal, Linking, AppState} from 'react-native';
import {Button, CustomModal, Error, Input} from '.';
import {Colors, Fonts, FontSize, GlobalStyles} from "../../../styles";
import {CHECK, CAMERA, ARROW_LEFT, ROTATE} from '../../../../assets/images';
import * as Permissions from 'expo-permissions';
import * as IntentLauncher from 'expo-intent-launcher';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Camera } from 'expo-camera';
import apiClient from '../../../services/ApiClient';
import { getEnvVars } from '../../../../ENV';
import Promise from 'bluebird';

class ImageChooser extends Component {

    constructor(props) {
        super(props);

        this.camera = null;

        const convertToImageObj = img => {
            if (typeof img === "object") {
                return img;
            }
            return {id: img, title: ''};
        };

        const chosenImages = this.props.value ? this.props.value.map(img => convertToImageObj(img)) : [];

        this.state = {
            photos: [],
            chosenImages: chosenImages,
            lastCursor: null,
            modalVisible: false,
            showDeleteModal: false,
            deleteImageIndex: 0,
            hasPhotoPermissions: true,
            hasCameraPermissions: true,
            showCamera: false,
            photoTaken: false,
            numberOfPhotosTaken: 0,
            albumName: this.props.albumName || 'App'
        };
    }

    async componentDidMount() {
        await Permissions.getAsync(Permissions.CAMERA);
        await Permissions.getAsync(Permissions.CAMERA_ROLL);
        const { status: cameraPermission } = await Permissions.askAsync(Permissions.CAMERA);
        const { status: cameraRollPermission } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({
            hasCameraPermissions: cameraPermission === 'granted',
            hasPhotoPermissions: cameraRollPermission === 'granted'},
            () => {
                this.saveJson();
                this.fetchPhotos();
        });

        AppState.addEventListener('change', this.handleAppStateChange.bind(this));

        if (this.props.titles && this.props.value) {
            let p = [];

            this.props.value.forEach(image => p.push(apiClient.get(`/report/attachment/${image.id}`)));

            Promise.all(p)
                .then(responses => {
                    responses.forEach(response => {
                        if (response.status === 200 && response.data) {
                            let images = _.cloneDeep(this.state.chosenImages);
                            let image = images.find(img => img.id === response.data._id);

                            if (image) {
                                image.title = response.data.Title;
                                images.splice(images.findIndex(img => img.id === response.data._id), 1, image);
                                this.setState({chosenImages: images}, () => this.saveJson());
                            }
                        }
                    })
                }).catch(e => {
                    console.log(e);
                });
        }

    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange.bind(this));
    }

    handleAppStateChange(appState) {
        if (appState === 'active') {
            this.setState({photos: [], lastCursor: null}, () => {
                this.fetchPhotos();
            });
        }
    }

    saveJson() {
        this.props.save(this.props.field, this.state.chosenImages);
    }

    async getCameraRollPermissions() {
        await Permissions.getAsync(Permissions.CAMERA);
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasPhotoPermissions: status === "granted"});
        return status === 'granted';
    }

    async fetchPhotos() {
        const { hasPhotoPermissions } = this.state;

        if (hasPhotoPermissions) {
            const { assets } = await MediaLibrary.getAssetsAsync({first: 5000, sortBy: MediaLibrary.SortBy.modificationTime});
            const pics = _.uniqBy(assets, p => p.uri);
            pics.unshift({takePhoto: true});
            this.setState({photos: pics});
            return true;
        } else {
            return false;
        }
    }

    toggleModal() {
        let { photos, hasPhotoPermissions, modalVisible } = this.state;

        //If you have fetched the photos and have permissions, show/hide the modal
        if (photos.length > 0 && hasPhotoPermissions) {
            this.setState({modalVisible: !modalVisible, numberOfPhotosTaken: 0}, () => {
                if (this.props.multiple && !this.state.modalVisible) {
                    this.saveJson();
                }
            });
        } else {
            //Otherwise, try to fetch the photos and only show the modal if doing so was successful
            this.fetchPhotos()
                .then(successful => {
                    if (successful) {
                        this.setState({modalVisible: !modalVisible, numberOfPhotosTaken: 0});
                    }
                });
        }
    }

    handleImageSelect(item) {
        const { multiple, max = 20 } = this.props;
        const uri = item.uri;
        let { chosenImages, modalVisible } = this.state;

        if (multiple) {
            if (chosenImages.find(img => img.id === uri)) {
                chosenImages = chosenImages.filter(c => c.id !== uri);
            } else if (chosenImages.length < (max - 1)) {
                chosenImages.push({id: uri, title: ''});
            } else {
                chosenImages.push({id: uri, title: ''});
                modalVisible = false;
            }
            this.setState({chosenImages, modalVisible}, () => {
                if (this.state.chosenImages.length === max) {
                    this.saveJson();
                }
            });
        } else {
            this.setState({chosenImages: [{id: uri, title: ''}], modalVisible: false}, () => {
                this.saveJson();
            });
        }
    }

    showCamera() {
        if (this.state.hasCameraPermissions) {
            this.setState({modalVisible: false, showCamera: true});
        }
    }

    async takePhoto() {
        const { hasCameraPermissions, albumName, numberOfPhotosTaken } = this.state;

        if (hasCameraPermissions) {
            const { uri } = await this.camera.takePictureAsync({quality: 0.5, skipProcessing: false});
            this.setState({photoTaken: true});

            try {
                await MediaLibrary.getAlbumAsync(albumName)
                    .then(async album => {
                        const asset = await MediaLibrary.createAssetAsync(uri);

                        if (album) {
                            await MediaLibrary.addAssetsToAlbumAsync(asset, album, false);
                        } else {
                            await MediaLibrary.createAlbumAsync(albumName, asset);
                        }

                        this.setState({numberOfPhotosTaken: numberOfPhotosTaken + 1, photoTaken: false});
                    });
            }
            catch(error) {
                console.log(error.message);
            }
        }
    }

    renderModal() {
        let {photos} = this.state;

        if (photos.length > 0) {
            return (
                <Modal
                    animationType="slide"
                    presentationStyle={"fullScreen"}
                    visible={this.state.modalVisible}>
                    <SafeAreaView style={{...GlobalStyles.SafeArea, backgroundColor: Colors.Grey60}}>
                        <View style={styles.modalContainer}>
                            <View style={styles.headerContainer}>
                                <View style={{flex: 1}} />
                                <Text style={styles.header}>Photos</Text>
                                <TouchableOpacity onPress={() => this.toggleModal()} style={{flex: 1}}>
                                    <Text style={styles.done}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalContent}>
                                <FlatList
                                    // keyExtractor={item => item && item.node && item.node.timestamp}
                                    keyExtractor={item => item.id}
                                    numColumns={3}
                                    data={photos}
                                    extraData={this.state}
                                    renderItem={({item, index}) => this.renderCameraRollImage(item, index)} />
                            </View>
                        </View>
                    </SafeAreaView>

                </Modal>
            )
        } else {
            return null;
        }

    }

    renderCameraRollImage(item, index) {
        if (index === 0 && item.takePhoto) {
            return (
                <TouchableOpacity
                    key={index}
                    style={styles.takePhotoContainer}
                    onPress={() => this.showCamera()}>
                    <Image source={CAMERA} style={styles.takePhotoIcon} />
                    <Text style={styles.takePhotoText}>Take photo</Text>
                </TouchableOpacity>
            );
        }

        if (item) {
            const selected = !!this.state.chosenImages.find(img => img.id === item.uri);
            return (
                <TouchableOpacity
                    key={item.creationTime}
                    style={styles.imageContainer}
                    onPress={() => this.handleImageSelect(item)}>
                    <Image
                        resizeMode="cover"
                        style={styles.imageStyle}
                        source={{uri: item.uri}}/>
                        {selected && <View style={styles.selectedImage}>
                            <Image style={styles.check} source={CHECK} />
                        </View>}
                </TouchableOpacity>
            );
        } else {
            return null;
        }
    }

    renderAddPhotoButton() {
        let { multiple, max = 20} = this.props;
        let { chosenImages } = this.state;

        if (multiple) {
            return (
                <View>
                    {
                        chosenImages && chosenImages.length === max
                            ? <Button backgroundColor={Colors.Grey40} upperCase={false} onPress={() => this.toggleModal()}>Change photos</Button>
                            : <Button upperCase={false} onPress={() => this.toggleModal()}>Add Photos (Up to {max})</Button>
                    }
                    {chosenImages.length > 0 && <Text style={styles.imagePromptText}>Tap an image to delete it.</Text>}
                </View>
            )
        } else {
            return (
                <View>
                    {chosenImages && chosenImages.length > 0
                        ? <Button backgroundColor={Colors.Grey40} upperCase={false} onPress={() => this.setState({chosenImages: []}, () => this.saveJson())}>Remove photo</Button>
                        : <Button upperCase={false} onPress={() => this.toggleModal()}>Add Photo</Button>
                    }
                    {chosenImages.length > 0 && <Text style={styles.imagePromptText}>Tap an image to delete it.</Text>}
                </View>
            )
        }
    }

    openDeviceSettings() {
        if (Platform.OS === 'android') {
            IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_SETTINGS);
        } else {
            Linking.openURL('app-settings://');
        }
    }

    deleteImageModal(index) {
        this.setState({showDeleteModal: true, deleteImageIndex: index});
    };

    deleteImage() {
        const {chosenImages, deleteImageIndex} = this.state;
        chosenImages.splice(deleteImageIndex, 1);
        this.setState({showDeleteModal: false, chosenImages: chosenImages}, () => this.saveJson());
    };

    async rotateImage(imageId) {
        const imageIndex = this.state.chosenImages.findIndex(img => img.id === imageId);
        const imageTitle = this.state.chosenImages[imageIndex].title;
        const {uri: rotatedURI} = await ImageManipulator.manipulateAsync(imageId, [{rotate: 90}], {compress: 1});
        const images = this.state.chosenImages;

        images.splice(imageIndex, 1, {id: rotatedURI, title: imageTitle});
        this.setState({chosenImages: images});
    }

    renderImages() {
        const {hasConnection, multiple} = this.props;
        const {chosenImages} = this.state;

        if (hasConnection) {
            //Early exit
            if (chosenImages.length === 0) {
                return null;
            }

            // Render multiple images. If Id length == 24, it's an uploaded image, otherwise it is a local URI
            if (multiple) {
                return (
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                        {this.state.chosenImages.map((image, i) => {
                            const imageInState = this.state.chosenImages.find(img => img.id === image.id);
                            const isId = image.id.length === 24;

                            return (
                                <View key={i} style={{width: '48%', marginVertical: 5}}>
                                    <TouchableOpacity onPress={() => this.deleteImageModal(i)}>
                                        {isId && (
                                            <Image style={{width: '100%', aspectRatio: 1.5}} source={{
                                                uri: `${getEnvVars().apiUrl}/report/attachment/${image.id}/view`,
                                                method: 'GET',
                                                headers: {
                                                    Authorization: `Bearer ${this.props.accessToken}`
                                                }
                                            }} />
                                        )}
                                        {!isId && (
                                            <TouchableOpacity onPress={() => this.rotateImage(image.id)}>
                                                <View style={{padding: 5, backgroundColor: 'black', position: 'absolute', top: 0, left: 0, zIndex: 1}}>
                                                    <Image source={ROTATE} resizeMode="contain" />
                                                </View>
                                                <Image style={{width: '100%', aspectRatio: 1.5}} source={{uri: image.id}} />
                                            </TouchableOpacity>
                                        )}
                                    </TouchableOpacity>
                                    {this.props.titles && (
                                        <Input 
                                            value={imageInState ? imageInState.title : ""}
                                            field={null}
                                            onChangeText={(field, value) => {
                                                let images = _.cloneDeep(this.state.chosenImages);
                                                let updatedImage = {...imageInState};
                                                updatedImage.title = value;
                                                images.splice(images.findIndex(img => img.id === updatedImage.id), 1, updatedImage);
                                                this.setState({chosenImages: images}, () => {
                                                    this.saveJson();
                                                });
                                            }}
                                            placeholder={"Enter image title"} />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )
            } else {
                // Render single images. If Id length == 24, it's an uploaded image, otherwise it is a local URI
                return (
                    <View>
                        {chosenImages[0].id.length === 24 ? (
                            <TouchableOpacity style={styles.chosenImageContainer} onPress={() => this.deleteImageModal(0)}>
                                <Image style={styles.singleImageStyle} source={{
                                    uri: `${getEnvVars().apiUrl}/report/attachment/${this.state.chosenImages[0].id}/view`,
                                    method: 'GET',
                                    headers: {
                                        Authorization: `Bearer ${this.props.accessToken}`
                                    }
                                }} />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.chosenImageContainer}>
                                <TouchableOpacity onPress={() => this.rotateImage(this.state.chosenImages[0].id)} style={{padding: 5, backgroundColor: 'black', position: 'absolute', top: 0, left: 0, zIndex: 1}}>
                                    <Image source={ROTATE} resizeMode="contain" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.deleteImageModal(0)} style={styles.singleImageStyle}>
                                    <Image style={styles.singleImageStyle} source={{uri: this.state.chosenImages[0].id}} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )
            }
        } else {
            return (
                <View style={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                    {chosenImages.map((image, i) => {

                        //If imageId is an Id rather than a local URI
                        if (image.id.length === 24) {
                            return (
                                <View key={i} style={{width: '48%', marginVertical: 5, backgroundColor: Colors.Grey40}}>
                                    <Text style={styles.offlineText}>Unable to load image due to no connection.</Text>
                                </View>
                            )
                        } else {
                            const imageInState = chosenImages.find(img => img.id === image.id);

                            return (
                                <View key={i} style={{width: '48%', marginVertical: 5}}>
                                    <TouchableOpacity onPress={() => this.rotateImage(this.state.chosenImages[i].id)} style={{padding: 5, backgroundColor: 'black', position: 'absolute', top: 0, left: 0, zIndex: 1}}>
                                        <Image source={ROTATE} resizeMode="contain" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.deleteImageModal(i)}>
                                        <Image style={{width: '100%', aspectRatio: 1.5}} source={{uri: image.id}} />
                                    </TouchableOpacity>
                                    {this.props.titles && (
                                        <Input 
                                            value={imageInState ? imageInState.title : ""}
                                            field={null}
                                            onChangeText={(field, value) => {
                                                let images = _.cloneDeep(this.state.chosenImages);
                                                let updatedImage = {...imageInState};

                                                updatedImage.title = value;
                                                images.splice(images.findIndex(img => img.id === updatedImage.id), 1, updatedImage);
                                                this.setState({chosenImages: images}, () => {
                                                    this.saveJson();
                                                });
                                            }}
                                            placeholder={"Enter image title"} />
                                    )}
                                </View>
                            );
                        }
                    })}
                </View>
            )
        }
    }

    render() {
        const backButtonFn = () => {
            // Hide the camera, show the image modal, refresh the images in the modal
            this.setState({
                showCamera: false,
                modalVisible: true,
                photos: [],
                lastCursor: null
            }, () => {
                this.fetchPhotos();
            });
        };

        return (
            <View>
                {this.renderAddPhotoButton()}
                {this.renderModal()}

                <CustomModal
                    isVisible={this.state.showDeleteModal}
                    title="Delete Image"
                    description="Are you sure you want to delete this image?"
                    buttons={[
                        {buttonText: "Yes", onClick: () => this.deleteImage()},
                        {buttonText: "No", onClick: () => this.setState({showDeleteModal: false}), backgroundColor: Colors.Grey40}
                    ]}
                />

                <Modal visible={this.state.showCamera}>
                    <Camera style={{flex: 1}} type={Camera.Constants.Type.back} ratio={"16:9"} ref={ref => this.camera = ref}>
                        <View style={{flex: 1, backgroundColor: this.state.photoTaken ? '#FFFFFF80' : 'transparent'}}>
                            <View style={styles.cameraSectionLeft}>
                                <TouchableOpacity onPress={() => backButtonFn()} hitSlop={{left: 20, top: 20, right: 60, bottom: 50}}>
                                    <Image source={ARROW_LEFT} style={styles.cameraBack} />
                                </TouchableOpacity>
                                <Text style={styles.cameraPhotoCount}>Photos taken:  {this.state.numberOfPhotosTaken}</Text>
                            </View>
                            <View style={styles.cameraSectionCenter} />
                            <View style={styles.cameraSectionCenter} />
                            <View style={styles.cameraSectionCenter}>
                                <TouchableOpacity style={styles.cameraCircle} onPress={() => this.takePhoto()} />
                            </View>
                        </View>
                    </Camera>
                </Modal>

                {this.renderImages()}

                {!this.state.hasPhotoPermissions && <Error heading={"Unable to access photo library"} text={"You will need to allow access in your device's settings."} onPress={() => this.openDeviceSettings()} />}
                {!this.state.hasCameraPermissions && <Error heading={"Unable to access camera"} text={"You will need to allow access in your device's settings."} onPress={() => this.openDeviceSettings()} />}
            </View>
        )
    }
}

const mapStateToProps = ({auth, userProfile}) => {
    const { accessToken } = auth;
    const { hasConnection } = userProfile;
    return { accessToken, hasConnection };
};

export default connect(mapStateToProps, {})(ImageChooser);

const styles = {
    chosenImageContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    multipleImageTouchStyle: {
        width: '48%',
        aspectRatio: 1.5,
        marginVertical: 5,
    },
    multipleImageStyle: {
        flex: 1,
        width: '100%',
        height: 300
    },
    singleImageStyle: {
        width: '100%',
        height: 200
    },
    modalContainer: {
        backgroundColor: 'white'
    },
    modalContent: {
        paddingTop: 20,
        paddingHorizontal: 10
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: Colors.Grey60
    },
    header: {
        color: Colors.MainColour,
        fontSize: FontSize.Small,
        fontFamily: Fonts.Medium,
        flex: 1,
        textAlign: 'center'
    },
    done: {
        color: Colors.ButtonColour,
        fontSize: FontSize.Small,
        fontFamily: Fonts.Medium,
        textAlign: 'right'
    },
    imageContainer: {
        flex: 1,
        aspectRatio: 1,
        margin: 2.5,
        position: 'relative'
    },
    takePhotoContainer: {
        flex: 1,
        aspectRatio: 1,
        margin: 2.5,
        position: 'relative',
        backgroundColor: Colors.Grey40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    takePhotoIcon: {
        height: 25,
        width: 25,
    },
    takePhotoText: {
        fontFamily: Fonts.Standard,
        fontSize: FontSize.Tiny,
        color: 'white',
        marginVertical: 5
    },
    imageStyle: {
        flex: 1
    },
    selectedImage: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 22,
        width: 22,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: Colors.MainColour,
        backgroundColor: Colors.ButtonColour,
        position: 'absolute',
        top: 5,
        right: 5
    },
    check: {
        width: 13,
        height: 13
    },
    imagePromptText: {
        flex: 1,
        marginTop: 10,
        color: Colors.MainColour,
        fontSize: FontSize.Tiny,
        fontFamily: Fonts.Standard
    },
    cameraSectionCenter: {
        flex: 1,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cameraSectionLeft: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cameraCircle: {
        width: 75,
        height: 75,
        borderRadius: 100,
        borderWidth: 5,
        borderColor: '#E6FFFFFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cameraIcon: {
        height: 30,
        width: 30,
    },
    cameraBack: {
        width: 30,
        height: 30,
        alignSelf: 'center',
        marginLeft: 30
    },
    cameraPhotoCount: {
        fontFamily: Fonts.Medium,
        fontSize: FontSize.Medium,
        color: 'white',
        alignSelf: 'center',
        marginRight: 30
    },
    offlineText: {
        color: 'white',
        fontFamily: Fonts.Standard,
        fontSize: FontSize.Tiny,
        textAlign: 'center',
        paddingVertical: 50
    }
};