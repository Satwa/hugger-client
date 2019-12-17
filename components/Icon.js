import React from "react";
import { Image, Text } from "react-native";

const iconMap =  {
  timeline: require('../assets/timelineicon.png'),
  chat: require('../assets/chaticon.png'),
  profile: require('../assets/profileicon.png')
};

const Icon = ({ name, color, style, ...props }) => {
  const icon = iconMap[name];

  // <Text style={[{ fontSize: 30, color }, style]}>{icon}</Text>
  return <Image source={icon} style={[{ height: 30, width: 30 }, style]} resizeMode="contain"/>
};

export default Icon;



