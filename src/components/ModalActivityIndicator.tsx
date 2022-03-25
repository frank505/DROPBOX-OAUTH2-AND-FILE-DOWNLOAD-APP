import React from 'react'
import {
    ActivityIndicator,
    View,
    Text
  } from 'react-native'
import { ModalActivityIndicatorTypes } from './types';


const ModalActivityIndicator:React.FC<ModalActivityIndicatorTypes> = (props) =>
{
  return (
    <View style={{
        flex:1,
        backgroundColor:'#00000033', 
        zIndex: props.visible ? 999999 : -999999,
        position: 'absolute',
        left:0,
        top:0,
        width:props.visible ? '100%' : 0,
        height:props.visible ? '100%' : 0,
    }}
    testID={props.testID}
    >
    {
        !props.visible ? null :
        <View style={{
            flex:1,
            justifyContent:'center',
            alignItems:'center',
            }}>
            <ActivityIndicator
                size={props.size ? props.size : 'large'} 
                color={props.color ? props.color : 'white'} />
                <Text style={{color:'white',fontWeight:'bold',fontSize:18}}>{props.textString}</Text>
        </View>
    }        
    </View>
  );
}


export default ModalActivityIndicator;