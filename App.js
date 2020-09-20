import React from 'react';
import ImgToPDFConverter from "./screens/ImgToPDFConverter";
import History from "./screens/History";
import ImagePlate from "./screens/ImagePlate";
import store from "./store"
import { Provider , connect } from 'react-redux'
import { enableScreens } from "react-native-screens";
import { StatusBar ,View, Text, TouchableOpacity , Image } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaProvider } from "react-native-safe-area-context";

enableScreens();

const Stack = createStackNavigator();

export default function App(){
  return(
    <>
    <StatusBar backgroundColor="white" animated={true} showHideTransition="fade" barStyle="dark-content"/>
      <Provider store={store}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="ImgToPDFConverter">
              <Stack.Screen name="ImgToPDFConverter" component={ImgToPDFConverter} options={{
                title: '',
                headerLeft: () => <View style={{flexDirection:"row",marginLeft:10,alignItems:"center"}}>
                  <Image
                      style={{width:24,height:24}}
                      source={require('./assets/images/logo.webp')}
                  />
                  <Text style={{fontWeight:"bold",fontSize:18,color:"grey"}}> Image to PDF Converter</Text>
                </View>,
              }}/>
              <Stack.Screen  name="ImagePlate" component={ImagePlate}
                options={{
                  title: '',
                  headerLeft : () => <View style={{flexDirection:"row",marginLeft:15,alignItems:"center"}}>
                    <Image
                        style={{width:24,height:24}}
                        source={require('./assets/images/register.webp')}
                    />
                    <Text style={{fontWeight:"bold",fontSize:18,color:"grey",paddingLeft:5}}> Edit Selected Pages</Text>
                  </View>,
                }}/>
              <Stack.Screen name="History" component={History} options={{ title: '', headerLeft : () => <View style={{flexDirection:"row",marginLeft:15,alignItems:"center"}}>
                <Image
                    style={{width:24,height:24}}
                    source={require('./assets/images/history.webp')}
                />
                <Text style={{fontWeight:"bold",fontSize:18,color:"grey",paddingLeft:5}}> History</Text>
              </View>, }}/>
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </>
  )
}
