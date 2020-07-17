import React  from "react";
import { Alert,  BackHandler , TouchableHighlight, View ,Modal ,StyleSheet, Text,TouchableOpacity } from "react-native";
import Menu, { MenuItem } from 'react-native-material-menu';
import Donate from "./Donate"
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AlertComponent from "./../components/Alert";

export default class HomeMenu extends React.Component{
  _menu = null;
  constructor(props){
    super(props);
    this.state = {
      visible:false,
      visibleDonate:false,
      alert:false
    }
  }

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  showDonate(){
    this.setState({visibleDonate:!this.state.visibleDonate})
    this.hideMenu();
  }

  alertHandle = () => {
    console.log("clicked exit")
    this.hideMenu();
    BackHandler.exitApp()
  }

  render(){
    return(
      <View>
        <Menu
          ref={this.setMenuRef}
          style={styles.menuPaper}
          button={
            <TouchableOpacity style={{paddingLeft:15,paddingRight:10,marginRight:2}} onPress={() => this.showMenu()}>
              <MaterialIcons name="more-vert" size={22} color={"grey"}/>
            </TouchableOpacity>
          }>
          <View>
            <MenuItem onPress={this.showDonate.bind(this)}>
              <Ionicons name="md-cash" size={15} color="white"/>
              <Text style={styles.tStyle}>  Donate</Text>
            </MenuItem>
            <MenuItem onPress={()=>{this.setState({alert:true})}}>
              <Ionicons name="md-exit" size={15} color="white"/>
              <Text style={styles.tStyle}>  Exit</Text>
            </MenuItem>
            <AlertComponent
              visible={this.state.alert}
              title = "Image to PDF Converter"
              message = {"Exit Image to PDF Converter App (=^ェ^=) "}
              icon = {{
                "iconName":"md-exit",
                "iconColor":"gray",
                "iconSize":20
              }}
              okText={"OK"}
              cancelText={"CANCEL"}
              onPressOK={()=>{this.alertHandle()}}
              onPressCancel={()=>{
                this.hideMenu();
                this.setState({alert:false})}}
            />
          </View>
        </Menu>
        <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.visibleDonate}
            onRequestClose={() => {
              this.setState({visibleDonate:false})
            }}
            >
            <View style={{flexGrow: 1,justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <Donate close={()=>this.setState({visibleDonate:false})}/>
            </View>
          </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  menuPaper:{
    backgroundColor:"grey"
  },
  tStyle:{
    fontWeight:"bold",
    color:"white",
    fontSize:15
  },
})
