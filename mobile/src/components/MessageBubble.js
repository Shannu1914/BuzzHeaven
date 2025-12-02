import React from "react";
import { Text } from "react-native";
export default ({ fromMe, text }) => (
  <Text style={{ textAlign: fromMe ? "right" : "left" }}>{text}</Text>
);
