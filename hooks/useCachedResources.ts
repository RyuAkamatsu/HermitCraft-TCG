import * as Font from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { Asset } from 'expo-asset';

export async function loadFonts() {
    // Load fonts
    await Font.loadAsync({
        ...FontAwesome.font,
        minecraft: require('../assets/fonts/MinecraftTen-VGORe.ttf')
    });
}

export function cacheImages(images: any[]) {
    return images.map(image => Asset.fromModule(image).downloadAsync());
}
