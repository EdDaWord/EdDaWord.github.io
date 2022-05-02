import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { ComponentMeta } from "@storybook/react";
import { NativeBaseProvider } from "native-base";

import { BottomSheet } from "./BottomSheet";

const PrimaryColor = "#eb1600";

export default {
  component: BottomSheet,
  decorators: [
    (Story) => (
      <NativeBaseProvider>
        <Text style={styles.title}>Building a `BottomSheet` Component</Text>
        <Text style={styles.subTitle}>
          Click below to show the bottom sheet and play with it's behavior
        </Text>
        <View style={styles.exampleContainer}>
          <Button color={PrimaryColor} title="Toggle BottomSheet" />
          <View style={styles.divider} />
          <Button color={PrimaryColor} title="Toggle Debug Information" />
          <View style={styles.divider} />
        </View>
        <Story />
      </NativeBaseProvider>
    ),
  ],
} as ComponentMeta<typeof BottomSheet>;

export const Default = {
  args: {},
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
