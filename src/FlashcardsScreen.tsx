import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import FlipCard from "react-native-flip-card";
import { NavigationScreenProp } from "react-navigation";
import { PRIMARY_BLUE, PRIMARY_RED } from "./Colors";
import WordSource, { Word } from "./WordSource";

export const { width, height } = Dimensions.get("window");

interface IProps {
  navigation: NavigationScreenProp<{}>;
}

export default class FlashcardsScreen extends React.Component<IProps, {}> {
  swiper: any = null;

  render(): JSX.Element {
    return (
      <View>
        <Swiper
          ref={this.handleAssignSwiperRef}
          cards={WordSource}
          renderCard={this.renderCard}
          onSwipedLeft={this.handleSwipeLeft}
          onSwipedRight={this.handleSwipeRight}
          onSwipedAll={this.handleSwipeAll}
          overlayLabels={{
            left: {
              title: "NOT YET",
              style: {
                label: {
                  backgroundColor: PRIMARY_RED,
                  borderColor: "black",
                  color: "white",
                  borderWidth: 1,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: -30,
                },
              },
            },
            right: {
              title: "GOT IT",
              style: {
                label: {
                  backgroundColor: PRIMARY_BLUE,
                  borderColor: "black",
                  color: "white",
                  borderWidth: 1,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
          }}
          infinite
          showSecondCard
          stackSize={WordSource.length}
          animateOverlayLabelsOpacity
          animateCardOpacity
          verticalSwipe={false}
          cardVerticalMargin={0}
          cardHorizontalMargin={0}
          marginTop={16}
        />
      </View>
    );
  }

  renderCard = (card: Word) => {
    if (card) {
      return (
        <ScrollView>
          <FlipCard
            style={styles.flipCard}
            perspective={1000}
            flipHorizontal={true}
            flipVertical={false}
          >
            <View style={styles.flipSide}>
              <Text style={styles.face}>{card.mandarin}</Text>
            </View>
            <View style={styles.flipSide}>
              <Text style={styles.back}>{card.pinyin}</Text>
              <Text style={[styles.back, { fontSize: 35, marginTop: 16 }]}>
                "{card.english}"
              </Text>
            </View>
          </FlipCard>
        </ScrollView>
      );
    }
  };

  handleSwipeLeft = (index: number) => {
    console.log("Swiping left, index: ", index);
  };

  handleSwipeRight = (index: number) => {
    console.log("Swiping right, index: ", index);
  };

  handleSwipeAll = (index: number) => {
    console.log("Swiping all, index: ", index);
  };

  handleAssignSwiperRef = (swiper: any) => {
    this.swiper = swiper;
  };
}

const styles = StyleSheet.create({
  flipCard: {
    backgroundColor: "white",
    alignItems: "center",
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 5,
      width: 5,
    },
    width: width - 20,
    height: height - 200,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 0,
  },
  flipSide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  face: {
    fontSize: 75,
    textAlign: "center",
    width: width - 40,
    color: PRIMARY_RED,
  },
  back: {
    fontSize: 50,
    textAlign: "center",
    width: width - 40,
    color: PRIMARY_BLUE,
  },
});
