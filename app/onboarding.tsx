import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Background curved line */}
      <Image
        source={require("../assets/images/vector-2.png")}
        style={styles.backgroundVector}
        contentFit="contain"
      />

      {/* Key icons positioned around the screen */}
      <Image
        source={require("../assets/images/key.png")}
        style={[styles.keyIcon, styles.keyTop]}
        contentFit="contain"
      />

      <Image
        source={require("../assets/images/key.png")}
        style={[styles.keyIcon, styles.keyTopRight]}
        contentFit="contain"
      />

      <Image
        source={require("../assets/images/key.png")}
        style={[styles.keyIcon, styles.keyBottomLeft]}
        contentFit="contain"
      />

      <Image
        source={require("../assets/images/key.png")}
        style={[styles.keyIcon, styles.keyBottomRight]}
        contentFit="contain"
      />

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Find your next{"\n"}
          Space or list your{"\n"}
          property in seconds
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/onboarding2")}
        >
          <Text style={styles.buttonText}>Get started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    position: "relative",
  },
  backgroundVector: {
    position: "absolute",
    width: width * 1.2,
    height: height * 0.8,
    top: height * 0.1,
    left: -width * 0.1,
    opacity: 0.3,
  },
  keyIcon: {
    position: "absolute",
    width: 40,
    height: 40,
    opacity: 0.6,
  },
  keyTop: {
    top: height * 0.08,
    left: width * 0.4,
  },
  keyTopRight: {
    top: height * 0.18,
    right: width * 0.15,
  },
  keyBottomLeft: {
    bottom: height * 0.35,
    left: width * 0.08,
  },
  keyBottomRight: {
    bottom: height * 0.15,
    right: width * 0.08,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 32,
    paddingBottom: height * 0.12,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#ffffff",
    lineHeight: 40,
    marginBottom: 60,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
});
