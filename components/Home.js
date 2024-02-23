import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HomePage = () => {
  return (
    <View>
      <Text style={styles.text}>Testing Home</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto",
    color: "#e2e2e2",
  },
});
export default HomePage;
