import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenContentWrapper } from "../../components/ScreenContentWrapper";

export default function AddScreen() {
  return (
    <ScreenContentWrapper>
      <View style={styles.container}>
        <Text style={styles.text}>Add Property</Text>
      </View>
    </ScreenContentWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
});
