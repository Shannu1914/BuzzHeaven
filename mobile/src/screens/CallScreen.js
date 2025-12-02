import React from "react";
import { View, Text } from "react-native";

export default function CallScreen({ route }) {
  const { user, peerId } = route.params;

  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      <Text style={{ fontSize:24 }}>Calling {peerId}...</Text>
      <Text style={{ marginTop:10 }}>(WebRTC signalling handled via backend socket)</Text>
    </View>
  );
}
