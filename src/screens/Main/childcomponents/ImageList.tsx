import React from 'react';
import {View,Text} from 'react-native';
import Button from '../../../components/Button';
import { ImageListType } from '../types';

const ImageList:React.FC<ImageListType> = ({item,downloadSingleFile}) =>
{
 return (
     <View 
     style={{justifyContent:'center',
     alignItems:'center',padding:10,width:'50%'}} >
         <Text 
         style={{flexWrap:'wrap',
         color:'black',fontWeight:'bold',marginBottom:10}}>
             FileName: {item.name}</Text>
  <Button 
  
  onPress={()=>downloadSingleFile(item.path_display,item.id)}
 textString={'Download File'} 
 testID={''}  
 />
     </View>
 
 );
}



export default ImageList;
