import React from "react";
import { ComponentMeta } from "@storybook/react";
import { NativeBaseProvider } from "native-base";

import { BottomSheet } from "./BottomSheet";

export default {
  component: BottomSheet,
  decorators: [
    (Story) => (
      <NativeBaseProvider>
        <Story />
      </NativeBaseProvider>
    ),
  ],
} as ComponentMeta<typeof BottomSheet>;

export const Basic = {
  args: {},
};
