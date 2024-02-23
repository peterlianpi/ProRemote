import React, { createContext, useContext, useEffect, useState } from "react";

// Create a context for the connection provider
const ConnectionContext = createContext();

// Custom hook to access the connection context
export const useConnection = () => useContext(ConnectionContext);

// Connection provider component
export const ConnectionProvider = ({ children }) => {
  // State variables for managing connection and authentication
  const [authenticated, setAuthenticated] = useState(false);
  const [retryConnection, setRetryConnection] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [host, setHost] = useState("192.168.100.100");
  const [port, setPort] = useState("8080");
  const [password, setPassword] = useState("password");
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [message, setMessage] = useState(""); // State to store error message

  // Function to establish a WebSocket connection
  const connect = () => {
    setIsConnected(false);
    setRetryConnection(false);
    const wsUri = `ws://${host}:${port}/remote`;
    const websocket = new WebSocket(wsUri);
    setWs(websocket);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
    websocket.onerror = onError;
  };

  // Event handler for when the WebSocket connection is opened
  const onOpen = () => {
    setIsConnected(true);
    setRetryConnection(true);
    console.log("Connection established to ", host + ":" + port);
  };

  // Event handler for incoming WebSocket messages
  const onMessage = (evt) => {
    const obj = JSON.parse(evt.data);
    setMessage(obj);
    console.log(obj);
    if (obj.type === "authentication_result") {
      if (obj.success) {
        console.log("Authentication successfully");
        setAuthenticated(true);
      } else {
        console.log("Authentication failed");
        setAuthenticated(false);
      }
    }
  };

  // Event handler for WebSocket errors
  const onError = (evt) => {
    setAuthenticated(false);
    console.error("Socket encountered error: ", evt.message, "Closing socket");
    setIsConnected(false);
  };

  // Event handler for when the WebSocket connection is closed
  const onClose = () => {
    console.log("Socket closed");
    setAuthenticated(false);
    setIsConnected(false);

    // Retry connection every second if retryConnection is still enabled
    // Uncomment the following lines if you want automatic reconnection
    // if (isConnected) {
    //   setTimeout(connect, 1000);
    // }
    // Refresh library after 5 minutes of disconnection
    // Uncomment the following lines if you want to refresh after a certain time
    // setTimeout(() => {
    //   setRefresh(true);
    // }, 300000);
  };

  // Function to handle authentication process
  const authenticate = () => {
    console.log("Authentication");
    if (!authenticated) {
      if (ws) {
        ws.send(
          JSON.stringify({
            action: "authenticate",
            protocol: "701",
            password: password,
          })
        );
      } else {
        console.log("WebSocket connection not established");
      }
    } else {
      console.log("Already authenticated");
    }
  };

  // Function to cancel the authentication process and close the WebSocket connection
  const cancelAuthenticate = () => {
    setRetryConnection(false);
    if (ws) {
      ws.close();
    }
  };

  // Function to send data through the WebSocket connection
  const sendData = (data) => {
    if (ws) {
      ws.send(JSON.stringify(data));
    } else {
      console.error("WebSocket connection not established.");
    }
  };

  // Context provider value
  const providerValue = {
    authenticated,
    retryConnection,
    refresh,
    authenticate,
    cancelAuthenticate,
    sendData,
    host,
    setHost,
    port,
    setPort,
    password,
    setPassword,
    isConnected,
    setIsConnected,
    connect,
    isConnecting,
    setIsConnecting,
    ws,
    message,
    setMessage,
  };

  // Provide the context value to the children components
  return (
    <ConnectionContext.Provider value={providerValue}>
      {children}
    </ConnectionContext.Provider>
  );
};
