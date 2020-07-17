import React ,{useState,useEffect} from "react";
import {Linking ,ToastAndroid,Alert ,StyleSheet, View ,TouchableOpacity , Text, ScrollView } from "react-native"
import AsyncStorage from "@react-native-community/async-storage"
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from "moment";
import Share from "react-native-share";
import RNFS from "react-native-fs"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  DotIndicator,
} from 'react-native-indicators';

import AlertComponent from "./../components/Alert";
import { openFile } from "./../common";

const HistoryListItem = (props) => {

  const [ size , setSize ] = useState(0);
  const [ exist ,setExist ] = useState(true);

  const {id , file , filename , mtime ,index ,deleteInfo } = props;

  useEffect(()=>{
    setInfo(file);
  },[])

  const onShare = async (file) => {
    try {
      const result = await Share.open({
        title:"Shared from ImgToPDF Converter",
        message:"Shared from ImgToPDF Converter",
        url:file
      });
    } catch (error) {
        console.log(error)
    }
  }

  const setInfo = async (file) => {
    await RNFS.exists(file).then((res)=>{
      setExist(res);
      if(res){
       RNFS.stat(file).then((res)=>{
          setSize(((res.size)/(1024*1024)).toFixed(2))
        }).catch((err)=>{
          console.log(err)
        })
      }else{
         let fileData = file.split("/");
         let filename = "/"+fileData[4]+"/"+fileData[5];
         ToastAndroid.showWithGravity(
             filename +  " doesn't Exist !!",
             ToastAndroid.SHORT,
             ToastAndroid.BOTTOM,
         );
         deleteInfo("id",id);
      }
    }).catch((err)=>{
      console.log(err)
    })
  }

  return(
    <>
    {
      exist?
          <TouchableOpacity
            activeOpacity={0.6}
            key={index}
            underlayColor='grey'
            onPress={()=>openFile(file)}
            style = {{
                backgroundColor:"#ffcccc",
                borderRadius:15,
                borderBottomLeftRadius:0,
                borderTopRightRadius:0,
                padding:10,
                marginBottom:10,
                elevation:2,
            }}
            >
            <View style={{flexDirection:"row",alignItems:"center"}}>
              <MaterialCommunityIcons name="file-pdf" size={40} color="red" />
              <View style={{flexGrow:1,flexDirection:"row",justifyContent:"space-between"}}>
                <View style={{flexDirection:"column",justifyContent:"space-around",alignItems:"center"}}>
                  <View style={{flexDirection:"row",alignItems:"center"}}>
                    <View style={{flexGrow:1,width:0}}>
                      <Text ellipsizeMode='tail' numberOfLines={1} style={{flexWrap:"wrap",paddingLeft:5,fontSize:14,fontWeight:"bold"}}>{filename} </Text>
                    </View>
                  </View>
                  <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <Text style={{paddingLeft:5,paddingBottom:5,fontSize:12,fontWeight:"bold"}}>
                        {mtime}
                    </Text>
                    <Text style={{paddingLeft:5,paddingBottom:5,paddingLeft:20,fontSize:12,fontWeight:"bold"}}>
                        {size} MB
                    </Text>
                  </View>
                </View>
                <View style={{justifyContent:"space-between",flexDirection:"column"}}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => onShare(file) }
                    style={{borderRadius:5,paddingRight:8,paddingLeft:8,padding:5}}
                    >
                    <Ionicons name="md-share-social" size={18} color="grey" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => deleteInfo("id",id) }
                    style={{borderRadius:5,paddingRight:8,paddingLeft:8,padding:5}}
                    >
                    <Ionicons name="md-trash" size={18} color="grey" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
        </TouchableOpacity>:<View/>
      }
    </>
  )
}

export default function History(props){

  const [ data , setData ] = useState(null)
  const [ alert , setAlert ] =  useState(false);

  useEffect(()=>{
    const unsubscribe = props.navigation.addListener('focus', () => {
      getInfo();
     });
     return unsubscribe;
  },[])

  const getInfo = async () => {
    await AsyncStorage.getItem('downloaded', (err, result) => {
      if(result!==null){
        let asyncStorageData = JSON.parse(result).reverse();
        setData(asyncStorageData);
      }
      else{
        setData([])
      }
    });
  }

  const clearDownloads = async () => {
    await AsyncStorage.removeItem("downloaded").then((res)=>{
      setData([]);
    }).catch((err)=>{
      console.log(err);
    })
  }

  const alertFunc = () => {
    if(!( Array.isArray(data) && data.length )){
      ToastAndroid.showWithGravity(
        "No History Available !!!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
    }else{
      setAlert(true);
    }
  }

  const alertHandle = () => {
    setAlert(false);
    clearDownloads();
  }

  const deleteData = (attr, value) => {
     try {
         let newData = []
         newData = removeByAttr(data,attr,value).reverse();
         AsyncStorage.setItem('downloaded', JSON.stringify(newData), (err) => {
           if(err!==null){
               console.log(err)
           }
         });
         ToastAndroid.showWithGravity(
           "Deleted Successfully !!",
           ToastAndroid.SHORT,
           ToastAndroid.BOTTOM,
         );
         getInfo();
     } catch (error) {
         console.log(error)
         ToastAndroid.showWithGravity(
           "Error in Removing File",
           ToastAndroid.SHORT,
           ToastAndroid.BOTTOM,
         );
     }
  }

  const removeByAttr = (arr, attr, value) => {
     var newArr = arr.filter(function( obj ) {
         return obj[attr] !== value;
       });
     return newArr;
  }

  let info = (Array.isArray(data)) ? data.map((data,index)=>{
    let file = data.file;
    let filename = data.file.split("/")[data.file.split("/").length - 1]
    let mtime = moment(data.date).format("LLLL");
    return <HistoryListItem key={"index-"+index} id={data.id} index={index} file={file} filename={filename} mtime={mtime} deleteInfo={deleteData}/>
  }):null

  return(
    <View style={{flexGrow:1,margin:10,marginTop:5}}>
      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingBottom:5}}>
        <View style={{alignContent:"center",alignItems:"flex-start"}}>
          <Text style={{fontWeight:"bold",color:"#075E54",fontSize:14}}>PDF Files Location :</Text>
          <Text style={{fontSize:12}}>/Internal Storage/ImgToPDF/</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{flexDirection:"row",backgroundColor:"grey",alignItems:"center",borderRadius:5,padding:5}}
            onPress={() => alertFunc() }>
            <View style={{paddingLeft:5}}>
              <Ionicons name="md-trash" size={20} color="white" />
            </View>
          <Text style={{padding:5 , fontWeight:"bold", fontSize:12, color:"white",}}>Clear History</Text>
          <AlertComponent
            visible={alert}
            title = "Do You Want to Clear History ?"
            message = {"It will clear all the history (ᵔᴥᵔ) from here."}
            icon = {{
              "iconName":"md-trash",
              "iconColor":"gray",
              "iconSize":20
            }}
            okText={"Yes"}
            cancelText={"No"}
            onPressOK={()=>{alertHandle()}}
            onPressCancel={()=>{setAlert(false)}}
          />
        </TouchableOpacity>
      </View>
      {
        (Array.isArray(data))?
        ((data.length)?
          <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:"transparent",marginBottom:30,}}>
            <View>
              {info}
            </View>
          </ScrollView>
          :
          <View style={{flexGrow:1,justifyContent:"center",alignItems:"center",marginTop:20}}>
            <Text style={{fontWeight:"bold",color:"gray"}}>No History Available</Text>
            <Text style={{fontWeight:"bold",color:"gray"}}>(｡◕‿◕｡)</Text>
          </View>):
          <View style={{alignItems:"center",marginTop:20}}>
            <DotIndicator color="red" size={8}/>
          </View>
      }
    </View>
  )
}
