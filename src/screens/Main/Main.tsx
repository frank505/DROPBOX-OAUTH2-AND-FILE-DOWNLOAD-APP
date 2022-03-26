import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosResponse } from 'axios';
import React,{useEffect, useState} from 'react';
import {View,Text, FlatList,Alert, SafeAreaView, ActivityIndicator} from 'react-native';
import { useMutation } from 'react-query';
import ModalActivityIndicator from '../../components/ModalActivityIndicator';
import {  DROPBOX_ROOT_PATH, ITEMS_PER_PAGE } from '../../constants';
import { downloadFilePostRequest, postRequest } from '../../http/apiSetup';
import { PostRequestType } from '../../http/types';
import  ImageList  from './childcomponents/ImageList';
import { style } from './styles';
import { InitApiDataRequest, LoadMoreDataRequest } from './types';



const Main:React.FC<{}> = () =>
{

    const initApiDataProps:InitApiDataRequest = {
    path: DROPBOX_ROOT_PATH,
    recursive: false,
    include_media_info: false,
    include_deleted: false,
    include_has_explicit_shared_members: false,
    include_mounted_folders: true,
    include_non_downloadable_files: true,
    limit:ITEMS_PER_PAGE
    }
   

    const [loadMoreApiDataProps,setLoadMoreApiDataProps] = useState<LoadMoreDataRequest>({
      cursor:''
    });

    const [paginatedData,setPaginatedData] = useState<Array<any>>([]);
    const [isRefreshing,setIsRefreshing] = useState<boolean>(false);
    const [responseData,setResponseData] = useState<any>([]);
    const [fileDownloadIsLoading,setFileDownloadIsLoading] = useState<boolean>(false);


    useEffect(()=>
    {
      console.log(responseData);
      if(responseData.hasOwnProperty('entries') && responseData.hasOwnProperty('cursor'))
      {
        setPaginatedData((paginatedData:any)=>[...paginatedData, ...responseData?.entries]);
        setLoadMoreApiDataProps({...loadMoreApiDataProps, cursor:responseData?.cursor }) 
      }  
        
   
    },[responseData])


    const initGetFilesInFolder = async():Promise<AxiosResponse<any> | Error> =>
    {
     let data:PostRequestType = {
         method: 'POST',
         body: initApiDataProps,
         addedUrl: '2/files/list_folder',
         setResponseData:setResponseData
     }   
     return await postRequest(data);
    }

    const loadMoreGetFilesInFolder = async():Promise<AxiosResponse<any> | Error> =>
     {
      let data:PostRequestType = {
        method: 'POST',
        body: loadMoreApiDataProps,
        addedUrl: '2/files/list_folder/continue',
        setResponseData:setResponseData
    }   
       return await postRequest(data);
     }

    const initGetFilesCall:any = useMutation(initGetFilesInFolder,{retry: false});
  
    const  loadMoreGetFilesCall:any  = useMutation(loadMoreGetFilesInFolder,{retry:false});

   





 const loadMoreContent = async() =>
 {
   console.log('here oooooooo')
   console.log(responseData?.entries?.length);
   if(responseData?.entries?.length >= ITEMS_PER_PAGE)
   {
     console.log('man them be mad')
    loadMoreGetFilesCall.mutate();
   }
 }



  

 const downloadSingleFile = async(pathDisplay:string,id:string):Promise<any> =>
 {
   let data:PostRequestType = {
     method: 'POST',
     body: {pathDisplay:pathDisplay},
     addedUrl: '2/files/download',
     setIsLoading:setFileDownloadIsLoading,
   }
    return await downloadFilePostRequest(data)
 }






 const refreshData = () =>
 {
  setIsRefreshing(true);
   setPaginatedData([]);
   initGetFilesCall.mutate();
   setIsRefreshing(false);
 }



    useEffect(()=>{
      initGetFilesCall.mutate();
    },[])

    return (
     
        <View style={style.parentView}>
       {
         initGetFilesCall.isLoading ?
         <View style={style.activityIndicatorLoaderParent} testID={'activityIndicatorView'}>
         <ActivityIndicator size={'large'}  />
         </View>
         :
         <View style={style.flatListParent}>
        
         <FlatList
               onRefresh={()=> refreshData()}
               testID={'flatListContent'}
               refreshing={isRefreshing}
                 keyExtractor={(item, index) => index.toString()}
                  data={paginatedData}
                 showsVerticalScrollIndicator={false}
                 horizontal={false}
                 numColumns={2}
                 renderItem={({item,index})=>
                 <ImageList
                 key={index}
                item={item}
                 downloadSingleFile={downloadSingleFile}
                  />
                 }
                 onEndReached={async()=>  await loadMoreContent()}
                 onEndReachedThreshold={0.5}
               />

               <ModalActivityIndicator visible={fileDownloadIsLoading} testID="modalIndicator" textString={'please wait while file is downloading...'}  />
    </View>
       }
       </View>
    

    );
}



export default Main;