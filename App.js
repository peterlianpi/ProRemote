import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { ConnectionProvider } from "./libs/connectionProvider";
import Layout from "./Layout";

export default function App() {
  return (
    <ConnectionProvider>
      <View style={styles.container}>
        <Layout />
        <StatusBar style="auto" />
      </View>
    </ConnectionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Roboto",
    color: "#e2e2e2",
  },
});
