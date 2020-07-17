import React from "react";

import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Button,
    PermissionsAndroid,
    Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { cropImages ,removeImages } from "./../store/actions"
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import  moment  from "moment";

const styles = StyleSheet.create({
    image: {
        margin: 6,
        width: 75,
        height: 75,
        backgroundColor: '#101010',
    },
});

function ListViewItems(props){

  const [ open , setOpen ] = React.useState(false);
  const [ paths , setPaths ] = React.useState([]);

  const { item , drag , isActive , index ,path } = props;

  const date = item.modificationDate/1000;
  const filename = item.path.split("/")[item.path.split("/").length -1 ];

  const editImage = () => {
    ImagePicker.openCropper({
      path: item.path,
      enableRotationGesture:true,
      freeStyleCropEnabled:true,
    }).then(image => {
      props.cropImages(index,image)
    }).catch(err => {
      console.log(err)
    });
  }

  const removeImage = () => {
    props.removeImages(index)
    props.refreshed();
  }

  const openImageViewer = () => {
    setPaths(getFilePath())
    setOpen(true)
  }

  const getFilePath = () => {
    let path = []
    props.images.map((value,index)=>{
        path.push({"url":value.path})
    })
    return path;
  }

  return(
    <View style={{margin:5}}>
      <TouchableOpacity
        activeOpacity={0.6}
          style={{
            elevation:5,
            borderRadius:5,
            paddingTop:5,
            paddingBottom:5,
            paddingLeft:2,
            backgroundColor: isActive ? "#E0FFFF" : "#FFFFF0",
          }}
          onLongPress={drag}
        >
        <View style={{flexDirection:"row"}}>
          <TouchableOpacity onPress={()=>openImageViewer()} activeOpacity={0.6}>
            <Image
                key={`image-${index}`}
                style={styles.image}
                source={{uri:item.path}}
                resizeMode={"contain"}
            />
          </TouchableOpacity>
          <View style={{flexGrow:1,flexDirection:"row",justifyContent:"space-between"}}>
            <View style={{flexGrow:1,flexDirection:"column",justifyContent:"space-between",padding:5}}>
              <View style={{flexGrow:1,flexDirection:"column",justifyContent:"space-around"}}>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Icon name="file-photo-o" size={11} color="violet" />
                    <View style={{flexGrow:1,width:0}}>
                      <Text ellipsizeMode='tail' numberOfLines={1} style={{fontWeight:"bold",flexWrap:"wrap",color:"gray"}}> {filename}</Text>
                    </View>
                </View>
                <View style={{marginTop:2,flexDirection:"row",justifyContent:"space-around"}}>
                  <Text style={{fontWeight:"bold",fontSize:12,color:"white",padding:2,borderRadius:5,borderTopLeftRadius:0,borderBottomRightRadius:0,backgroundColor:"gray"}}> {((item.size)/(1024*1024)).toFixed(2)} MB </Text>
                  <Text style={{fontWeight:"bold",fontSize:12,color:"white",backgroundColor:"orange",borderRadius:5,padding:2,paddingRight:5,borderTopRightRadius:0,borderBottomLeftRadius:0,}}> {item.width} x {item.height}</Text>
                </View>
              </View>
              <View style={{
                alignItems:"flex-end",
                backgroundColor:"skyblue",
                paddingLeft:10,
                paddingRight:15,
                borderTopLeftRadius:10,
                borderBottomLeftRadius:0,
                borderTopRightRadius:5,
                borderBottomRightRadius:2,
                padding:3,
                marginRight:15
                }}>
                  <Text style={{color:"white",fontWeight:"bold"}}>Page { index + 1 }</Text>
              </View>
            </View>
            <View style={{flexDirection:"column",justifyContent:"space-around",alignItems:"center"}}>
              <TouchableOpacity style={{paddingRight:15}} onPress={()=>editImage()}>
                  <Icon name="edit" size={22} color="#900" />
              </TouchableOpacity>
              <TouchableOpacity style={{paddingRight:15}} onPress={()=>removeImage()}>
                  <Icon name="trash" size={22} color="#900" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={open}
        transparent={true}
        onRequestClose={()=>setOpen(false)}
        >
        <ImageViewer
          index={index}
          imageUrls={paths}
          />
      </Modal>
    </View>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    cropImages: ( index , images ) => dispatch(cropImages( index , images )),
    removeImages: ( index ) => dispatch(removeImages( index )),
  };
}
const mapStateToProps = state => {
  return { images: state.images };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListViewItems);
