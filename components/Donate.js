import React ,{ Component } from "react";
import {Linking,TouchableHighlight, TouchableOpacity,Text,View , Image ,StyleSheet } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Donate extends Component{
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.Text}>
                    <Text style={styles.Text1Decoration}>
                        Thank you ! For Your Support
                    </Text>
                    <Text style={styles.Text2Decoration}>
                        Choose Below Options :
                    </Text>
                </View>
                <View style={styles.Image}>
                    <TouchableOpacity
                        onPress={() => ( Linking.openURL("https://paytm.me/Bk-GQsR"))}
                        activeOpacity={0.5}>
                    <Image
                        style={{width:75,height:25}}
                        source={require('./../assets/images/paytm.png')}
                    />
                    </TouchableOpacity>
                </View>
                <View style={styles.Image}>
                    <TouchableOpacity
                        onPress={() => ( Linking.openURL("https://www.paypal.me/Rahul1999"))}
                        activeOpacity={0.5}>
                    <Image
                        style={{width:35,height:35}}
                        source={require('./../assets/images/paypal.png')}
                    />
                    </TouchableOpacity>
                </View>
                <View style={styles.Lastcontainer}>
                    <View style={{flexDirection:"row",alignItems:"center",alignContent:"center"}}>
                        <Text style={{fontWeight:"bold"}}>
                            Made with
                        </Text>
                        <Text style={{paddingLeft:5,color:"red"}}>
                             ❤
                        </Text>
                    </View>
                    <View style={{alignItems:"center",flexDirection:"column"}}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={{paddingTop:7,fontWeight:"bold",color:"#008B8B"}}>
                                Thanks
                            </Text>
                            <TouchableOpacity
                                onPress={() => ( Linking.openURL("https://www.instagram.com/technorsh/"))}
                                style={styles.hStyle}
                                activeOpacity={0.5}>
                                <Text style={{paddingTop:2,color:"red",fontWeight:"bold"}}>
                                    #technorsh ( @Rahul Sharma )
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{paddingTop:5,color:"black",fontWeight:"bold"}}>
                           ( THE TECHNO )
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection:"column",
        margin:20,
        backgroundColor:"#F8F8FF",
        borderRadius:10,
        padding:10
    },
    Lastcontainer:{
        backgroundColor:"#F8F8FF",
        borderRadius:10,
        alignItems:"center",
        padding:10
    },
    Text:{
        alignItems:"center",
        padding:10
    },
    Text1Decoration:{
        color:"#000000",
        fontWeight:"bold",
        fontSize:20,
    },
    Text2Decoration:{
        marginTop:10,
        color:"#000000",
        fontWeight:"bold",
        fontSize:15,
    },
    Image:{
        padding:10,
        alignItems:"center"
    },
    hStyle:{
        padding:5
    }
})
