**HOW TO RUN THIS APP FOR ANDROID AND IOS**


 To run this app on IOS :
 1) Ensure you have xcode and the required dependencies for a bare react native app setup 
 2) run command "npm install" in the terminal in the same directory as the project
 3) go to the ios directory and run command "pod install" in the terminal
 4) either you open the app file named xcworkspace with xcode and run the app or you use 
   the command "npx react-native run-ios" in the terminal to open the app.
   To specify a device using the npx command you can add the --device flag to the command like this 
    "npx react-native ios --device="yourDeviceName"
  
  
  To run this app on android :
  1)Ensure you have android studio and all its dependencies perfectly setup.
  2) run command "npm install" in the terminal in the same directory as the project
  3) either you open the app fiolder named android with android studio and run the app or you use 
   the command "npx react-native run-android" in the terminal to open the app.
   To specify a device using the npx command you can add the --device flag to the command like this 
    "npx react-native android --deviceId="yourDeviceId"
  4) to run this on a real device and not an emulator use adb to check if that device is connected "adb devices"
      then  run "adb reverse tcp:8081 tcp:8081" for port mapping between the device and your computer
      then run "npx react-native android --deviceId="yourDeviceId" 
