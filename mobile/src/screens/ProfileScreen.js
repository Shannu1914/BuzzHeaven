import React from "react";
import { View, Text } from "react-native";

export default function ProfileScreen({ route }) {
  const { user } = route.params;
  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      <Text style={{ fontSize: 24 }}>{user.name}</Text>
      <Text>{user.email}</Text>
    </View>
  );
}
