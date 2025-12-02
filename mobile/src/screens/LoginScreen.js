import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { login } from "../api/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    try {
      const { token, user } = await login(email, password);
      navigation.replace("HomeFeed", { token, user });
    } catch {
      alert("Invalid credentials");
    }
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>Login</Text>
      <TextInput style={s.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={submit} />
      <Text style={s.link} onPress={() => navigation.navigate("Register")}>Create account</Text>
    </View>
  );
}
const s = StyleSheet.create({
  container:{ flex:1, justifyContent:"center", padding:25 },
  title:{ fontSize:28, marginBottom:10 },
  input:{ background:"#fff", marginBottom:10, padding:10, borderRadius:6 },
  link:{ textAlign:"center", marginTop:8, color:"blue" }
});
