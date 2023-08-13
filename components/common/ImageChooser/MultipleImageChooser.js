/*import React, { Component } from 'react';
import { SafeAreaView, Text, Platform, Image, View, CameraRoll, FlatList, TouchableOpacity, Modal, Linking, AppState } from 'react-native';
import { connect } from 'react-redux';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as IntentLauncher from 'expo-intent-launcher';
import _ from 'lodash';

import { Button, CustomModal, Error, Input } from '../';
import { CHECK, CAMERA_ICON, ARROW_LEFT } from '../../../../assets/images';
import { Colors, Fonts, FontSize, GlobalStyles } from "../../../styles";

import apiClient from '../../../services/ApiClient';

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
            // chosenImages: this.props.value ? (Array.isArray(this.props.value) ? this.props.value : [this.props.value]) : [],
            chosenImages: chosenImages,
            lastCursor: null,
            modalVisible: false,
            hasPhotoPermissions: false,
            showDeleteModal: false,
            deleteImageIndex: 0,
            hasCameraPermissions: false,
            showCamera: false,
            photoTaken: false,
            numberOfPhotosTaken: 0
        };
    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermissions: status === 'granted'});
    }

    componentDidMount() {
        this.saveJson();
        this.fetchPhotos();

        AppState.addEventListener('change', this.handleAppStateChange.bind(this));

        if (this.props.titles && this.props.value) {
            let p = [];

            this.props.value.forEach(imageId => p.push(apiClient.get(`/report/attachment/${imageId}`)));

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
                })
                .catch(e => {
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
        //this.props.save(this.props.field, this.state.chosenImages);
    }

    getCameraRollPermissions() {
        return Permissions.askAsync(Permissions.CAMERA_ROLL)
            .then(({status}) => {
                this.setState({ hasPhotoPermissions: status === "granted" });
                return status === "granted";
            })
            .catch(() => false);
    }

    fetchPhotos() {
        return this.getCameraRollPermissions()
            .then(hasPhotoPermissions => {
                if (hasPhotoPermissions) {
                    const { lastCursor } = this.state;
                    let options = { first: 5000, assetType: "Photos", groupTypes: "All" };

                    if (Platform.OS === "android") {
                        delete options.groupTypes; //Not compatible on android
                    }

                    if (lastCursor) {
                        options.after = lastCursor;
                    }

                    return CameraRoll.getPhotos(options)
                        .then(result => {
                            let pics = _.reverse(_.sortBy(_.uniqBy(result.edges, r => r.node.image.uri), r => r.node.timestamp));

                            //Push {takePhoto: true} so that the first item can be the 'take photo' functionality
                            pics.unshift({takePhoto: true});
                            this.setState({photos: pics, lastCursor: result.page_info.end_cursor});

                            return true;
                        })
                        .catch(() => false);
                }
                else {
                    return false;
                }
            });
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
        }
        else {
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
        let { max = 20 } = this.props;
        let { chosenImages, modalVisible } = this.state;
        let uri = item.node.image.uri;


        if (chosenImages.find(img => img.id === uri)) {
            chosenImages = chosenImages.filter(c => c.id !== uri);
        }
        else if (chosenImages.length < (max - 1)) {
            chosenImages.push({id: uri, title: ''});
        }
        else {
            chosenImages.push({id: uri, title: ''});
            modalVisible = false;
        }
        this.setState({chosenImages, modalVisible}, () => {
            if (this.state.chosenImages.length === max) {
                this.saveJson();
            }
        });

    }

    showCamera() {
        if (this.state.hasCameraPermissions) {
            this.setState({modalVisible: false, showCamera: true});
        }
    }

    takePhoto() {
        // photoTaken = true sets the screen to white for UX purposes. We also increment the photo counter.
        this.setState({photoTaken: true, numberOfPhotosTaken: this.state.numberOfPhotosTaken + 1}, () => {

            // Take the photo, then save to camera roll. Finally, remove the white screen 'flash'.
            this.camera.takePictureAsync({
                quality: 0.5,
                onPictureSaved: async (photo) => {
                    await CameraRoll.saveToCameraRoll(photo.uri);
                }
            });

            setTimeout(() => {
                this.setState({photoTaken: false});
            }, 100);
        });
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
                                    keyExtractor={item => item && item.node && item.node.timestamp}
                                    numColumns={3}
                                    data={photos}
                                    extraData={this.state}
                                    renderItem={({item, index}) => this.renderImage(item, index)} />
                            </View>
                        </View>
                    </SafeAreaView>

                </Modal>
            )
        }
        else {
            return null;
        }

    }

    renderImage(item, index) {
        if (index === 0 && item.takePhoto) {
            return (
                <TouchableOpacity
                    key={index}
                    style={styles.takePhotoContainer}
                    onPress={() => this.showCamera()}>
                    <Image source={ CAMERA_ICON } style={styles.takePhotoIcon} />
                    <Text style={styles.takePhotoText}>Take photo</Text>
                </TouchableOpacity>
            );
        }

        if (item && item.node) {
            const selected = !!this.state.chosenImages.find(img => img.id === item.node.image.uri);
            return (
                <TouchableOpacity
                    key={item.node.timestamp}
                    style={styles.imageContainer}
                    onPress={() => this.handleImageSelect(item)}>
                    <Image
                        resizeMode="cover"
                        style={styles.imageStyle}
                        source={{uri: item.node.image.uri}}/>
                        {selected && <View style={styles.selectedImage}>
                            <Image style={styles.check} source={CHECK} />
                        </View>}
                </TouchableOpacity>
            );
        }
        else {
            return null;
        }
    }

    renderAddPhotoButton() {
        let { multiple, max = 20, overrideButtonStyle } = this.props;
        let { chosenImages = [] } = this.state;


            if (chosenImages.length !== max ) {
                return (
                    <Button overrideStyle={overrideButtonStyle} onPress={() => this.toggleModal()}>Add Photos (Up to {max})</Button>
                );
            }
            else {
                return (
                    <Button overrideStyle={overrideButtonStyle} backgroundColor={Colors.Grey40} onPress={() => this.toggleModal()}>Change photos</Button>
                );
            }

            return (
                <View>
                    { chosenImages.length > 0 && <Text style={styles.imagePromptText}>Tap an image to delete it.</Text> }
                </View>
            )
    }

    async openDeviceSettings() {
        if (Platform.OS === 'android') {
            await IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_SETTINGS);
        } else {
            await Linking.openURL('app-settings://');
        }
    }

    deleteImageModal(index) {
        this.setState({ showDeleteModal: true, deleteImageIndex: index });
    };

    deleteImage() {
        const { chosenImages, deleteImageIndex } = this.state;

        chosenImages.splice(deleteImageIndex, 1);
        this.setState({ showDeleteModal: false, chosenImages }, () => this.saveJson());
    };

    displayImages() {

        const { chosenImages } = this.state;

        if (chosenImages.length === 0) {
            return;
        }


        //Render multiple images
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                { chosenImages.map((image, i) => {
                    const imageInState = chosenImages.find(img => img.id === image.id);
                    const isId = image.id.length === 24 ;

                    return (
                        <View key={i} style={{ width: '48%', marginVertical: 5 }}>
                            <TouchableOpacity onPress={() => this.deleteImageModal(i)}>
                                {isId && (
                                    <Image style={{ width: '100%', aspectRatio: 1.5 }} source={{
                                        uri: `https://reg38-dev.simpleclick.co.uk/api/v1/report/attachment/${image.id}/view`,
                                        method: 'GET',
                                        headers: {
                                            Authorization: `Bearer ${this.props.accessToken}`
                                        }
                                    }} />
                                )}
                                {!isId && (
                                    <Image style={{width: '100%', aspectRatio: 1.5}} source={{uri: image.id}} />
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
                                        this.setState({ chosenImages: images }, () => {
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

        const { showDeleteModal, showCamera, photoTaken, numberOfPhotosTaken } = this.state;
        const { cameraSectionLeft, cameraBack, cameraPhotoCount, cameraSectionCenter, cameraCircle } = styles;

        return (
            <View>
                { this.renderAddPhotoButton() }
                { this.renderModal() }

                <CustomModal
                    isVisible={ showDeleteModal }
                    title="Delete Image"
                    description="Are you sure you want to delete this image?"
                    buttons={[
                        {buttonText: "Yes", onClick: () => this.deleteImage()},
                        {buttonText: "No", onClick: () => this.setState({ showDeleteModal: false }), backgroundColor: Colors.Grey40}
                    ]}
                />

                <Modal visible={ showCamera }>
                    <Camera style={{ flex: 1 }} type={ Camera.Constants.Type.back } ratio={"16:9"} ref={ ref => this.camera = ref }>
                        <View style={{ flex: 1, backgroundColor: photoTaken ? '#FFFFFF80' : 'transparent' }}>
                            <View style={ cameraSectionLeft }>
                                <TouchableOpacity onPress={() => backButtonFn()} hitSlop={{ left: 20, top: 20, right: 60, bottom: 50 }}>
                                    <Image source={ ARROW_LEFT } style={ cameraBack } />
                                </TouchableOpacity>
                                <Text style={ cameraPhotoCount }>Photos taken:  { numberOfPhotosTaken }</Text>
                            </View>
                            <View style={ cameraSectionCenter } />
                            <View style={ cameraSectionCenter } />
                            <View style={ cameraSectionCenter }>
                                <TouchableOpacity style={ cameraCircle } onPress={ () => this.takePhoto() }>
                                    {/* <Image source={CAMERA} style={styles.cameraIcon} /> */}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Camera>
                </Modal>

                { this.displayImages() }

                {!this.state.hasPhotoPermissions && <Error heading={"Unable to access photo library"} text={"You will need to allow access in your device's settings."} onPress={() => this.openDeviceSettings()} />}
                {!this.state.hasCameraPermissions && <Error heading={"Unable to access camera"} text={"You will need to allow access in your device's settings."} onPress={() => this.openDeviceSettings()} />}
            </View>
        )
    }
}

const mapStateToProps = ({auth}) => {
    const { accessToken } = auth;
    return { accessToken };
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
        fontSize: FontSize.Medium,
        fontFamily: Fonts.Medium,
        flex: 1,
        textAlign: 'center'
    },
    done: {
        color: Colors.ButtonColour,
        fontSize: FontSize.Medium,
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
        fontSize: FontSize.Small,
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
        fontSize: FontSize.Small,
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
        fontSize: FontSize.Large,
        color: 'white',
        alignSelf: 'center',
        marginRight: 30
    }
};*/