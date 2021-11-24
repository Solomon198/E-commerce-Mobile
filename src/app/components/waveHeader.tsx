import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';

type Props = {
  customStyles: any;
  customHeight: number;
  customTop: number;
  customBgColor: string;
  customWavePattern: any;
};

export default function WavyHeader(props: Props) {
  return (
    <View style={props.customStyles}>
      <View
        style={{
          backgroundColor: props.customBgColor,
          height: props.customHeight,
        }}>
        <Svg
          height="40%"
          width="100%"
          viewBox="0 0 1440 220"
          style={[styles.svg, {top: props.customTop}]}>
          <Path fill={props.customBgColor} d={props.customWavePattern} />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  svg: {position: 'absolute'},
});
