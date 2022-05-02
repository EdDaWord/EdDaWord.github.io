import React from "react";
import { Button, StyleSheet, View } from "react-native";

type Props = {
  titleContent: () => React.Node;
  descriptionContent: () => React.Node;
  content: () => React.Node;
  isWideScreen: boolean;
};

export class BottomSheet extends React.Component<Props, State> {
  static defaultProps = {
    isWideScreen: true,
    titleContent: () => {},
    descriptionContent: () => {},
    content: () => {},
  };

  _renderNarrow() {
    const { titleContent, descriptionContent, content } = this.props;
    return (
      <View>
        <View>titleContent() descriptionContent()</View>
        Narrow content()
      </View>
    );
  }

  _renderWide() {
    const { titleContent, descriptionContent, content } = this.props;
    return (
      <View>
        <View>titleContent() descriptionContent()</View>
        Wide content()
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
