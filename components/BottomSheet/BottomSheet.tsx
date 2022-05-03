import React from "react";
import {
  Animated,
  Button,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

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
  handleDismiss: () => {};
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
        this.props.handleDismiss();
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
            this.props.handleDismiss();
            this.setState({ gripperPosition: GripperPosition.closed });
          } else {
            this.setState({ gripperPosition: GripperPosition.halfOpen });
          }
        } else {
          if (vy < -midVelThreshold) {
            this.setState({ gripperPosition: GripperPosition.halfOpen });
          } else {
            this.props.handleDismiss();
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
      this.props.handleDismiss();
      this._animateTo(this._windowHeightOutsideRender);
    }
  }

  _animateTo(yValue: number) {
    Animated.spring(this.pan, {
      toValue: { x: 0, y: yValue },
    }).start();
  }

  _closeButton = () => {
    const onPress = () =>
      this.setState({ gripperPosition: GripperPosition.closed });

    return (
      <TouchableHighlight style={styles.closeButton} onPress={onPress}>
        <View style={{ width: 24, height: 24 }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L13.4142 12L18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L12 13.4142L17.2929 18.7071Z"
              fill="#191919"
            />
          </svg>
        </View>
      </TouchableHighlight>
    );
  };

  _renderNarrow() {
    this._setTranslateY();

    const { title, subtitle, content } = this.props;

    const DragBar = (
      <View style={styles.dragBarContainer}>
        {this._closeButton()}
        <View style={styles.gripper} />
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
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
        {<ScrollView>{content()}</ScrollView>}
      </Animated.View>
    );

    return dragableContent;
  }

  _renderWide() {
    const { title, subtitle, content } = this.props;
    return (
      <Modal transparent visible>
        <View>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
        </View>
        {content()}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    height: 800,
  },
  dragBarContainer: {
    backgroundColor: "white",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  subtitle: {
    alignSelf: "center",
    paddingBottom: 4,
  },
  gripper: {
    width: 80,
    height: 4,
    backgroundColor: "gray",
    alignSelf: "center",
    marginVertical: 12,
    borderRadius: 9999,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 8,
  },
});
