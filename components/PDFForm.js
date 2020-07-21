import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
  ToastAndroid,
  Linking
} from 'react-native';
import { connect } from 'react-redux'
import Slider from '@react-native-community/slider';
import CheckBox from "@react-native-community/checkbox";
import uuid from "uuid/v4";
import RNImageToPdf from "react-native-image-to-pdf";
import RNFS from "react-native-fs";
import moment from "moment";
import { setImages } from "./../store/actions"
import { openFile , onShare ,interstitialPDFConversion } from "./../common";
import  admob, {
  AdEventType,
} from '@react-native-firebase/admob';
import {
  PacmanIndicator,
} from 'react-native-indicators';

import AsyncStorage from '@react-native-community/async-storage';

const { width , height } = Dimensions.get("window");

class PDFForm extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      value:70,
      isSelected :false,
      text:"Pdf-"+uuid().split("-")[0],
      loading:false,
    }
  }

  componentDidMount = () => {
    interstitialPDFConversion.onAdEvent((type, error, reward) => {
      if (type === AdEventType.LOADED) {
        interstitialPDFConversion.show();
      }
    });
  }

  removeFileFromPath = (path) => {
    var file = path.split("/");
    file.shift()
    file.shift()
    var newPath = file.join("/")
    return newPath;
  }

  getFilePath = () => {
    let path = []
    this.props.images.map((value,index)=>{
        path.push(this.removeFileFromPath(value.path))
    })
    return path;
  }

  handleLoading = () => {
    this.setState({
      loading:true
    })
    setTimeout(
      this.myAsyncPDFFunction,
      2000
    )
  }

  myAsyncPDFFunction = async () => {
    var filename = this.state.text.split(".")[0]+".pdf";
    var path = this.getFilePath();
    var quality = (this.state.value/100);
    try {
        const options = {
            imagePaths: path,
            name:filename,
            maxSize: { // optional maximum image dimension - larger images will be resized
                width: 900,
                height: Math.round(height / width * 900),
            },
            quality: quality, // optional compression paramter
        };
        if(this.state.loading){
          await RNImageToPdf.createPDFbyImages(options).then((response)=>{
            interstitialPDFConversion.load();
            let path = RNFS.ExternalStorageDirectoryPath+"/ImageToPDF/";
            let date = moment();
            RNFS.mkdir(path).then(res => {
              RNFS.moveFile(response.filePath,path+filename).then(res => {
                RNFS.stat(path+filename).then((res)=>{
                  this.props.setImages([]);
                  AsyncStorage.getItem('downloaded',(err,result) => {
                     let prevData = JSON.parse(result);
                     if(result!==null){
                         let newDataEnter = {
                             "id":uuid(),
                             "file":res.path,
                             "date":date,
                             "size":res.size
                         }
                         prevData.push(newDataEnter)
                         AsyncStorage.setItem('downloaded', JSON.stringify(prevData),(err)=>{
                         if(err!==null){
                             console.log(err)
                         }
                         });
                     }
                     else{
                         AsyncStorage.setItem('downloaded', JSON.stringify([{
                             "id":uuid(),
                             "file":res.path,
                             "date":date,
                             "size":res.size
                         }]),(err)=>{
                             if(err!==null){
                                 alert(err)
                             }
                         });
                     }
                   });
                   ToastAndroid.showWithGravity(
                     "Succesfully Converted to PDF !!!",
                     ToastAndroid.LONG,
                     ToastAndroid.BOTTOM
                   );
                   Alert.alert(
                    "File Location :",
                    path+filename,
                    [
                      { text :"share", onPress : () => onShare("file://"+path+filename) },
                      { text :"open", onPress : () => openFile(path+filename) },
                      { text: "OK", onPress: () => {} },
                    ],
                    { cancelable: false }
                  );
                  this.setState({
                    loading:false
                  })
                  this.props.close();
                }).catch((err)=>{
                  this.setState({
                    loading:false
                  })
                  this.props.close();
                  console.log(err);
                })
              }).catch((err)=>{
                this.setState({
                  loading:false
                })
                console.log(err)
              })
            }).catch((err)=>{
              this.setState({
                loading:false
              })
            })
          });
        }
    } catch(e) {
       this.setState({
         loading:false
       })
       console.log(e);
    }
  }
  render(){
    const { value , isSelected , text , loading } = this.state;
    return (
      <View style={{justifyContent:"center",margin:10}}>
        <View style={{elevation:5,alignItems:"center",backgroundColor:"#FDA549",height:80,justifyContent:"center",borderTopLeftRadius:20,borderTopRightRadius:20}}>
          <Text style={{fontWeight:"bold",fontSize:22,color:"white"}}> Convert to PDF </Text>
        </View>
        <View style={{padding:20,backgroundColor:"#ffffff",elevation:5,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
        <View>
          <Text style={{fontWeight:"bold",fontSize:16}}>PDF file name</Text>
            <TextInput
              placeholder="Enter name for the pdf"
              onChangeText={value => this.setState({
                text:value
              })}
              value={text}
              theme={{colors: {text: 'green', primary: 'yellow'}}}
              style={{fontWeight:"bold",color:"red"}}
              />
              <Text style={{marginTop:0,fontWeight:"bold",fontSize:10}}>Note :- Don't use <Text style={{color:"red",fontWeight:"bold"}}>( .pdf )</Text> in file name.</Text>
          </View>
          {
            loading?
            <View style={{backgroundColor: 'rgba(0,0,0,0.5)',alignContent:"center",justifyContent:"center"}}>
              <PacmanIndicator size={80} color="#00ff00" />
            </View>:null
          }
          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
            <Text style={{fontWeight:"bold",fontSize:16}}>Compress PDF </Text>
            <CheckBox
             value={isSelected}
             onValueChange={() => this.setState({
               isSelected:!isSelected
             })}
             />
          </View>
          {
            isSelected?
            <View style={{flexDirection:"column"}}>
              <Text style={{fontWeight:"bold",fontSize:12,marginTop:10,marginBottom:5}}>
                Quality :<Text style={{color:"blue",fontWeight:"bold"}}> {value}% </Text>
              </Text>
              <Slider
                step={1}
                minimumValue={1}
                maximumValue={100}
                value={value}
                onValueChange={value => this.setState({
                  value
                })}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
              />
            </View>
            :
            <View/>
          }
          <View style={{flexDirection:"row",justifyContent:"space-around",marginTop:10}}>
            <Button title="Cancel" onPress={()=>this.props.close()}/>
            <Button title="Convert" onPress={()=>this.handleLoading()} disabled={this.state.loading}/>
          </View>
        </View>
      </View>)
  }
}

const Button = ({title, onPress ,disabled }) => {
    return (
        <TouchableOpacity
            style={styles.btn}
            onPress={onPress}
            activeOpacity={0.6}
            disabled={disabled}
            >
            <Text style={{color: '#fff', fontSize: 16}}>{title}</Text>
        </TouchableOpacity>
    )
};


const mapStateToProps = state => {
  return { images: state.images };
};

function mapDispatchToProps(dispatch) {
  return {
    setImages: images => dispatch(setImages(images)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PDFForm);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#FDA549',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    paddingLeft:20,
    paddingRight:20,
    paddingHorizontal: 12,
    margin: 5,
    borderRadius: 22
  },
})
