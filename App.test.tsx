import * as React from 'react';
import {  useNetInfo } from '@react-native-community/netinfo';
import { RenderAPI, waitFor } from '@testing-library/react-native';
import TestWrapperComponent from './jest/TestWrapper';
import App from './App';
import { Alert, Linking } from 'react-native';




const renderComponent = ():RenderAPI =>
{
 return TestWrapperComponent(<App/>)
}






describe('App test',()=>{
  
  afterEach(() => {
    jest.clearAllMocks();
});
    it('calls netinfo', async()=>
    {
        renderComponent();
       await waitFor(()=>expect(useNetInfo).toHaveBeenCalled() );  
     });

     it('displays alert if no network', async()=>
     {
         jest.spyOn(Alert,'alert');
        const network = useNetInfo();
        network.isConnected = false;
         renderComponent();
       await waitFor(()=> expect(Alert.alert).toHaveBeenCalled())  ;
     });

     it('calls linking url', async()=>{
      renderComponent();
    await waitFor(()=> expect(Linking.openURL).toHaveBeenCalled()) ;
    await waitFor(()=>expect(Linking.addEventListener).toHaveBeenCalled());
     })

    
})

