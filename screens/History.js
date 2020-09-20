import React ,{useState,useEffect} from "react";
import {Modal,Linking ,BackHandler,ToastAndroid,Alert ,StyleSheet, View , TextInput,TouchableOpacity , Text, ScrollView } from "react-native"
import AsyncStorage from "@react-native-community/async-storage"
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from "moment";
import RNFS from "react-native-fs"
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  DotIndicator,
} from 'react-native-indicators';
import uuid from "uuid/v4";
import AlertComponent from "./../components/Alert";
import { openFile , onShare } from "./../common";

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

const HistoryListItem = (props) => {

  const [ exist , setExist ] = useState(true);
  const [ name , setName ] = useState(false);
  const [ openRename , setOpenRename ] = useState(false);
  const [ newName , setNewName ] = useState("");
  const [ loaded , setLoaded ] = useState(false)

  const {id , file , size , filename , info , mtime ,index ,navigation, deleteInfo } = props;

  useEffect(()=>{
    setInfo(file);
  },[])

  const setInfo = async (file) => {
    await RNFS.exists(file).then((res)=>{
      setExist(res);
      if(!res){
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

  const handleRenameFile = () => {
    setOpenRename(true);
  }

  const onSubmitRename = () => {
    setLoaded(true);
    renameFile(file,id)
  }

  const checkName = async (value) => {
    setNewName(value)
    let newpath = RNFS.ExternalStorageDirectoryPath+"/ImageToPDF/"+value+".pdf";
    let exist = await RNFS.exists(newpath);
    setName(exist)
  }

  const renameFile = async ( file , id ) => {
    let names = newName.split(".")[0];
    let newpath = RNFS.ExternalStorageDirectoryPath+"/ImageToPDF/"+names+".pdf";
    if(!name){
      RNFS.moveFile(file,newpath).then((res)=>{
        deleteInfo("id",id);
        RNFS.stat(newpath).then((res)=>{
          AsyncStorage.getItem('downloaded',(err,result) => {
             let prevData = JSON.parse(result);
             if(result!==null){
                 let newDataEnter = {
                     "id":uuid(),
                     "file":res.path,
                     "date":moment(),
                     "size":res.size,
                 }
                 prevData.push(newDataEnter)
                 AsyncStorage.setItem('downloaded', JSON.stringify(prevData),(err)=>{
                   if(err!==null){
                       console.log(err)
                   }
                 });
             }else{
                 AsyncStorage.setItem('downloaded', JSON.stringify([{
                     "id":uuid(),
                     "file":res.path,
                     "date":date,
                     "size":res.size,
                 }]),(err)=>{
                     if(err!==null){
                         alert(err)
                     }
                 });
             }
             info();
           })
           setName(false);
           setNewName("");
           setLoaded(false);
           setOpenRename(false);
           console.log("renamed");
         })
      })
    }else{
      Alert.alert(
       "PDF File Name Already Exist !!",
       "Choose Another PDF File Name : - )",
       [
         { text: "OK", onPress: () => {} },
       ],
       { cancelable: false }
     );
     setLoaded(false);
    }
  }


  return(
    <>
    {
      exist?
          <TouchableOpacity
            key={index}
            underlayColor='grey'
            onPress={()=>openFile(file)}
            onLongPress={()=>handleRenameFile()}
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
              <View>
                <Icon name="file-pdf-o" size={30} color="red" style={{padding:5}}/>
              </View>
              <View style={{flexGrow:1,flexDirection:"row",justifyContent:"space-between",}}>
                <View style={{flexDirection:"column",justifyContent:"space-around",alignItems:"center"}}>
                  <View style={{flexDirection:"row",alignItems:"center"}}>
                    <View style={{flexGrow:1, width:0}}>
                      <Text ellipsizeMode='tail' numberOfLines={1} style={{flexWrap:"wrap",paddingLeft:5,fontSize:14,fontWeight:"bold"}}>{filename}</Text>
                    </View>
                    <TouchableOpacity
                      underlayColor='gray'
                      onPress={()=>handleRenameFile()}
                      style = {{
                          padding:5,
                      }}
                      >
                      <Icon name="edit" size={16} color="grey"/>
                    </TouchableOpacity>
                  </View>
                  <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <View style={{flexGrow:1,}}>
                      <Text style={{paddingLeft:5,paddingBottom:5,fontSize:12,fontWeight:"bold"}}>
                          {mtime}
                      </Text>
                    </View>
                    <View>
                      <Text style={{paddingLeft:5,paddingBottom:5,marginLeft:10,color:"black",fontSize:12,fontWeight:"bold"}}>
                          {((size)/(1024*1024)).toFixed(2)} MB
                      </Text>
                    </View>
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
            <Modal
              animationType="fade"
              visible={openRename}
              transparent={true}
              onRequestClose={()=>setOpenRename(false)}
              >
              <View style={{flexGrow: 1,justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <View style={{justifyContent:"center",margin:10}}>
                  <View style={{elevation:5,alignItems:"center",backgroundColor:"#FDA549",height:80,justifyContent:"center",borderTopLeftRadius:20,borderTopRightRadius:20}}>
                    <Text style={{fontWeight:"bold",fontSize:22,color:"white"}}> Rename PDF File </Text>
                  </View>
                  <View style={{padding:20,backgroundColor:"#ffffff",elevation:5,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                  <View>
                    <View style={{alignItems:"center",paddingBottom:10}}>
                      {
                        name?<Text style={{fontWeight:"bold",fontSize:12,color:"red"}}>Name Already Exist !!</Text>:null
                      }
                    </View>
                    <Text style={{fontWeight:"bold",fontSize:16}}>New PDF file name</Text>
                      <TextInput
                        placeholder="Enter name for the pdf"
                        onChangeText={value => checkName(value)}
                        value={newName}
                        theme={{colors: {text: 'green', primary: 'yellow'}}}
                        style={{fontWeight:"bold",color:"red"}}
                        />
                        <Text style={{marginTop:0,fontWeight:"bold",fontSize:10}}>Note :- Don't use <Text style={{color:"red",fontWeight:"bold"}}>( .pdf )</Text> in file name.</Text>
                    </View>
                    <View style={{flexGrow:1,alignItems:"center",justifyContent:"center"}}>
                    {
                      loaded?<DotIndicator color="#FDA549" size={10}/>:<View/>
                    }
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"space-around",marginTop:10}}>
                      <Button title="Cancel" onPress={()=>setOpenRename(false)} />
                      <Button title="Rename" onPress={()=>onSubmitRename()} />
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
        </TouchableOpacity>:<View/>
      }
    </>
  )
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
      // console.log(result)
      // RNPdfToImage.convert("file://"+testPDF).then((res)=>{
      //   console.log(res)
      // });
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
    let mtime = moment(data.date).format("MMMM DD, YYYY HH:MM:SS A");
    let size = data.size
    return <HistoryListItem size={size} navigation={props.navigation} info={getInfo} key={"index-"+index} id={data.id} index={index} file={file} filename={filename} mtime={mtime} deleteInfo={deleteData}/>
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
            style={{flexDirection:"row",backgroundColor:"#FDA549",alignItems:"center",borderRadius:5,padding:5}}
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
            <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:"transparent",marginBottom:30,marginTop:2}}>
              <View>
                {info}
              </View>
            </ScrollView>:
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
