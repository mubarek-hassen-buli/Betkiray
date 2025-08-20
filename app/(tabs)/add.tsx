import { useAppState } from "@/contexts/AppStateContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddScreen() {
  const { addProperty } = useAppState();
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("Addis Ababa");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [period, setPeriod] = useState("/month");
  const [imageUrl, setImageUrl] = useState("");

  const onSubmit = () => {
    if (!title || !city || !location || !price) {
      Alert.alert(
        "Missing info",
        "Please fill in title, city, location and price"
      );
      return;
    }
    const id = addProperty({
      title,
      city: city as any,
      location,
      price,
      period,
      bedrooms: "Studio",
      area: "20 m²",
      type: "Apartment",
      image: imageUrl || (undefined as any),
      images: imageUrl ? [imageUrl] : [],
      coords: { lat: 9.03, lng: 38.75 },
      description: "Newly added property",
    });
    router.replace(`/property/${id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Property</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Title"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="City (Addis Ababa | Nairobi | Lagos)"
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          placeholder="Location"
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />
        <TextInput
          placeholder="Price (e.g. ETB 10,000)"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
        />
        <TextInput
          placeholder="Period (e.g. /month)"
          style={styles.input}
          value={period}
          onChangeText={setPeriod}
        />
        <TextInput
          placeholder="Image URL (optional)"
          style={styles.input}
          value={imageUrl}
          onChangeText={setImageUrl}
        />
        <TouchableOpacity style={styles.submit} onPress={onSubmit}>
          <Text style={styles.submitText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginTop: 12,
    marginBottom: 12,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#000",
  },
  submit: {
    marginTop: 8,
    backgroundColor: "#000",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 14,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
});
