import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Layout from "./src/components/Layout";
import Welcome from "./src/pages/Welcome";
import OTP from "./src/pages/OTP";
import CheckInScreen from "./src/pages/CheckInScreen";
import WelcomeGreeting from "./src/pages/WelcomeGreeting";
import Emotion from "./src/pages/Emotion";
import CheckOutScreen from "./src/pages/CheckOutScreen";
import Feedback from "./src/pages/Feedback";
import CheckOutGreeting from "./src/pages/CheckOutGreeting";
import PostEmotion from "./src/pages/PostEmotion";

const Stack = createNativeStackNavigator();

const NavigationStack = ({ initialRoute }: { initialRoute: string }) => (
  <Stack.Navigator
    initialRouteName={initialRoute}
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: "transparent" },
    }}
  >
    <Stack.Screen name="Welcome" component={Welcome} />
    <Stack.Screen name="OTP" component={OTP} />
    <Stack.Screen name="CheckIn">
      {(props) => (
        <Layout>
          <CheckInScreen {...props} />
        </Layout>
      )}
    </Stack.Screen>
    <Stack.Screen name="WelcomeGreeting">
      {(props) => (
        <Layout hideHeader>
          <WelcomeGreeting {...props} />
        </Layout>
      )}
    </Stack.Screen>
    <Stack.Screen name="Emotions">
      {(props) => (
        <Layout>
          <Emotion {...props} />
        </Layout>
      )}
    </Stack.Screen>
    <Stack.Screen name="CheckOut">
      {(props) => (
        <Layout>
          <CheckOutScreen {...props} />
        </Layout>
      )}
    </Stack.Screen>
    <Stack.Screen name="Feedback">
      {(props) => (
        <Layout>
          <Feedback {...props} />
        </Layout>
      )}
    </Stack.Screen>
    <Stack.Screen name="CheckOutGreeting">
      {(props) => (
        <Layout hideHeader>
          <CheckOutGreeting {...props} />
        </Layout>
      )}
    </Stack.Screen>
    <Stack.Screen name="PostEmotion">
      {(props) => (
        <Layout hideHeader>
          <PostEmotion {...props} />
        </Layout>
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

export default NavigationStack;