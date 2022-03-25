import {
    StyleSheet,
   StyleProp 
   } from 'react-native';
import { colors } from '../../theme/colors';





export const style:StyleProp<any> = StyleSheet.create({

parentView:{
    flex:1, justifyContent:'space-between',alignItems:'center'
},
activityIndicatorLoaderParent:{
    flex:1,justifyContent:'center',alignItems:'center' 
},
flatListParent:{
    flex:1, justifyContent:'space-between',alignItems:'center'
},
textContent:{
    flexWrap:'wrap',
         color:'black',fontWeight:'bold',marginBottom:10
},
styleParentViewContent:{
    justifyContent:'center',
     alignItems:'center',padding:10,width:'50%'
}

})