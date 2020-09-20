/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { useState ,useEffect } from 'react';
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
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker';
import ListViewItems from "./../components/ListViewItems";
import DraggableFlatList from 'react-native-draggable-flatlist';
import Ionicons from "react-native-vector-icons/Ionicons";
import PDFForm from "./../components/PDFForm";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AlertComponent from "./../components/Alert";
import uuid from "uuid/v4";
import SplashScreen from 'react-native-splash-screen';

const { width , height } = Dimensions.get("window");

function ImgToPDFConverter(props){

  const [ refresh , setRefresh ] = useState(null);
  const [ open , setOpen ] = useState(false);
  const [ alert , setAlert ] = useState(false);
  const [ openPDFMenu , setOpenPDFMenu ] = useState(false);

  useEffect(()=>{
    props.navigation.setOptions({
        headerRight: () => <View style={{flexDirection:"row",alignItems:"center"}}>
        <TouchableOpacity
          onPress={() => ( Linking.openURL("https://rzp.io/l/29ds4G2"))}
          activeOpacity={0.6}
          style={{padding:10}}
          >
          <Image
              style={{width:18,height:18}}
              source={require('./../assets/images/donation.webp')}
          />
        </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('History')}
            activeOpacity={0.6}
            style={{padding:10}}
            >
            <View style={{flexDirection:"row",alignItems:"center"}}>
              <MaterialIcons name="history" size={22} color="grey"/>
            </View>
          </TouchableOpacity>
        </View>,
    });
    SplashScreen.hide();
  },[]);

  const requestPermission = async () => {
      try {
          const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,//android.permission.MANAGE_DOCUMENTS
              {
                  title: "Need Permission",
                  message:'Read and Write Permisssion',
                  buttonNeutral: 'Ask Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
              },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('access');
          } else {
              console.log('Denied');
          }
      } catch (err) {
          console.warn(err);
      }
  };

  const handleOpenImagePicker = () => {
    ImagePicker.openPicker({
      mediaType:"photo",
      multiple: true,
    }).then(data => {
      props.setImages(data)
      props.navigation.navigate('ImagePlate')
    }).catch((err) => {
      ToastAndroid.showWithGravity(
        err.toString(),
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
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
      <View style={{flexGrow:1,flexDirection:"column",justifyContent:"center",alignItems:"center",padding:5}}>
          <Button title={'Open Images From Gallery'} onPress={()=>handleOpenImagePicker()} iconStyle={{name:"images",color:"white",size:20}}/>
          <Button title={'Open Camera'} onPress={()=>handleOpenCamera()} iconStyle={{name:"camera",color:"white",size:22}}/>
      </View>
      <View style={{flexDirection:"column"}}>
        <View style={{flexGrow:1,flexDirection:"row",justifyContent:"center"}}>
          <TouchableOpacity onPress={()=>{ Linking.openURL("https://www.instagram.com/technorsh/")}} style={{paddingRight:10}}>
            <Image
                style={{width:22 ,height:22}}
                source={require('./../assets/images/instagram.webp')}
            />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{ Linking.openURL("https://www.facebook.com/rahulsharma9176236")}} style={{paddingLeft:10}}>
              <Image
                  style={{width:22,height:22}}
                  source={require('./../assets/images/facebook.webp')}
              />
            </TouchableOpacity>
        </View>
        <View style={{alignItems:"center",padding:5}}>
            <Image
                style={{width:180,height:50}}
                source={require('./../assets/images/madeinindia.webp')}
            />
        </View>
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
)(ImgToPDFConverter);

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
