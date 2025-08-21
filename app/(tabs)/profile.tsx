import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

const { width, height } = Dimensions.get("window");

// Mock user data
const defaultUserData = {
  name: "Priya Sharma",
  phone: "+91 98765 43210",
  email: "priya.sharma@email.com",
  avatar:
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
  stats: {
    properties: 12,
    totalViews: "1.2k",
    saved: 8,
  },
};

const mockListings = [
  {
    id: 1,
    title: "2BHK in Bandra",
    price: "₹45,000/month",
    views: "124 views",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Office Space",
    price: "₹80,000/month",
    views: "89 views",
    status: "Rented",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Studio Apartment",
    price: "₹25,000/month",
    views: "156 views",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
  },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("My Listings");
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(height));

  const showSettings = () => {
    setSettingsVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const hideSettings = () => {
    Animated.spring(slideAnim, {
      toValue: height,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setSettingsVisible(false);
    });
  };

  const renderListingCard = (listing: (typeof mockListings)[0]) => (
    <TouchableOpacity key={listing.id} style={styles.listingCard}>
      <Image
        source={{ uri: listing.image }}
        style={styles.listingImage}
        contentFit="cover"
      />
      <View style={styles.statusBadge}>
        <Text
          style={[
            styles.statusText,
            listing.status === "Available"
              ? styles.availableStatus
              : styles.rentedStatus,
          ]}
        >
          {listing.status}
        </Text>
      </View>
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle}>{listing.title}</Text>
        <Text style={styles.listingPrice}>{listing.price}</Text>
        <View style={styles.listingStats}>
          <Ionicons name="eye-outline" size={14} color="#888888" />
          <Text style={styles.listingViews}>{listing.views}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={showSettings}>
          <Ionicons name="settings-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: defaultUserData.avatar }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.onlineIndicator} />
          </View>

          <Text style={styles.userName}>{defaultUserData.name}</Text>
          <Text style={styles.userPhone}>{defaultUserData.phone}</Text>
          <Text style={styles.userEmail}>{defaultUserData.email}</Text>

          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={16} color="#000000" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {defaultUserData.stats.properties}
            </Text>
            <Text style={styles.statLabel}>Properties</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {defaultUserData.stats.totalViews}
            </Text>
            <Text style={styles.statLabel}>Total Views</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{defaultUserData.stats.saved}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {["My Listings", "Saved", "Contacts"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={styles.tabContent}>
          {activeTab === "My Listings" && (
            <View style={styles.listingsGrid}>
              {mockListings.map(renderListingCard)}
              <TouchableOpacity style={styles.addNewCard}>
                <Ionicons name="add" size={32} color="#888888" />
                <Text style={styles.addNewText}>Add New</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "Saved" && (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={48} color="#888888" />
              <Text style={styles.emptyText}>No saved properties</Text>
            </View>
          )}

          {activeTab === "Contacts" && (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#888888" />
              <Text style={styles.emptyText}>No contacts yet</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        visible={settingsVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideSettings}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={hideSettings}
        >
          <Animated.View
            style={[
              styles.settingsModal,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHandle} />

              <Text style={styles.modalTitle}>Settings</Text>

              <View style={styles.settingsOptions}>
                <TouchableOpacity style={styles.settingItem}>
                  <Ionicons name="person-outline" size={20} color="#000000" />
                  <Text style={styles.settingText}>Edit Profile</Text>
                  <Ionicons name="chevron-forward" size={16} color="#888888" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#000000"
                  />
                  <Text style={styles.settingText}>Change Password</Text>
                  <Ionicons name="chevron-forward" size={16} color="#888888" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#000000"
                  />
                  <Text style={styles.settingText}>Notifications</Text>
                  <Ionicons name="chevron-forward" size={16} color="#888888" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <Ionicons name="shield-outline" size={20} color="#000000" />
                  <Text style={styles.settingText}>Privacy</Text>
                  <Ionicons name="chevron-forward" size={16} color="#888888" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.settingItem, styles.logoutItem]}
                >
                  <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                  <Text style={[styles.settingText, styles.logoutText]}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={hideSettings}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#00C851",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: "#888888",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 16,
    color: "#888888",
    marginBottom: 20,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    color: "#000000",
    marginLeft: 6,
    fontWeight: "500",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F0F0F0",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#888888",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#000000",
  },
  tabText: {
    fontSize: 14,
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
    paddingTop: 20,
  },
  listingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  listingCard: {
    width: (width - 60) / 2,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listingImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#ffffff",
  },
  availableStatus: {
    backgroundColor: "#00C851",
  },
  rentedStatus: {
    backgroundColor: "#FF3B30",
  },
  listingInfo: {
    padding: 12,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 12,
    color: "#888888",
    marginBottom: 8,
  },
  listingStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  listingViews: {
    fontSize: 12,
    color: "#888888",
    marginLeft: 4,
  },
  addNewCard: {
    width: (width - 60) / 2,
    height: 180,
    marginBottom: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addNewText: {
    fontSize: 14,
    color: "#888888",
    marginTop: 8,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#888888",
    marginTop: 12,
  },
  bottomSpacing: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  settingsModal: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    minHeight: 400,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginBottom: 30,
  },
  settingsOptions: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    marginLeft: 16,
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  logoutText: {
    color: "#FF3B30",
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
});
