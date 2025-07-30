import React, { useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { flushQueue } from "./src/api/wrapper/apiQueue";
import NavigationStack from "./NavigationStack";
import { getActiveRouteName } from "./src/utils/navigation";

const LAST_ROUTE_KEY = "LAST_ROUTE_NAME";

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | undefined>(undefined);
  const routeNameRef = useRef<string>("");

  useEffect(() => {
    // Load last route name from storage
    AsyncStorage.getItem(LAST_ROUTE_KEY).then((route) => {
      setInitialRoute(route || "Welcome");
    });
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        flushQueue();
      }
    });
    return () => unsubscribe();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer
      onReady={() => {
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
      <NavigationStack initialRoute={initialRoute} />
    </NavigationContainer>
  );
}