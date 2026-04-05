import React from 'react';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const AdBanner = () => {
  const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
  const REAL_BANNER_ID = 'ca-app-pub-9847554906000937/2573741373';

  const adUnitId = __DEV__ ? TEST_BANNER_ID : REAL_BANNER_ID;
  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
};

export default AdBanner;