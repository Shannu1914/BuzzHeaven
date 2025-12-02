import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { socket } from "../socket/socket";

export default function ChatScreen({ route, navigation }) {
  const { user } = route.params;
  const [peerId, setPeerId] = useState("");
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    socket.connect();
    socket.emit("register", { userId: user._id });
    socket.on("receiveMessage", m => setMessages(ms => [...ms, m]));
    return () => socket.disconnect();
  }, []);

  function send() {
    socket.emit("sendMessage", {
      senderId: user._id, receiverId: peerId, message: msg
    });
    setMessages(ms => [...ms, { senderId: user._id, message: msg }]);
    setMsg("");
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView style={{ flex: 1, marginBottom: 10 }}>
        {messages.map((m,i) => (
          <Text key={i} style={{ textAlign: m.senderId === user._id ? "right" : "left" }}>
            {m.message}
          </Text>
        ))}
      </ScrollView>

      <TextInput placeholder="Peer ID" value={peerId} onChangeText={setPeerId} />
      <TextInput placeholder="Message" value={msg} onChangeText={setMsg} />
      <Button title="Send" onPress={send} />
      <Button title="Call" onPress={() => navigation.navigate("Call", { user, peerId })} />
    </View>
  );
}
