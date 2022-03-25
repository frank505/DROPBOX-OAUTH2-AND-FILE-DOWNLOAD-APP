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
    const [responseData,setResponseData] = useState<Array<any>>([]);
    const [fileDownloadIsLoading,setFileDownloadIsLoading] = useState<boolean>(false);


    useEffect(()=>
    {
    
        setPaginatedData((paginatedData:any)=>[...paginatedData, ...responseData])
 
   
    },[responseData])


    const initGetFilesInFolder = async():Promise<AxiosResponse<any> | Error> =>
    {
     let data:PostRequestType = {
         method: 'POST',
         body: initApiDataProps,
         addedUrl: '2/files/list_folder',
     }   
     return await postRequest(data);
    }

    const loadMoreGetFilesInFolder = async():Promise<AxiosResponse<any> | Error> =>
     {
      let data:PostRequestType = {
        method: 'POST',
        body: loadMoreApiDataProps,
        addedUrl: '2/files/list_folder/continue',
    }   
       return await postRequest(data);
     }

    const initGetFilesCall:any = useMutation(initGetFilesInFolder,{retry: false});
  
    const  loadMoreGetFilesCall:any  = useMutation(loadMoreGetFilesInFolder,{retry:false});

   
   useEffect(()=>{
     if( initGetFilesCall.isSuccess)
     {
      if(initGetFilesCall.data?.status==200)
      {
        setResponseData(initGetFilesCall.data.data.entries);
        setLoadMoreApiDataProps({...loadMoreApiDataProps, cursor:initGetFilesCall.data.data.cursor }) 
      }

     }
    

   },[initGetFilesCall.isSuccess])


  useEffect(()=>{
 if(loadMoreGetFilesCall.isSuccess)
 {
  if(loadMoreGetFilesCall.data?.status==200)
  {
    setResponseData(loadMoreGetFilesCall.data.data.entries);
    setLoadMoreApiDataProps({...loadMoreApiDataProps, cursor:loadMoreGetFilesCall.data.data.cursor }) 
  }   
 }
    

  },[loadMoreGetFilesCall.isSuccess])




 const loadMoreContent = async() =>
 {
   if(responseData.length >= ITEMS_PER_PAGE)
   {
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


 const renderCustomFooter = ():JSX.Element|null =>
 {
 return loadMoreGetFilesCall.isLoading ? 
  <View>
    <ActivityIndicator/>
    <Text>Loading More...</Text>
  </View>
  : null;
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
               refreshing={isRefreshing}
                 keyExtractor={(item, index) => index.toString()}
                  data={paginatedData}
                 showsVerticalScrollIndicator={false}
                 horizontal={false}
                 numColumns={2}
                 renderItem={({item,index})=>
                 <ImageList
                item={item}
                 downloadSingleFile={downloadSingleFile}
                  />
                 }
                 onEndReached={async()=>  await loadMoreContent()}
                 onEndReachedThreshold={0.5}
                ListFooterComponent={()=>renderCustomFooter()}
               />

               <ModalActivityIndicator visible={fileDownloadIsLoading}  textString={'please wait while file is downloading...'}  />
    </View>
       }
       </View>
    

    );
}



export default Main;