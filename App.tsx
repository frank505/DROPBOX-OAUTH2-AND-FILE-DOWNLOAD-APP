/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

 import React, { useEffect, useState } from 'react';
 import {
   Alert,
   Platform,
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   useColorScheme,
   View,
   Linking
 } from 'react-native';
 import { QueryClient, QueryClientProvider } from 'react-query';
 import Main from './src/screens/Main';
 import NetInfo, {  useNetInfo }  from "@react-native-community/netinfo";
import { ACCESS_TOKEN_KEY, CLIENT_ID, OAUTH_URL, PRESET_FALSE_AUTH_TOKEN } from './src/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
 

 
 const App:React.FC = () =>
 {
 
 const networkCheck = useNetInfo();
 const [token, setToken] = useState<string|null>(null);
 
   useEffect(()=>
   {
     networkCheck.isConnected==false ? 
     Alert.alert('Network Error','you seem not to be connected to interneted and so this app will function optimally'):null;
   },
   [networkCheck])

 
 useEffect(()=>
 {
  initOauth();
 },[])


const initOauth = async()  => 
{
  let token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  setToken(token);
  if(!token)
  {
    Linking.openURL(OAUTH_URL);
    Linking.addEventListener('url', async(response)=>
    {
       let newString = response.url;
       let accessToken = newString.split("#")[1].split("&")[0].split("=")[1];    
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, `${accessToken}`); 
      setToken(accessToken);
    });

  }
 
 
}




 
 
   const client = new QueryClient();
 
   return (
     <SafeAreaView style={{flex:1}}>
       <StatusBar  />
       <QueryClientProvider client={client} >
         {
           token!=null && 
           <Main/>
         }        
       </QueryClientProvider>
        
     </SafeAreaView>
 
   )
 }
 
 
 export default App;
 
 