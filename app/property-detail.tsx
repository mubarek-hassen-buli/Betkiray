import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const { width, height } = Dimensions.get("window");

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
  const params = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: propertyDetails.image }}
          style={styles.headerImage}
          contentFit="cover"
        />

        {/* Header Controls */}
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="bookmark-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
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
        <ScrollView
          style={styles.tabContent}
          showsVerticalScrollIndicator={false}
        >
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
        </ScrollView>
      </View>

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
    position: "relative",
    height: height * 0.4,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerControls: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
  },
  propertyInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    color: "#888888",
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
  },
  period: {
    fontSize: 16,
    color: "#888888",
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
  },
  tabText: {
    fontSize: 16,
    color: "#888888",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000000",
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  voiceNoteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F8FF",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  voiceNoteLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  voiceNoteText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 8,
    fontWeight: "500",
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  mapImage: {
    width: "100%",
    height: 200,
  },
  featuresContainer: {
    paddingTop: 20,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  featureCardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginTop: 8,
  },
  featureDetails: {
    gap: 20,
  },
  featureDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  featureDetailLabel: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  featureDetailValue: {
    fontSize: 16,
    color: "#888888",
  },
  reviewsContainer: {
    paddingTop: 20,
  },
  reviewItem: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  reviewHeader: {
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  reviewerAvatar2: {
    backgroundColor: "#FF6B6B",
  },
  reviewerInitial: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  reviewTime: {
    fontSize: 14,
    color: "#888888",
  },
  reviewText: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 22,
  },
  addReviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3F2FD",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  addReviewText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  noReviewsText: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    paddingVertical: 40,
  },
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    paddingVertical: 16,
    borderRadius: 12,
  },
  callButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  chatButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 16,
    borderRadius: 12,
  },
  chatButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
