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
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
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
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="#FF3B30" />
                  <Text style={styles.location}>{p.location}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="bed-outline" size={14} color="#888888" />
                    <Text style={styles.detailText}>{p.bedrooms}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="resize-outline" size={14} color="#888888" />
                    <Text style={styles.detailText}>{p.area}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <Text style={styles.price}>{p.price}</Text>
                  <Text style={styles.period}>{p.period}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.unbookmark}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleSaved(p.id);
                }}
              >
                <Ionicons name="heart" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 50,
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
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    height: 200,
    width: "100%",
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: "#888888",
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: "#888888",
    marginLeft: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  period: {
    fontSize: 14,
    color: "#888888",
  },
  unbookmark: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  bottomSpacing: {
    height: 20,
  },
});
