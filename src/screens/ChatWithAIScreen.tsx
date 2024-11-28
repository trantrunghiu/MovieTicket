import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import styled from 'styled-components';
import {COLORS, FONTFAMILY, SPACING} from '../themes/theme';
import GeminiChat from '../components/GeminiChat';
import FlashMessage from 'react-native-flash-message';
const ChatWithAIScreen = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <GeminiChat />
      <FlashMessage position={'top'} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ChatWithAIScreen;
