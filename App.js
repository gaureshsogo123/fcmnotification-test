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
        Authorization: `key=AAAAVXIYq00:APA91bHrr0TNcX1B45AuYo6fnISJxvSwGDaclxztKvJQGXYrx1gsFNHCpb3eYIKKYtyu4xOgRLinYy3tP45e4ilziC-rv49SE0BiL3XUVkPK1Iidc86Sd2iG3FQULicnN0x_h37tgF_x`,
      },
      body: JSON.stringify({
        to: "fDYibcQ5RZKkJNPb0h4gs3:APA91bEwXz8NrPOXDCpcdv_i0epDHp3S6M876GIZpu3r7fUiZBt1_hdgKzTPMK3EJupF5272WOYBFD3el16kZ9X1NKf313UXp_-1uK474u31iffDZOkVAqQDOe-jRRTHNm3i_zv8Z4zH",
        priority: "normal",
        data: {
          experienceId: "testnotification-devclient",
          scopeKey: "testnotification-devclient",
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