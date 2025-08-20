import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.4;

const propertyDetails = {
  id: 2,
  title: "1 Room with Attached Bathroom",
  location: "Ayat, Addis Ababa",
  price: "ETB 10,000",
  period: "/month",
  image:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  description:
    "A beautifully designed studio apartment perfect for students. Located just 5 minutes walk from Ayat Condominium with all modern amenities included. The space features high ceilings, large windows, and contemporary furnishing.",
  mapImage:
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=200&fit=crop",
};

const tabs = ["Details", "Features", "Reviews", "Community"];

export default function PropertyDetailScreen() {
  const [selectedTab, setSelectedTab] = useState("Details");
  const scrollY = useRef(new Animated.Value(0)).current;
  const params = useLocalSearchParams();

  const headerImageStyle = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          outputRange: [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.5],
        }),
      },
      {
        scale: scrollY.interpolate({
          inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          outputRange: [2, 1, 1],
        }),
      },
    ],
  };

  const headerControlsOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header Image */}
      <Animated.View style={[styles.imageContainer, headerImageStyle]}>
        <Image
          source={{ uri: propertyDetails.image }}
          style={styles.headerImage}
          contentFit="cover"
        />
      </Animated.View>

      {/* Header Controls */}
      <Animated.View
        style={[styles.headerControls, { opacity: headerControlsOpacity }]}
      >
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="bookmark-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Content */}
      <Animated.ScrollView
        style={styles.contentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Property Info */}
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle}>{propertyDetails.title}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#FF3B30" />
            <Text style={styles.locationText}>{propertyDetails.location}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{propertyDetails.price}</Text>
            <Text style={styles.period}>{propertyDetails.period}</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
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
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>
                  {propertyDetails.description}
                </Text>
              </View>

              {/* Location */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.mapContainer}>
                  <Image
                    source={{ uri: propertyDetails.mapImage }}
                    style={styles.mapImage}
                    contentFit="cover"
                  />
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
              {/* Review Item 1 */}
              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerInfo}>
                    <View style={styles.reviewerAvatar}>
                      <Text style={styles.reviewerInitial}>S</Text>
                    </View>
                    <View>
                      <Text style={styles.reviewerName}>Sarah M.</Text>
                      <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                              key={star}
                              name="star"
                              size={16}
                              color="#FFD700"
                            />
                          ))}
                        </View>
                        <Text style={styles.reviewTime}>2 days ago</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewText}>
                  Perfect location and the landlord is very responsive. Water is
                  always available!
                </Text>
              </View>

              {/* Review Item 2 */}
              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerInfo}>
                    <View
                      style={[styles.reviewerAvatar, styles.reviewerAvatar2]}
                    >
                      <Text style={styles.reviewerInitial}>J</Text>
                    </View>
                    <View>
                      <Text style={styles.reviewerName}>John D.</Text>
                      <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                          {[1, 2, 3, 4].map((star) => (
                            <Ionicons
                              key={star}
                              name="star"
                              size={16}
                              color="#FFD700"
                            />
                          ))}
                          <Ionicons
                            name="star-outline"
                            size={16}
                            color="#FFD700"
                          />
                        </View>
                        <Text style={styles.reviewTime}>1 week ago</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewText}>
                  Great place for students. Very close to campus and
                  well-maintained.
                </Text>
              </View>

              {/* Add Review Button */}
              <TouchableOpacity style={styles.addReviewButton}>
                <Ionicons name="add" size={20} color="#007AFF" />
                <Text style={styles.addReviewText}>Add Review</Text>
              </TouchableOpacity>
            </View>
          )}

          {selectedTab === "Community" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Community</Text>
              <Text style={styles.noReviewsText}>
                Community features coming soon
              </Text>
            </View>
          )}
        </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerControls: {
    position: "absolute",
    top: 50,
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
  contentContainer: {
    marginTop: HEADER_HEIGHT,
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
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
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
  noReviewsText: {
    color: "#888888",
  },
  bottomActions: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  callButton: {
    flex: 1,
    marginRight: 12,
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
});
