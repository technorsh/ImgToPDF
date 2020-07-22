import React from 'react';
import Home from "./screens/Home";
import History from "./screens/History";
import store from "./store"
import { Provider , connect } from 'react-redux'
import { enableScreens } from "react-native-screens";
import { StatusBar ,View, Text, TouchableOpacity } from "react-native";
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
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={Home} options={{
                title: '',
                headerLeft: () => <View style={{flexDirection:"row",marginLeft:10,alignItems:"center"}}>
                  <MaterialIcons name="picture-as-pdf" size={20} color={"grey"}/>
                  <Text style={{fontWeight:"bold",fontSize:18,color:"grey"}}> Image to PDF Converter</Text>
                </View>,
              }}/>
              <Stack.Screen name="History" component={History} options={{ title: 'History' }}/>
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </>
  )
}
