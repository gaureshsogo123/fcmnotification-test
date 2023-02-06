import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert, View,Text, Button } from 'react-native';




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
  Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage.data.title));
});

return unsubscribe;


  },[])


  const sendNotification = async()=>{
    await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=AAAAI1KPs2U:APA91bEJ_KiPIKJu5rmU99OgHfo8LnSG2bXMxRa-1qrtGrkPEII4jdr6XTUi-zM5orlFuIblsGJGUwQySL6-A-1rYdrf1rTAEluPHhW5EwTV0uttHlZVFm9f2AIL8p5WENC-D0mGX6bW`,
      },
      body: JSON.stringify({
        to: "d1HVXpAeToaphq0Wzqw5HB:APA91bHSG0dHLSFmHQzVki-fnbyG4LwRLv8dxZyL64_3k0hc8c7gNz_woA5sntC_VLGiIhtOh3Vbs6JuVkowxrVyS-JZQwMyrgbAk3z8GnJKdXGdCBZQ_2w2MWhzMhl_KJA7H7NA1Br0",
        priority: "normal",
        data: {
          experienceId: "notifications-app",
          scopeKey: "notifications-app",
          title: "You've got order from gauresh",
          message: "Please Check",
        },
      }),
    });
  }
  return (
    <View style={{marginTop:"50%"}}>
      <Text>Hello</Text>
      <View style={{marginTop:"60%"}}><Button title='Send Notification' onPress={sendNotification}/></View>
    </View>
  )
}

export default App