import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

type Props = {
  content: () => React.Node;
  subtitle: string;
  isWideScreen: boolean;
  title: string;
};

export class BottomSheet extends React.Component<Props, State> {
  static defaultProps = {
    content: () => {},
    isWideScreen: true,
  };

  _renderNarrow() {
    const { title, subtitle, content } = this.props;
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
  }

  _renderWide() {
    const { title, subtitle, content } = this.props;
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
  }

  render() {
    const { isWideScreen } = this.props;

    return (
      <View>{isWideScreen ? this._renderWide() : this._renderNarrow()}</View>
    );
  }
}

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
