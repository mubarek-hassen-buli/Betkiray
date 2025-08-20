import { useAppState } from "@/contexts/AppStateContext";
import { getPropertyById } from "@/data/properties";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const { width, height } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = Math.round(height * 0.4);
const HEADER_MIN_HEIGHT = 80;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const propertyId = Number(id);
  const property = useMemo(() => getPropertyById(propertyId), [propertyId]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState<
    "Details" | "Features" | "Reviews"
  >("Details");
  const { isSaved, toggleSaved } = useAppState();
  const [newReview, setNewReview] = useState("");
  const [reviews, setReviews] = useState<
    Array<{
      id: string;
      author: string;
      text: string;
      when: string;
      color?: string;
    }>
  >([
    {
      id: "r1",
      author: "Sarah M.",
      text: "Perfect location and the landlord is very responsive. Water is always available!",
      when: "2 days ago",
    },
    {
      id: "r2",
      author: "John D.",
      text: "Great place for students. Very close to campus and well-maintained.",
      when: "1 week ago",
      color: "#007AFF",
    },
  ]);

  if (!property) {
    return (
      <View style={styles.missingContainer}>
        <Text style={styles.missingText}>Property not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Parallax Header with Carousel */}
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <FlatList
          data={property.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri, idx) => `${uri}-${idx}`}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(index);
          }}
          renderItem={({ item: uri }) => (
            <View style={styles.carouselSlide}>
              <Image
                source={{ uri }}
                style={styles.headerImage}
                contentFit="cover"
              />
            </View>
          )}
        />

        {/* Carousel Indicators */}
        <View style={styles.carouselIndicators}>
          {property.images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeImageIndex && styles.activeDot]}
            />
          ))}
        </View>

        {/* Top controls */}
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => toggleSaved(property.id)}
          >
            <Ionicons
              name={isSaved(property.id) ? "bookmark" : "bookmark-outline"}
              size={24}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.ScrollView
        style={styles.contentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Property Info */}
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#FF3B30" />
            <Text style={styles.locationText}>{property.location}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{property.price}</Text>
            <Text style={styles.period}>{property.period}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {(["Details", "Features", "Reviews"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {selectedTab === "Details" && (
            <View>
              {/* Voice Note */}
              <TouchableOpacity style={styles.voiceNoteContainer}>
                <View style={styles.voiceNoteLeft}>
                  <Ionicons name="mic" size={20} color="#007AFF" />
                  <Text style={styles.voiceNoteText}>Voice Note</Text>
                </View>
                <TouchableOpacity style={styles.playButton}>
                  <Ionicons name="play" size={16} color="#ffffff" />
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Description */}
              {property.description ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {property.description}
                  </Text>
                </View>
              ) : null}

              {/* Interactive Map */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.mapContainer}>
                  <MapView
                    style={StyleSheet.absoluteFill}
                    initialRegion={{
                      latitude: property.coords.lat,
                      longitude: property.coords.lng,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: property.coords.lat,
                        longitude: property.coords.lng,
                      }}
                      title={property.title}
                      description={property.location}
                    />
                  </MapView>
                </View>
              </View>
            </View>
          )}

          {selectedTab === "Features" && (
            <View style={styles.featuresContainer}>
              {/* Feature Grid */}
              <View style={styles.featuresGrid}>
                <View style={styles.featureCard}>
                  <Ionicons name="bed-outline" size={32} color="#666666" />
                  <Text style={styles.featureCardText}>1 Bedroom</Text>
                </View>

                <View style={styles.featureCard}>
                  <Ionicons name="water-outline" size={32} color="#666666" />
                  <Text style={styles.featureCardText}>1 Bathroom</Text>
                </View>

                <View style={styles.featureCard}>
                  <Ionicons name="resize-outline" size={32} color="#666666" />
                  <Text style={styles.featureCardText}>45 m²</Text>
                </View>

                <View style={styles.featureCard}>
                  <Ionicons name="home-outline" size={32} color="#666666" />
                  <Text style={styles.featureCardText}>Furnished</Text>
                </View>
              </View>

              {/* Feature Details */}
              <View style={styles.featureDetails}>
                <View style={styles.featureDetailRow}>
                  <Text style={styles.featureDetailLabel}>Water Hours</Text>
                  <Text style={styles.featureDetailValue}>24/7 Available</Text>
                </View>
                <View style={styles.featureDetailRow}>
                  <Text style={styles.featureDetailLabel}>Campus Distance</Text>
                  <Text style={styles.featureDetailValue}>5 min walk</Text>
                </View>
                <View style={styles.featureDetailRow}>
                  <Text style={styles.featureDetailLabel}>WiFi Speed</Text>
                  <Text style={styles.featureDetailValue}>50 Mbps</Text>
                </View>
              </View>
            </View>
          )}

          {selectedTab === "Reviews" && (
            <View style={styles.reviewsContainer}>
              {reviews.map((r, idx) => (
                <View key={r.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <View
                        style={[
                          styles.reviewerAvatar,
                          idx === 1 && styles.reviewerAvatar2,
                          r.color ? { backgroundColor: r.color } : null,
                        ]}
                      >
                        <Text style={styles.reviewerInitial}>
                          {r.author.charAt(0)}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.reviewerName}>{r.author}</Text>
                        <View style={styles.ratingContainer}>
                          <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Ionicons
                                key={star}
                                name={
                                  idx === 1 && star === 5
                                    ? "star-outline"
                                    : "star"
                                }
                                size={16}
                                color="#FFD700"
                              />
                            ))}
                          </View>
                          <Text style={styles.reviewTime}>{r.when}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{r.text}</Text>
                </View>
              ))}

              {/* Add Review Input */}
              <View style={styles.addReviewContainer}>
                <View style={styles.addReviewInputWrapper}>
                  <Ionicons name="chatbubble-outline" size={18} color="#888" />
                  <TextInput
                    style={styles.newReviewInput}
                    placeholder="Add a review..."
                    value={newReview}
                    onChangeText={setNewReview}
                    multiline
                    numberOfLines={3}
                  />
                </View>
                <TouchableOpacity
                  style={styles.submitReviewButton}
                  onPress={() => {
                    const text = newReview.trim();
                    if (!text) return;
                    setReviews((prev) => [
                      {
                        id: `r${Date.now()}`,
                        author: "You",
                        text,
                        when: "Just now",
                        color: "#000",
                      },
                      ...prev,
                    ]);
                    setNewReview("");
                  }}
                >
                  <Text style={styles.submitReviewText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call" size={20} color="#ffffff" />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#000000" />
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  missingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 24,
  },
  missingText: {
    fontSize: 16,
    color: "#444444",
    marginBottom: 12,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#000000",
  },
  backBtnText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000000",
    overflow: "hidden",
    zIndex: 100,
    elevation: 10,
  },
  carouselSlide: {
    width,
    height: HEADER_MAX_HEIGHT,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerControls: {
    position: "absolute",
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 48,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  carouselIndicators: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeDot: {
    backgroundColor: "#ffffff",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  contentContainer: {
    marginTop: HEADER_MAX_HEIGHT,
    backgroundColor: "#ffffff",
  },
  propertyInfo: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  propertyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  locationRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666666",
  },
  priceRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
  },
  period: {
    marginLeft: 4,
    marginBottom: 2,
    fontSize: 14,
    color: "#666666",
  },
  // Tabs
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  activeTab: {
    backgroundColor: "#000000",
  },
  tabText: {
    fontSize: 14,
    color: "#000000",
  },
  activeTabText: {
    color: "#ffffff",
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  // Details tab
  voiceNoteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  voiceNoteLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  voiceNoteText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444444",
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
  },
  // Features tab
  featuresContainer: {
    marginTop: 8,
  },
  featuresGrid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#ffffff",
    alignItems: "center",
    marginBottom: 12,
  },
  featureCardText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666666",
  },
  featureDetails: {
    marginTop: 12,
  },
  featureDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  featureDetailLabel: {
    color: "#666666",
  },
  featureDetailValue: {
    color: "#000000",
    fontWeight: "600",
  },
  // Reviews tab
  reviewsContainer: {
    marginTop: 8,
  },
  reviewItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#ffffff",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reviewerAvatar2: {
    backgroundColor: "#007AFF",
  },
  reviewerInitial: {
    color: "#ffffff",
    fontWeight: "700",
  },
  reviewerName: {
    fontWeight: "600",
    color: "#000000",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  reviewTime: {
    color: "#888888",
  },
  reviewText: {
    marginTop: 8,
    color: "#444444",
    lineHeight: 20,
  },
  addReviewButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  addReviewText: {
    marginLeft: 8,
    color: "#007AFF",
    fontWeight: "600",
  },
  bottomActions: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  callButtonText: {
    marginLeft: 8,
    color: "#ffffff",
    fontWeight: "600",
  },
  chatButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  chatButtonText: {
    marginLeft: 8,
    color: "#000000",
    fontWeight: "600",
  },
  addReviewContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addReviewInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  newReviewInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 14,
    color: "#000",
  },
  submitReviewButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#000",
  },
  submitReviewText: {
    color: "#fff",
    fontWeight: "600",
  },
});
