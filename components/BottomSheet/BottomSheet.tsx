import React from "react";
import {
  Animated,
  Button,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";

const ON_SWIPE_AWAY_DELAY = 300;
const PERCENTAGE_HID_WHEN_FULLY_OPENED = 0.125;

export const GripperPosition = {
  halfOpen: "half-open",
  fullOpen: "full-open",
  closed: "closed",
  drag: "drag",
};

type Props = {
  content: () => React.Node;
  subtitle: string;
  isWideScreen: boolean;
  title: string;
};

export class BottomSheet extends React.Component<Props, State> {
  pan = new Animated.ValueXY({ x: 0, y: 1000 });
  _windowHeightOutsideRender = 0;
  _sheetYInterpolation = {
    inputRange: [0, 0, 1],
    outputRange: [0, 0, 1],
  };

  static defaultProps = {
    content: () => {},
    isWideScreen: true,
  };

  constructor(props, state) {
    super(props);
    this.state = {
      gripperPosition: GripperPosition.halfOpen,
    };
    this._windowHeightOutsideRender = Dimensions.get("window").height;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.gripperPosition !== prevState.gripperPosition) {
      this._setTranslateY();
    }
  }

  render() {
    const { isWideScreen } = this.props;

    return isWideScreen ? this._renderWide() : this._renderNarrow();
  }

  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      this.pan.setOffset({
        y: this.pan.y._value,
      });
      this.setState({ gripperPosition: GripperPosition.drag });
    },
    onPanResponderMove: Animated.event([null, { dy: this.pan.y }]),
    onPanResponderRelease: (e, { moveY, vy }) => {
      const yValue = this.pan.y
        .interpolate(this._sheetYInterpolation)
        .__getValue();
      const midVelThreshold = 0.5;
      const highVelThreshold = 2;

      if (vy > highVelThreshold) {
        this.setState({ gripperPosition: GripperPosition.closed });
      } else if (vy < -highVelThreshold) {
        this.setState({ gripperPosition: GripperPosition.fullOpen });
      } else {
        if (yValue < this._windowHeightOutsideRender * 0.25) {
          if (vy > midVelThreshold) {
            this.setState({ gripperPosition: GripperPosition.halfOpen });
          } else {
            this.setState({ gripperPosition: GripperPosition.fullOpen });
          }
        } else if (yValue < this._windowHeightOutsideRender * 0.5) {
          if (vy < -midVelThreshold) {
            this.setState({ gripperPosition: GripperPosition.fullOpen });
          } else {
            this.setState({ gripperPosition: GripperPosition.halfOpen });
          }
        } else if (yValue < this._windowHeightOutsideRender * 0.75) {
          if (vy > midVelThreshold) {
            this.setState({ gripperPosition: GripperPosition.closed });
          } else {
            this.setState({ gripperPosition: GripperPosition.halfOpen });
          }
        } else {
          if (vy < -midVelThreshold) {
            this.setState({ gripperPosition: GripperPosition.halfOpen });
          } else {
            this.setState({ gripperPosition: GripperPosition.closed });
          }
        }
      }
      this.pan.flattenOffset();
    },
  });

  _setTranslateY() {
    if (this.state.gripperPosition === GripperPosition.fullOpen) {
      this._animateTo(
        this._windowHeightOutsideRender * PERCENTAGE_HID_WHEN_FULLY_OPENED
      );
    } else if (this.state.gripperPosition === GripperPosition.halfOpen) {
      this._animateTo(this._windowHeightOutsideRender / 2);
    } else if (this.state.gripperPosition === GripperPosition.closed) {
      setTimeout(this.props.onSwipedAway, ON_SWIPE_AWAY_DELAY);
      this._animateTo(this._windowHeightOutsideRender);
    }
  }

  _animateTo(yValue: number) {
    Animated.spring(this.pan, {
      toValue: { x: 0, y: yValue },
    }).start();
  }

  _renderNarrow() {
    this._setTranslateY();

    const { title, subtitle, content } = this.props;

    const DragBar = (
      <View style={styles.dragBarContainer}>
        <View style={styles.gripper} />
        <Text>{title}</Text>
        {subtitle ? <Text>{subtitle}</Text> : null}
      </View>
    );

    const dragableContent = (
      <Animated.View
        style={[
          styles.root,
          {
            width: "100%",
            height: "100%",
            transform: [
              {
                translateY: this.pan.y.interpolate(this._sheetYInterpolation),
              },
            ],
          },
        ]}
        {...this._panResponder.panHandlers}
      >
        {DragBar}
        {<ScrollView style={styles.contentContainer}>{content()}</ScrollView>}
      </Animated.View>
    );

    return dragableContent;
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
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
  },
  dragBarContainer: {
    backgroundColor: "white",
    topRightBorderRadius: 24,
    topLeftBorderRadius: 24,
  },
  contentContainer: {
    maxHeight: 600,
  },
  gripper: {
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
