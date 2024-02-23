import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useConnection } from "../libs/connectionProvider";

const LoginPage = () => {
  const [showErrorMessage, setShowErrorMessage] = useState(false); // State to control visibility of error message

  const {
    authenticate,
    cancelAuthenticate,
    host,
    setHost,
    port,
    setPort,
    password,
    setPassword,
    connect,
    isConnected,
    ws,
    isConnecting,
    setIsConnecting,
    setIsConnected,
    message,
    setMessage,
  } = useConnection();

  // Effect to handle WebSocket connection
  useEffect(() => {
    if (!isConnected && !isConnecting) {
      connect(); // Connect only if not already connected or connecting
    }

    // Clean up WebSocket connection when component unmounts or host/port changes
    return () => {
      if (
        ws &&
        (ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING)
      ) {
        setIsConnecting(false);
        setIsConnected(false);
        ws.close();
      }
    };
  }, [host, port]);

  const handleAuthentication = async () => {
    await authenticate();
    if (message) {
      // setMessage(message);
      setShowErrorMessage(true);
      // Hide error message after 3 seconds
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }
  };

  console.log(message.message);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.loading}>
        <View style={styles.loadingInternal}>
          <View style={styles.loadingImg}>
            <Image
              source={require("../assets/img/logo.png")}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.authenticate}>
              <View style={styles.hostPortContainer}>
                <View>
                  <Text style={styles.label}>Host:</Text>
                  <TextInput
                    style={styles.hostInput}
                    value={host}
                    onChangeText={setHost} // Update host state when input changes
                  />
                </View>
                <View>
                  <Text style={styles.label}>Port:</Text>
                  <TextInput
                    style={styles.portInput}
                    value={port}
                    onChangeText={setPort} // Update port state when input changes
                  />
                </View>
                <View style={styles.dot}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: isConnected ? "green" : "red" },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.passwordContainer}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword} // Update password state when input changes
                />
              </View>
              {showErrorMessage && (
                <View style={styles.errorMessageContainer}>
                  <Text style={styles.errorMessage}>{message.message}</Text>
                </View>
              )}
              {!isConnecting && (
                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={handleAuthentication} // Call handleAuthentication function
                >
                  <Text style={styles.connectText}>Connect</Text>
                </TouchableOpacity>
              )}
            </View>
            {isConnecting && (
              <View style={styles.connectingLoader}>
                {/* Spinner components */}
                <View style={styles.connectingTo} id="connecting-to" />
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelAuthenticate}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingInternal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingImg: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: "80%",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  authenticate: {
    marginTop: 20,
    alignItems: "center",
  },
  hostPortContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  hostInput: {
    backgroundColor: "#262626",
    borderWidth: 1,
    borderColor: "#363636",
    color: "#e4e4e4",
    fontSize: 16,
    width: 150,
    height: 35,
    padding: 8,
    borderRadius: 4,
  },
  portInput: {
    backgroundColor: "#262626",
    borderWidth: 1,
    borderColor: "#363636",
    color: "#e4e4e4",
    fontSize: 16,
    width: 60,
    height: 35,
    padding: 8,
    borderRadius: 4,
  },
  passwordContainer: {
    marginBottom: 10,
  },
  dot: {
    width: 30,
    padding: 4,
    paddingTop: 25,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  label: {
    color: "#DDD",
    fontSize: 16,
    marginBottom: 2,
  },
  input: {
    backgroundColor: "#262626",
    borderWidth: 1,
    borderColor: "#363636",
    color: "#e4e4e4",
    fontSize: 16,
    width: 250,
    height: 35,
    padding: 8,
    borderRadius: 4,
  },
  connectButton: {
    backgroundColor: "#3d88f9",
    padding: 3,
    borderRadius: 4,
    width: 250,
    height: 35,
    marginTop: 10,
  },
  connectText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 20,
    textAlign: "center",
  },
  connectingLoader: {
    marginTop: 20,
    alignItems: "center",
  },
  connectingTo: {
    paddingTop: 20,
    fontWeight: "500",
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelText: {
    color: "#999",
    fontSize: 12,
  },
  errorMessageContainer: {
    position: "absolute",
    width: Dimensions.get("window").width - 350, // Adjust as needed
    height: "150",
    backgroundColor: "#ebebeb", // Adjust as needed
    padding: 10,
    top: -140,
    borderRadius: 5,
    textAlign: "center",
    zIndex: 999, // Ensure it's on top of other components
  },
  errorMessage: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default LoginPage;
