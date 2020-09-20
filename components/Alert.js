import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function AlertComponent(props){
  return(
    <Modal
      animationType="fade"
      visible={props.visible}
      transparent={true}
      onRequestClose={()=>props.onPressCancel()}
      >
      <View style={{flexGrow: 1,justifyContent: 'center',alignItems:"center", backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <View
        style = {styles.container}>
        <View style={{flexDirection:"column",padding:10}}>
          <View style={{flexDirection:"column"}}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
            <Ionicons style={{padding:10}} name={props.icon.iconName} color={props.icon.iconColor} size={props.icon.iconSize}/>
            <Text style={{fontSize:16,color:"gray",fontWeight:"bold"}}>{props.title}</Text>
            </View>
            <View style={{paddingLeft:20,padding:10,paddingTop:5}}>
              <Text style={{color:"red",fontWeight:"bold",fontSize:14}}>{props.message}</Text>
            </View>
          </View>
          <View style={{flexDirection:"row",justifyContent:"space-around",paddingBottom:5}}>
            <Button title={props.cancelText} onPress={()=>props.onPressCancel()}/>
            <Button title={props.okText} onPress={()=>props.onPressOK()}/>
          </View>
        </View>
      </View>
    </View>
  </Modal>
  )
}


const Button = ({title, onPress}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.6}
            style={styles.btn}
            onPress={onPress}
            >
            <Text style={{color: '#fff', fontSize: 16 , fontWeight:"bold"}}>{title}</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        margin:10,
        paddingTop:5,
        paddingLeft:2,
        width:320,
        backgroundColor: '#F5FCFF',
        borderRadius:20,
    },
    btn: {
        backgroundColor: '#FDA549',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        paddingLeft:20,
        paddingRight:20,
        paddingHorizontal: 15,
        margin: 5,
        borderRadius: 22,
    },
});
