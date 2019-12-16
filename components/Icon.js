import React from "react";
import { Image, Text } from "react-native";

const iconMap =  {
  timeline: require('../assets/timelineicone.png'),
  chat: require('../assets/chaticone.png'),
  profile: require('../assets/profileicone.png')
};

const Icon = ({ name, color, style, ...props }) => {
  const icon = iconMap[name];

  // <Text style={[{ fontSize: 30, color }, style]}>{icon}</Text>
  return <Image source={icon} style={[{ height: 40, width: 40 }, style]}/>
};

export default Icon;



