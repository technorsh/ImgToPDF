import FileViewer from 'react-native-file-viewer';

const openFile = (file) => {
  FileViewer.open(file , { showOpenWithDialog: true , showAppsSuggestions: true} )
  .then((res) => {
      console.log("success open");
  })
  .catch(error => {
    console.log("error in opening file");
  });
}

export { openFile };
