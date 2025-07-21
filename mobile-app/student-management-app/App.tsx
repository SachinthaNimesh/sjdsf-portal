import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
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
import React, { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostEmotion from "./src/pages/PostEmotion";

const Stack = createNativeStackNavigator();

type ScreenProps = {
  navigation: any;
  route: any;
};

const LAST_ROUTE_KEY = "LAST_ROUTE_NAME";

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | undefined>(
    undefined
  );
  const routeNameRef = useRef<string>("");

  useEffect(() => {
    // Load last route name from storage
    AsyncStorage.getItem(LAST_ROUTE_KEY).then((route) => {
      setInitialRoute(route || "Welcome!");
    });
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <NavigationContainer
      onReady={() => {
        // Save the initial route name
        routeNameRef.current = initialRoute;
      }}
      onStateChange={async (state) => {
        const currentRoute = getActiveRouteName(state);
        if (currentRoute && routeNameRef.current !== currentRoute) {
          routeNameRef.current = currentRoute;
          await AsyncStorage.setItem(LAST_ROUTE_KEY, currentRoute);
        }
      }}
    >
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="CheckIn">
          {(props: ScreenProps) => (
            <Layout>
              <CheckInScreen {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="WelcomeGreeting">
          {(props: ScreenProps) => (
            <Layout>
              <WelcomeGreeting {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Emotions">
          {(props: ScreenProps) => (
            <Layout>
              <Emotion {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="CheckOut">
          {(props: ScreenProps) => (
            <Layout>
              <CheckOutScreen {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Feedback">
          {(props: ScreenProps) => (
            <Layout>
              <Feedback {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="CheckOutGreeting">
          {(props: ScreenProps) => (
            <Layout>
              <CheckOutGreeting {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen name="PostEmotion">
          {(props: ScreenProps) => (
            <Layout>
              <PostEmotion {...props} />
            </Layout>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Helper to get the current route name from navigation state
function getActiveRouteName(state: any): string | undefined {
  if (!state) return undefined;
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  return route.name;
}
