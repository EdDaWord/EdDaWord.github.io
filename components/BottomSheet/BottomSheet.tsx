import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

type Props = {
  content: () => React.Node;
  subtitle: string;
  isWideScreen: boolean;
  title: string;
};

export const BottomSheet = ({
  content = () => {},
  subtitle,
  isWideScreen = true,
  title,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderNarrow = () => {
    return (
      <View>
        Narrow
        <View>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
        </View>
        {content()}
      </View>
    );
  };

  const renderWide = () => {
    return (
      <View>
        Wide
        <View>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
        </View>
        {content()}
      </View>
    );
  };

  return <View>{isWideScreen ? renderWide() : renderNarrow()}</View>;
};

const styles = StyleSheet.create((theme) => ({
  root: {
    minHeight: 200,
  },
}));

// TODO: use an SVG / Make this a TouchableHighlight
// TODO: separate to it's own component
const CloseButton = () => {
  const onPress = () => console.log("CLOSE ME");

  return <Button onPress={onPress} title="X" />;
};
