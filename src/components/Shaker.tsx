import React, { Component } from "react";
import { Animated, ViewStyle } from "react-native";

/** ========================================================================
 * Types
 * =========================================================================
 */

interface IProps {
  style?: ViewStyle;
  children: JSX.Element;
  shouldShake?: boolean;
}

/** ========================================================================
 * React Class
 * =========================================================================
 */

class ShakerComponent extends Component<IProps, {}> {
  SHAKER: any = null;

  componentWillMount(): void {
    this.SHAKER = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps: IProps): void {
    if (nextProps.shouldShake) {
      this.shake();
    }
  }

  shake = () => {
    this.SHAKER.setValue(0);
    Animated.spring(this.SHAKER, {
      toValue: 1,
      friction: 3,
      tension: 10,
    }).start(() => {
      this.SHAKER.setValue(0);
    });
  };

  render(): any {
    const { style, children, ...rest } = this.props;

    const animatedStyle = {
      transform: [
        {
          translateY: this.SHAKER.interpolate({
            inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            outputRange: [0, 10, -15, 12, -9, 18, -7, 10, -11, 5, 0],
          }),
        },
        {
          translateX: this.SHAKER.interpolate({
            inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            outputRange: [0, 2, -3, 4, -4, 3, -3, 4, -5, 2, 0],
          }),
        },
      ],
    };

    return (
      <Animated.View {...rest} style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    );
  }
}

/** ========================================================================
 * Export
 * =========================================================================
 */

export default ShakerComponent;
