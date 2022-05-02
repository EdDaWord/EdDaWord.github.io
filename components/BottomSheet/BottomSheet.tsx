import React from "react";
import {
  Animated,
  Button,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  content: () => React.Node;
  subtitle: string;
  isWideScreen: boolean;
  title: string;
};

const { height: windowHeight } = Dimensions.get("window");

export class BottomSheet extends React.Component<Props, State> {
  _panResponder = {};

  static defaultProps = {
    content: () => {},
    isWideScreen: true,
  };

  constructor(props) {
    super(props);
    this.state = { translateY: 0 };
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderTerminationRequest: () => true,
    });
  }

  _handlePanResponderMove = (e, gestureState) => {
    this.setState((state) => ({
      ...state,
      translateY: gestureState.dy,
    }));
  };

  _renderNarrow() {
    const transform = { transform: [{ translateY: this.state.translateY }] };
    const { title, subtitle, content } = this.props;
    return (
      <Animated.View style={styles.root} {...this.panResponder.panHandlers}>
        <View style={[styles.container, transform]}>
          <View style={styles.dragbar} />
          <View>
            <Text>{title}</Text>
            <Text>{subtitle}</Text>
          </View>
          {content()}
        </View>
      </Animated.View>
    );
  }

  _renderWide() {
    const { title, subtitle, content } = this.props;
    return (
      <View>
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

    return isWideScreen ? this._renderWide() : this._renderNarrow();
  }
}

const styles = StyleSheet.create({
  root: {
    height: windowHeight,
    width: "100%",
    position: "absolute",
    backgroundColor: "white",
    top: windowHeight * 0.66,
    borderRadius: 24,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 24,
  },
  dragbar: {
    width: 80,
    height: 4,
    backgroundColor: "gray",
    alignSelf: "center",
    marginVertical: 12,
    borderRadius: 9999,
  },
});

// TODO: use an SVG / Make this a TouchableHighlight
// TODO: separate to it's own component
const CloseButton = () => {
  const onPress = () => console.log("CLOSE ME");

  return <Button onPress={onPress} title="X" />;
};
