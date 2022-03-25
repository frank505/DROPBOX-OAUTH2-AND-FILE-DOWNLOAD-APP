import React from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import { ACCESS_TOKEN_KEY, DOWNLOAD_FILE_URL } from './../constants';
import { Alert,Linking } from 'react-native';
import { PostRequestType } from './types';
import { API_BASE_URL,  OAUTH_URL, PRESET_FALSE_AUTH_TOKEN } from '../constants';
import axios, { AxiosResponse } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';




export const postRequest  = async(data:PostRequestType):Promise<AxiosResponse<any> | Error> =>
{
      let tokenApp =  await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
   return  axios.post(
         API_BASE_URL+data.addedUrl, 
        data.body,
        {
         headers: 
         !data.contentType?
         {
            "Authorization":`Bearer ${tokenApp==null? PRESET_FALSE_AUTH_TOKEN: tokenApp}`
         }
         :
         { 
               "Content-Type": data.contentType,
               "Authorization":`Bearer ${tokenApp==null?PRESET_FALSE_AUTH_TOKEN:tokenApp}`
            },
        }).then((res:AxiosResponse)=>
        {
              return res;
        }).catch(async(err:any)=>
        {
           if( err?.response.status == 401) 
           {
            generateNewTokenOnPostRequest(data);
           }

            Alert.alert('Error','Data failed to fetch please try again later');
            return err;
        })   
   
}


  const generateNewTokenOnPostRequest = (data:PostRequestType) =>
  {
   Alert.alert('Token Expired',
   'Your token has expired click on ok button to generate a new access token',
   [
     {text: 'Cancel',
     onPress:async() =>{
      await postRequest(data);
     }, 
      style: 'cancel'}, 
      {
         text: 'Generate New Token',
         onPress: async() => {
            await generateNewOauth();
         }
       }
   ],{cancelable: false} );
  }




 export const generateNewOauth = async():Promise<any>  => 
{

   let accessT:string = '';
    Linking.
    openURL(OAUTH_URL);
    Linking.addEventListener('url', async(response)=>
    {
       let newString = response.url;
       let accessToken = newString.split("#")[1].split("&")[0].split("=")[1];    
     await AsyncStorage.setItem(ACCESS_TOKEN_KEY, `${accessToken}`); 
     accessT = accessToken;
    });
  return accessT;
}





export const downloadFilePostRequest = async(data:PostRequestType):Promise<void>=>
{
   let dirs = RNFetchBlob.fs.dirs;
   let token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
   let downloadData:string = JSON.stringify({path:data.body.pathDisplay});
    data.setIsLoading(true);
    RNFetchBlob.config({  
     fileCache:true,
      path:dirs.DownloadDir+''+data.body.pathDisplay
    }).
    fetch(data.method, DOWNLOAD_FILE_URL+''+data.addedUrl,
    {
       'Authorization' : `Bearer ${token==null? PRESET_FALSE_AUTH_TOKEN: token}`,
      'Dropbox-API-Arg': downloadData,
    }).then((res)=>
    {
      data.setIsLoading(false);

      if(res.respInfo.status==401)
      {
        return  generateNewTokenForFileDownload(data);
      }
       Alert.alert('file downloaded successfully', `path:file://${res.path()}`);

    }) .catch((err) => 
    {
       data.setIsLoading(false);
       Alert.alert('Error','There seems to be a problem please try again later');
    })
}




const generateNewTokenForFileDownload = (data:PostRequestType) =>
{
   Alert.alert('Token Expired',
   'Your token has expired click on ok button to generate a new access token',
   [
     {text: 'Cancel',
     onPress:async() =>{
      await downloadFilePostRequest(data);
     }, 
      style: 'cancel'}, 
      {
         text: 'Generate New Token',
         onPress: async() => {
            await generateNewOauth();
         }
       }
   ],{cancelable: false} );
}


