import {
    StyleSheet,
   StyleProp 
   } from 'react-native';
import { colors } from '../theme/colors';




export const style:StyleProp<any> = StyleSheet.create({

selectFileButton:{
    borderColor:colors.purpleLight,
    borderWidth:2,
    padding:15,
    borderRadius:5,
    justifyContent: 'center',
    alignItems:'center'
},
selectFileText:{
    fontWeight:'bold',
    color:colors.main
},


})