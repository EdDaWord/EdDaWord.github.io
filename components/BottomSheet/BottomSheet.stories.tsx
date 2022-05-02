import React, { useState } from "react";
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

export const Default = () => {
  const [isSheetShown, setIsSheetShown] = useState(false);
  const [isDebugInfoShown, setIsDebugInfoShown] = useState(false);
  const { width: windowWidth } = Dimensions.get("window");

  const handleToggleBottomSheet = () => {
    setIsSheetShown(!isSheetShown);
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
        <View style={styles.divider} />
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

  return (
    <NativeBaseProvider>
      <Text style={styles.title}>Building a `BottomSheet` Component</Text>
      <Text style={styles.subTitle}>
        Click below to show the BottomSheet and play with it's behavior!
      </Text>
      {bottomSheetToggles()}
      {isSheetShown ? (
        <BottomSheet
          content={content}
          isWideScreen={windowWidth > 600}
          subtitle="Some more information here"
          title="My Custom Title"
        />
      ) : null}
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    paddingBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    paddingBottom: 24,
  },
  togglesContainer: {
    maxWidth: 300,
  },
  divider: {
    height: "1rem",
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
