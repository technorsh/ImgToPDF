import React ,{useState,useEffect} from "react";
import {
    StyleSheet,
    Text,
    View,
    Linking,
    Image,
    ScrollView,
    TouchableOpacity,
    PermissionsAndroid,
    Dimensions,
    Modal,
    Alert,
    BackHandler,
    ToastAndroid
} from 'react-native';
import { setImages , addImages } from "./../store/actions"
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import ListViewItems from "./../components/ListViewItems";
import DraggableFlatList from 'react-native-draggable-flatlist';
import Ionicons from "react-native-vector-icons/Ionicons";
import PDFForm from "./../components/PDFForm";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AlertComponent from "./../components/Alert";
import uuid from "uuid/v4";

function ImagePlate(props){

  const [ refresh , setRefresh ] = useState(null);
  const [ open , setOpen ] = useState(false);
  const [ alert , setAlert ] = useState(false);
  const [ openPDFMenu , setOpenPDFMenu ] = useState(false);

  useEffect(()=>{
    const backHandler = BackHandler.addEventListener('hardwareBackPress',()=>{
      setAlert(true);
      return true;
    })
    return () => backHandler.remove();
  },[])

  const alertHandle = () => {
    props.setImages([]);
    setAlert(false);
  }

  const openPopUp = () => {
    if(( Array.isArray(props.images) && props.images.length ) ){
      setOpenPDFMenu(true)
    }
    else{
      ToastAndroid.showWithGravity(
        "Please Select Images First !!!",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  }

  const handleAddOpenImagePicker = () => {
    setOpen(false);
    ImagePicker.openPicker({
      mediaType:"photo",
      multiple: true,
    }).then(data => {
      props.addImages(data)
    }).catch((err) => {
      console.log(err)
    });
  };

  const handleOpenCamera = () => {
    setOpen(false);
    ImagePicker.openCamera({
      cropping: true,
      freeStyleCropEnabled:true
    }).then(image => {
      props.addImages(image)
      props.navigation.navigate('ImagePlate')
    }).catch((err)=>{
      console.log(err)
    });
  };

  return(
    <View style={{flexGrow:1}}>
      <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <View
          style={{flexDirection:"row",alignItems:"center",paddingLeft:5}}
          >
          <AlertComponent
            visible={alert}
            title = "Do You Want to Clear Screen ?"
            message = {"It will clear all the images (ᵔᴥᵔ) "}
            icon = {{
              "iconName":"ios-trash-bin",
              "iconColor":"gray",
              "iconSize":20
            }}
            okText={"Yes"}
            cancelText={"No"}
            onPressOK={()=>{alertHandle()}}
            onPressCancel={()=>{setAlert(false)}}
          />
          <View style={{marginLeft:2,flexDirection:"row",alignItems:"center",paddingLeft:5}}>
            <Text style={{color:"brown",fontWeight:"bold",fontSize:13}}>TOTAL PAGES : {props.images.length} </Text>
          </View>
        </View>
        <TouchableOpacity
            style={{
              margin:5,
              backgroundColor: '#FDA549',
              flexDirection:"row",
              borderRadius:22 ,
              height:30,
              padding:10,
              paddingRight:14,
              justifyContent:"center",
              alignItems:"center",
            }}
            activeOpacity={0.6}
            onPress={()=>setOpen(true)}
            >
          <Ionicons name="md-add" size={20} color="#ffffff"/>
          <Text style={{fontWeight:"bold",color:"#ffffff"}}> ADD </Text>
        </TouchableOpacity>
        <Modal
          animationType="fade"
          visible={open}
          transparent={true}
          onRequestClose={()=>setOpen(false)}
          >
          <View style={{flexGrow: 1,justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <View style={{
                flexDirection:"row",
                justifyContent:"space-between",
                margin:10,
                paddingLeft:20,
                marginBottom:0,
                backgroundColor:"#48D1CC",
                padding:10,
                height:80,
                borderRadius:20,
                borderBottomLeftRadius:0,
                borderBottomRightRadius:0,
                alignItems:"center"
              }}>
              <View style={{}}>
                <Text style={{fontSize:22,fontWeight:"bold",color:"#ffffff"}}> Add More Images </Text>
              </View>
              <TouchableOpacity
                  style={{
                    backgroundColor: '#FDA549',
                    flexDirection:"row",
                    borderWidth:2,
                    borderColor:"#E0FFFF",
                    marginRight:15,
                    borderRadius:20,
                    padding:5,
                    justifyContent:"center",
                    alignItems:"center",
                  }}
                  onPress={()=>setOpen(false)}
                  activeOpacity={0.6}
                  >
                <View>
                  <Ionicons name="md-close" size={24} color="#E0FFFF"/>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{marginTop:0,height:200,paddingTop:10,margin:10,backgroundColor:"#FDF5E6",paddingBottom:10,borderBottomLeftRadius:25,borderBottomRightRadius:25}}>
              <View style={{flexGrow:1,justifyContent:"center",alignItems:"center",padding:5}}>
                  <Button title={'Open Images From Gallery'} onPress={()=>handleAddOpenImagePicker()} iconStyle={{name:"images",color:"white",size:20}}/>
                  <Button title={'Open Camera'} onPress={()=>handleOpenCamera()} iconStyle={{name:"camera",color:"white",size:22}}/>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {
        (Array.isArray(props.images) && props.images.length)?
          <DraggableFlatList
            data={props.images}
            extraItem={refresh}
            renderItem={
              ({ item, index, drag, isActive }) => {
                return (
                  <ListViewItems
                    item={item}
                    drag={drag}
                    index={index}
                    isActive={isActive}
                    refreshed={()=>setRefresh(uuid())}/>
                )
              }
            }
            keyExtractor={(item, index) => `draggable-item-${index}`}
            onDragEnd={({ data }) => props.setImages(data)}
          />
        :<View style={{flexGrow:1}} onLayout={()=>props.navigation.navigate('ImgToPDFConverter')}/>
      }
      <View style={{justifyContent:"center",}}>
        <Button title={"Convert to PDF"} onPress={()=>openPopUp()} iconStyle={{}}/>
        <Modal
          animationType="fade"
          visible={openPDFMenu}
          transparent={true}
          onRequestClose={()=>setOpenPDFMenu(false)}
          >
          <View style={{flexGrow: 1,justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <PDFForm close={()=>setOpenPDFMenu(false)}/>
          </View>
        </Modal>
      </View>
    </View>
  )
}
const Button = ({title, onPress ,iconStyle}) => {
    return (
        <TouchableOpacity
            style={styles.btn}
            onPress={onPress}
            activeOpacity={0.6}
            >
            <View style={{flexDirection:"row",alignItems:"center"}}>
              <Ionicons name={iconStyle.name} color={iconStyle.color} size={iconStyle.size}/>
              <Text style={{color: '#fff', fontSize: 16 , fontWeight:"bold"}}>  {title}</Text>
            </View>
        </TouchableOpacity>
    )
};

function mapDispatchToProps(dispatch) {
  return {
    setImages: images => dispatch(setImages(images)),
    addImages: images => dispatch(addImages(images)),
  };
}

const mapStateToProps = state => {
  return { images: state.images };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagePlate);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        paddingTop: 40
    },
    btn: {
        backgroundColor: '#FDA549',
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        paddingLeft:20,
        paddingRight:20,
        paddingHorizontal: 12,
        margin: 5,
        borderRadius: 22,
    },
});
