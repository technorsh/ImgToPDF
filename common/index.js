import FileViewer from 'react-native-file-viewer';
import Share from "react-native-share";

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

export {  openFile , onShare  };
