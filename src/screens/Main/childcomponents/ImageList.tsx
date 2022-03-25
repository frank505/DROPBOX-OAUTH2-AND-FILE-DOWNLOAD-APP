import React from 'react';
import {View,Text} from 'react-native';
import Button from '../../../components/Button';
import { style } from '../styles';
import { ImageListType } from '../types';

const ImageList:React.FC<ImageListType> = ({item,downloadSingleFile}) =>
{
 return (
     <View 
     style={style.styleParentViewContent} >
         <Text 
         style={style.textContent}>
             FileName: {item.name}</Text>
  <Button 
  onPress={()=>downloadSingleFile(item.path_display,item.id)}
 textString={'Download File'} 
 testID={'buttonContent'+item.id}  
 />
     </View>
 
 );
}



export default ImageList;
