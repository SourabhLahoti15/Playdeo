import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {
    NativeAd,
    NativeAdView,
    NativeAsset,
    NativeAssetType,
    NativeMediaView,
    TestIds,
} from 'react-native-google-mobile-ads';

export default function AdNative() {
    const [nativeAd, setNativeAd] = useState(null);

    useEffect(() => {
        let ad = null;
        let isMounted = true;

        NativeAd.createForAdRequest(TestIds.NATIVE, {
            requestNonPersonalizedAdsOnly: true,
        })
            .then((createdAd) => {
                ad = createdAd;
                if (isMounted) {
                    setNativeAd(createdAd);
                }
            })
            .catch(console.error);

        return () => {
            isMounted = false;
            ad?.destroy();
        };
    }, []);

    if (!nativeAd) return null;

    const secondaryText = nativeAd.advertiser || nativeAd.store || 'Sponsored';

    return (
        <View style={styles.container}>
            <NativeAdView nativeAd={nativeAd} style={styles.native_container}>
                <Text style={styles.badge}>Sponsored</Text>

                <View style={styles.row}>
                    <NativeAsset assetType={NativeAssetType.ICON}>
                        <Image
                            source={{ uri: nativeAd.icon?.url }}
                            style={styles.icon}
                        />
                    </NativeAsset>
                    <View style={styles.titleBlock}>
                        <NativeAsset assetType={NativeAssetType.HEADLINE}>
                            <Text style={styles.headline}>{nativeAd.headline}</Text>
                        </NativeAsset>
                        {nativeAd.advertiser ? (
                            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                                <Text style={styles.advertiser}>{nativeAd.advertiser}</Text>
                            </NativeAsset>
                        ) : nativeAd.store ? (
                            <NativeAsset assetType={NativeAssetType.STORE}>
                                <Text style={styles.advertiser}>{nativeAd.store}</Text>
                            </NativeAsset>
                        ) : (
                            <Text style={styles.advertiser}>{secondaryText}</Text>
                        )}
                    </View>
                </View>

                <NativeAsset assetType={NativeAssetType.BODY}>
                    <Text style={styles.body}>{nativeAd.body}</Text>
                </NativeAsset>

                <NativeMediaView style={styles.media} />

                <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                    <Text style={styles.cta}>{nativeAd.callToAction}</Text>
                </NativeAsset>
            </NativeAdView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        width: '100%',
        backgroundColor: '#000',
        borderBottomWidth: 1,
        borderColor: 'gray'
    },
    native_container: {
        gap: 8,
        width: "100%"
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        backgroundColor: '#303030',
        color: '#c7c7c7',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 10,
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 6,
    },
    titleBlock: {
        flex: 1,
    },
    headline: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
    advertiser: {
        fontSize: 13,
        color: '#9a9a9a',
    },
    body: {
        fontSize: 14,
        color: '#d0d0d0',
    },
    media: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        backgroundColor: '#1c1c1c',
    },
    cta: {
        backgroundColor: '#f5f5f5',
        color: '#111',
        textAlign: 'center',
        padding: 10,
        borderRadius: 6,
        fontWeight: 'bold',
    },
});
