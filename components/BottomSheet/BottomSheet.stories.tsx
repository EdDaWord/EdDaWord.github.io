import React, { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
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

  const handleToggle = () => {
    setIsSheetShown(true);
  };

  const handleDismiss = () => {
    setIsSheetShown(false);
  };

  const { width: windowWidth } = Dimensions.get("window");

  return (
    <NativeBaseProvider>
      <Text style={styles.title}>Building a `BottomSheet` Component</Text>
      <Text style={styles.subTitle}>
        Click below to show the bottom sheet and play with it's behavior
      </Text>
      <View style={styles.exampleContainer}>
        <Button
          color={PrimaryColor}
          onPress={handleToggle}
          title="Toggle BottomSheet"
        />
        <View style={styles.divider} />
        <Button
          color={PrimaryColor}
          onPress={handleToggle}
          title="Toggle Debug Information"
        />
        <View style={styles.divider} />
        <Button
          color={PrimaryColor}
          onPress={handleDismiss}
          title="Dismiss Bottomsheet"
        />
        {isSheetShown ? <BottomSheet isWideScreen={windowWidth > 600} /> : null}
      </View>
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
  exampleContainer: {
    maxWidth: 300,
  },
  divider: {
    height: "1rem",
  },
});
