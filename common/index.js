import FileViewer from 'react-native-file-viewer';
import Share from "react-native-share";
import  admob, {
  InterstitialAd,
  TestIds,
} from '@react-native-firebase/admob';

const openFile = (file) => {
  FileViewer.open(file , { showOpenWithDialog: true , showAppsSuggestions: true} )
  .then((res) => {
      console.log("success open");
  })
  .catch(error => {
    console.log("error in opening file");
  });
}

const onShare = async (file) => {
  try {
    const result = await Share.open({
      title:"Shared from ImgToPDF Converter",
      message:"Shared from ImgToPDF Converter",
      url:"file://"+file
    });
  } catch (error) {
      console.log(error)
  }
}

const adHomeUnitId =  __DEV__ ? TestIds.BANNER : "ca-app-pub-5432006428172552/2270330804";
const adHistoryUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5432006428172552/9801993002';
const adPDFConversionUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-5432006428172552/1295751362';
const adAddGalleryUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-5432006428172552/7586005152';

const interstitialPDFConversion = InterstitialAd.createForAdRequest(adPDFConversionUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const interstitialAddGallery = InterstitialAd.createForAdRequest(adAddGalleryUnitId, {
  requestNonPersonalizedAdsOnly: true,
});


export {  openFile , onShare , adHomeUnitId , adHistoryUnitId ,interstitialPDFConversion , interstitialAddGallery };
