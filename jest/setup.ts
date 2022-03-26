import { NativeModules } from 'react-native';

NativeModules.RNCNetInfo = {
  getCurrentState: jest.fn(() => Promise.resolve()),
  addListener: jest.fn(),
  removeListeners: jest.fn()
};

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

//a function to tell if a pressable object is disabled or enabled
export function isDisabled(element:any) {
    return !!element?.props.onStartShouldSetResponder?.testOnly_pressabilityConfig()?.disabled;
  }


  let mockDownloadFileDataOnFailed:any = {
    respInfo:{
        status:401
    }
  }



  jest.mock('rn-fetch-blob', () => {
    return {
      __esModule: true,
      default:{
        fs: {
          dirs: {
            DocumentDir: '',
            DonwloadDir:''
          },
          writeFile: () => Promise.resolve(),
        },
        config:(data:any)=> {
          return {
            fetch: jest.fn().mockResolvedValueOnce( Promise.resolve())
          }
      }
    
      }
    
    }
  });



 









  
  
  jest.mock('@react-native-async-storage/async-storage', ()=>{
    return {
      setItem: jest.fn(() => {
          return new Promise((resolve, reject) => {
              resolve(null);
          });
      }),
      multiSet:  jest.fn(() => {
          return new Promise((resolve, reject) => {
              resolve(null);
          });
      }),
      getItem: jest.fn(() => {
          return new Promise((resolve, reject) => {
              resolve('');
          });
      }),
      multiGet: jest.fn(() => {
          return new Promise((resolve, reject) => {
              resolve('');
          });
      }),
      removeItem: jest.fn(() => {
          return new Promise((resolve, reject) => {
              resolve(null);
          });
      }),
      getAllKeys: jest.fn(() => {
          return new Promise((resolve) => {
              resolve(['one', 'two', 'three']);
          });
      })
    }
  });
  
  jest.mock('@react-native-community/netinfo', ()=>{
    return{
     useNetInfo: jest.fn().mockReturnValue({isConnected:true}),
    }  
 })

 
 jest.mock("react-native/Libraries/Linking/Linking", () => {
  let dataCont:any = 'aaa#sss=aaa&saa';
  return {
    openURL: jest.fn(() => Promise.resolve("mockResolve")),
    addEventListener: jest.fn((event, handler) => {
     handler({url:dataCont});
    }),
  }
 });

 
