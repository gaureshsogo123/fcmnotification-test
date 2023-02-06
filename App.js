import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert, View,Text } from 'react-native';




function App() {
    async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  
  useEffect(()=>{
    if(requestUserPermission()){
      //token key of device
      messaging().getToken().then((token)=>{
        console.log(token)
      })
    }
    else{
      console.log("failed token status");
    }


        // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });


          // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });


    // Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});


const unsubscribe = messaging().onMessage(async remoteMessage => {
  Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
});

return unsubscribe;


  },[])
  return (
    <View style={{marginTop:"50%"}}>
      <Text>Hello</Text>
    </View>
  )
}

export default App