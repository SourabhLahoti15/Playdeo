import { useEffect, useRef } from 'react';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

const INTERSTITIAL_ID = __DEV__
  ? 'ca-app-pub-3940256099942544/1033173712' // test
  : 'your-real-id';

export default function useInterstitialAd() {
  const interstitialRef = useRef(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    interstitialRef.current = interstitial;

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        isLoaded.current = true;
      }
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.log('Ad error:', error);
      }
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeError();
    };
  }, []);

  const showAd = () => {
    if (isLoaded.current && interstitialRef.current) {
      interstitialRef.current.show();
      isLoaded.current = false;
      interstitialRef.current.load(); 
    }
  };

  return { showAd };
}