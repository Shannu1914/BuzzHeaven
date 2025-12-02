import React from "react";
import { View, Text } from "react-native";

export default function PostCard({ post }) {
  return (
    <View style={{ background:"white", padding:12, marginBottom:10, borderRadius:8 }}>
      <Text style={{ fontWeight:"bold" }}>{post.author?.name}</Text>
      <Text>{post.text}</Text>
    </View>
  );
}
