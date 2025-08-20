import { useAppState } from "@/contexts/AppStateContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SavedScreen() {
  const { savedIds, getAllProperties, toggleSaved } = useAppState();
  const saved = getAllProperties().filter((p) => savedIds.includes(p.id));

  return (
    <View style={styles.container}>
      {saved.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={48} color="#888888" />
          <Text style={styles.emptyText}>No saved properties yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {saved.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.card}
              onPress={() => router.push(`/property/${p.id}`)}
            >
              <Image
                source={{ uri: p.image }}
                style={styles.image}
                contentFit="cover"
              />
              <View style={styles.info}>
                <Text style={styles.title}>{p.title}</Text>
                <Text style={styles.location}>{p.location}</Text>
                <View style={styles.row}>
                  <Text style={styles.price}>{p.price}</Text>
                  <Text style={styles.period}>{p.period}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.unbookmark}
                onPress={() => toggleSaved(p.id)}
              >
                <Ionicons name="bookmark" size={22} color="#FF3B30" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 12,
    color: "#888888",
    fontSize: 16,
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    height: 160,
    width: "100%",
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  location: {
    marginTop: 4,
    color: "#666",
  },
  row: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  price: {
    fontWeight: "700",
    color: "#000",
  },
  period: {
    color: "#666",
  },
  unbookmark: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
