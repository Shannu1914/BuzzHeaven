import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { getFeed } from "../api/api";
import PostCard from "../components/PostCard";

export default function HomeFeedScreen({ navigation, route }) {
  const { token, user } = route.params;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getFeed(token).then(res => setPosts(res.data));
  }, []);

  return (
    <ScrollView style={{ padding: 15 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Welcome {user.name}</Text>
      {posts.map(p => <PostCard key={p._id} post={p} />)}
      <Button title="Messages" onPress={() => navigation.navigate("Chat", { user, token })} />
    </ScrollView>
  );
}
