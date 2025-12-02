import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { register } from "../api/api";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    try {
      const { token, user } = await register({ name, email, password });
      navigation.replace("HomeFeed", { token, user });
    } catch {
      alert("Err");
    }
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>Register</Text>
      <TextInput style={s.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={s.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Register" onPress={submit} />
    </View>
  );
}
const s = StyleSheet.create({
  container:{ flex:1, justifyContent:"center", padding:25 },
  title:{ fontSize:28, marginBottom:10 },
  input:{ background:"#fff", marginBottom:10, padding:10, borderRadius:6 }
});
