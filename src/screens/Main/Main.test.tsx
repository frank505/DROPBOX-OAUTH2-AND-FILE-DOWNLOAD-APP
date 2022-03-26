import * as React from 'react';
import {  useNetInfo } from '@react-native-community/netinfo';
import { fireEvent, RenderAPI, waitFor } from '@testing-library/react-native';
import Main from './Main';
import { Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TestWrapperComponent from '../../../jest/TestWrapper';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import * as apiSetup  from '../../http/apiSetup';





const mockIdToUse = 'id:ejPznzhwucAAAAAAAAAADg';

let mockApiData:any= {
    data:{
     entries:[
         {tag: "file",
     client_modified: "2022-03-22T23:08:50Z",
     content_hash: "15ae4ef55ccc903808112e1c28a30279996a520335c6177687e7b9765c7fb0c8",
     id: "id:ejPznzhwucAAAAAAAAAADg",
     is_downloadable: true,
     name: "Photo 18-03-2022, 14 48 08.png",
     path_display: "/test_folder/Photo 18-03-2022, 14 48 08.png",
     path_lower: "/test_folder/photo 18-03-2022, 14 48 08.png",
     rev: "015dad6b23405ff000000014d102e90",
     server_modified: "2022-03-22T23:08:51Z",
     size: 4080530},
     {},{},{},{},{},{},{},{},{},
     {},{},{},{},{},{},{},
    {},{},{},{},{},{},{},{},{},{},
    {},{},{},{},{},{}],
         cursor:'ssssss' 
    }

}


let mockDownloadFileDataOnFailed:any = {
  respInfo:{
      status:401
  }
}

let mockDownloadOnSuccess:any = {
  path:jest.fn().mockResolvedValue('saaaa')
}


const renderComponent = ():RenderAPI =>
{
 return TestWrapperComponent(<Main/>)
}






describe('App test',()=>{
  
  afterEach(() => {
    jest.clearAllMocks();
});

it('token is null make api request and we get a 401', async()=>{
    axios.post = jest.fn().mockRejectedValueOnce({response:{status:401}});
    jest.spyOn(Alert,'alert');
    let resolveNull:any = Promise.resolve(null);
    AsyncStorage.getItem = jest.fn().mockResolvedValue(resolveNull);
    renderComponent();
    await waitFor(()=>expect(AsyncStorage.getItem).toHaveBeenCalled());
    await waitFor(()=>expect(Alert.alert).toHaveBeenCalled());
    //click on button to perform http request if token exist
   let alertMock:any = Alert.alert;
   alertMock.mock.calls[0][2][0].onPress(); 
   await waitFor(()=>expect(AsyncStorage.getItem).toHaveBeenCalled());
    await waitFor(()=>expect(axios.post).toHaveBeenCalled() );  
//     //generate new token if token is absent
    alertMock.mock.calls[0][2][1].onPress(); 
    await waitFor(()=>expect(Linking.openURL).toHaveBeenCalled());
    await waitFor(()=>expect(Linking.addEventListener).toHaveBeenCalled());
});

it('fails api request and returns anything else not a 401', async()=>{
  axios.post = jest.fn().mockRejectedValueOnce({response:{status:400}});
  jest.spyOn(Alert,'alert');
  let resolveNull:any = Promise.resolve(null);
  AsyncStorage.getItem = jest.fn().mockResolvedValue(resolveNull);
  renderComponent();
  await waitFor(()=>expect(AsyncStorage.getItem).toHaveBeenCalled());
  await waitFor(()=>expect(Alert.alert).toHaveBeenCalled());

})

    it('axios is called on api call', async()=>
    {
        axios.post = jest.fn().mockResolvedValueOnce(Promise.resolve(mockApiData));
        renderComponent();
        await waitFor(()=>expect(AsyncStorage.getItem).toHaveBeenCalled());
       await waitFor(()=>expect(axios.post).toHaveBeenCalled() );  
     });


     it('loads more content for flatlist', async()=>{
      axios.post = jest.fn().mockResolvedValueOnce(Promise.resolve(mockApiData));
        jest.spyOn(Alert,'alert');
       const {getByTestId} =  renderComponent();
       await waitFor(()=>expect(axios.post).toHaveBeenCalled() );  
       let flatElem = getByTestId('flatListContent');
       flatElem.props.onEndReached();
       await waitFor(()=>expect(axios.post).toHaveBeenCalledTimes(2) );  
        
     });

     it('refreshes flatlist', async()=>{
        axios.post = jest.fn().mockResolvedValueOnce(mockApiData);
        jest.spyOn(Alert,'alert');
       const {getByTestId} =  renderComponent();
       await waitFor(()=>expect(axios.post).toHaveBeenCalled() );  
       let flatElem = getByTestId('flatListContent');
       flatElem.props.onRefresh();
       await waitFor(()=>expect(axios.post).toHaveBeenCalledTimes(2) );  
     });

    it('download process throws an error ', async()=>{
        //fetch data first
        axios.post = jest.fn().mockResolvedValueOnce(Promise.resolve( mockApiData ));
        jest.spyOn(Alert,'alert');
        AsyncStorage.setItem = jest.fn().mockResolvedValue(Promise.resolve('sss'));
       const {getByTestId,queryByTestId,findByTestId} =  renderComponent();
       await waitFor(()=>expect(axios.post).toHaveBeenCalled() );  
       //show modal indicator first on button click
       let elemCLick:any = await findByTestId('buttonContent'+mockIdToUse);
       fireEvent.press(elemCLick);
       await waitFor(()=>expect(AsyncStorage.getItem).toHaveBeenCalled());
       await waitFor(()=> expect(queryByTestId('modalIndicator')).not.toBeNull() ); 
      //  await waitFor(()=>expect(RNFetchBlob.config).toHaveBeenCalled() );
 
    })   

     it('download file process fails', async()=>{
         //fetch data first
        axios.post = jest.fn().mockResolvedValueOnce(Promise.resolve( mockApiData ));
         jest.spyOn(Alert,'alert');
         AsyncStorage.setItem = jest.fn().mockResolvedValue(Promise.resolve('sss'));
       const {getByTestId,queryByTestId} =  renderComponent();
       await waitFor(()=>expect(axios.post).toHaveBeenCalled() );  
       //show modal indicator first on button click
       RNFetchBlob.config({ fileCache:true,path:''}).fetch = 
       jest.fn().mockResolvedValueOnce(Promise.resolve( mockDownloadFileDataOnFailed ));
       fireEvent.press(getByTestId('buttonContent'+mockIdToUse));
       await waitFor(()=> expect(queryByTestId('modalIndicator')).not.toBeNull() );

     })


     it('download file successful',  async()=>{
      jest.spyOn(Alert,'alert');
      axios.post = jest.fn().mockResolvedValueOnce(Promise.resolve( mockApiData ));
      AsyncStorage.setItem = jest.fn().mockResolvedValue(Promise.resolve('sss'));
    const {getByTestId,queryByTestId} =  renderComponent();
    await waitFor(()=>expect(axios.post).toHaveBeenCalled() );  
    //show modal indicator first on button click
    RNFetchBlob.config({ fileCache:true,path:''}).fetch = jest.fn().mockResolvedValue(Promise.resolve( mockDownloadOnSuccess ));
    await waitFor(()=> fireEvent.press(getByTestId('buttonContent'+mockIdToUse))) ;
    await waitFor(()=> expect(queryByTestId('modalIndicator')).not.toBeNull() );
     })

   

 
    
})

