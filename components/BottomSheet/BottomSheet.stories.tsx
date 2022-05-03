import React, { useState, useEffect } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-web-linear-gradient";
import { ComponentMeta } from "@storybook/react";
import { NativeBaseProvider } from "native-base";

import { BottomSheet } from "./BottomSheet";

const PrimaryColor = "#eb1600";

export default {
  title: "BottomSheet",
  component: BottomSheet,
};

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const Default = () => {
  const [isSheetShown, setIsSheetShown] = useState(false);
  const [isDebugInfoShown, setIsDebugInfoShown] = useState(false);

  useEffect(() => {
    updateThemeHack("white");
  }, []);

  const handleToggleBottomSheet = () => {
    setIsSheetShown(!isSheetShown);
    updateThemeHack(isSheetShown ? "white" : "gray");
  };

  // TODO: implement Debug Info
  const handleToggleDebugInfo = () => {
    setIsDebugInfoShown(!isDebugInfoShown);
  };

  const bottomSheetToggles = () => {
    return (
      <View style={styles.togglesContainer}>
        <Button
          color={PrimaryColor}
          onPress={handleToggleBottomSheet}
          title="Toggle BottomSheet"
        />
        <View style={styles.gap} />
        <Button
          color={PrimaryColor}
          onPress={handleToggleDebugInfo}
          title="Toggle Debug Information"
        />
      </View>
    );
  };

  const content = () => {
    return (
      <LinearGradient
        colors={["#e56465", "#9296e2"]}
        style={styles.gradientContent}
      >
        <Text style={styles.contentText}>
          The user of this component can put whatever content they want in here,
          and it should be scrollable (without causing the sheet to pull up or
          down)!
        </Text>
      </LinearGradient>
    );
  };

  const handleDismiss = () => {
    setIsSheetShown(false);
    updateThemeHack("white");
  };

  const updateThemeHack = (color) => {
    const node = document.getElementById("background-color-hack");
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
    const element = document.createElement("style");
    element.setAttribute("id", "background-color-hack");
    element.innerHTML = `
      body {
        background-color: ${color};
      }
    `;
    const head = document.head;
    head.insertBefore(element, head.firstChild);
  };

  return (
    <NativeBaseProvider style={styles.container}>
      <Text style={styles.title}>Building a `BottomSheet` Component</Text>
      <Text style={styles.subTitle}>
        Click below to show the BottomSheet and play with it's behavior!
      </Text>
      {bottomSheetToggles()}
      <View style={styles.gap} />
      <Text style={styles.subTitle}>
        The API can be seen if you click on the "Docs" tab
      </Text>
      <View style={styles.largeGap} />
      {isSheetShown ? (
        <BottomSheet
          content={content}
          isWideScreen={windowWidth > 600}
          subtitle="Some more information here"
          title="My Custom Title"
          handleDismiss={handleDismiss}
        />
      ) : null}
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    paddingBottom: 24,
  },
  togglesContainer: {
    maxWidth: 300,
  },
  gap: {
    height: "1rem",
  },
  largeGap: {
    height: windowHeight / 1.5,
  },
  gradientContent: {
    height: 900,
    width: "100%",
    backgroundColor: PrimaryColor,
  },
  contentText: {
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
});
