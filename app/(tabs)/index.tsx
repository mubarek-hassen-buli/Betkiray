import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TextInput,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const allPropertyData = {
  "Addis Ababa": [
    {
      id: 1,
      title: "Luxury 2BHK Apartment",
      location: "CMC, Addis Ababa",
      price: "ETB 20,000",
      period: "/month",
      bedrooms: "2-bed",
      area: "100 m²",
      type: "Apartment",
      city: "Addis Ababa",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "1 Room with Attached Bathroom",
      location: "Ayat, Addis Ababa",
      price: "ETB 10,000",
      period: "/month",
      bedrooms: "Bathroom",
      area: "16 m²",
      type: "House",
      city: "Addis Ababa",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Cozy Studio Apartment",
      location: "CMC, Addis Ababa",
      price: "ETB 18,000",
      period: "/month",
      bedrooms: "Studio",
      area: "24 m²",
      type: "Apartment",
      city: "Addis Ababa",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Modern Office Space",
      location: "Bole, Addis Ababa",
      price: "ETB 25,000",
      period: "/month",
      bedrooms: "Office",
      area: "50 m²",
      type: "Office",
      city: "Addis Ababa",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    },
    {
      id: 9,
      title: "Family House with Garden",
      location: "Sarbet, Addis Ababa",
      price: "ETB 35,000",
      period: "/month",
      bedrooms: "3-bed",
      area: "150 m²",
      type: "House",
      city: "Addis Ababa",
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
    },
  ],
  Nairobi: [
    {
      id: 5,
      title: "Modern 3BR House",
      location: "Westlands, Nairobi",
      price: "KES 45,000",
      period: "/month",
      bedrooms: "3-bed",
      area: "120 m²",
      type: "House",
      city: "Nairobi",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Executive Apartment",
      location: "Karen, Nairobi",
      price: "KES 35,000",
      period: "/month",
      bedrooms: "2-bed",
      area: "85 m²",
      type: "Apartment",
      city: "Nairobi",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    },
    {
      id: 10,
      title: "Corporate Office Suite",
      location: "Upper Hill, Nairobi",
      price: "KES 60,000",
      period: "/month",
      bedrooms: "Office",
      area: "100 m²",
      type: "Office",
      city: "Nairobi",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop",
    },
    {
      id: 11,
      title: "Penthouse Apartment",
      location: "Kilimani, Nairobi",
      price: "KES 55,000",
      period: "/month",
      bedrooms: "3-bed",
      area: "140 m²",
      type: "Apartment",
      city: "Nairobi",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    },
  ],
  Lagos: [
    {
      id: 7,
      title: "Luxury Villa",
      location: "Victoria Island, Lagos",
      price: "₦ 150,000",
      period: "/month",
      bedrooms: "4-bed",
      area: "200 m²",
      type: "House",
      city: "Lagos",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    },
    {
      id: 8,
      title: "Business Office",
      location: "Ikeja, Lagos",
      price: "₦ 80,000",
      period: "/month",
      bedrooms: "Office",
      area: "75 m²",
      type: "Office",
      city: "Lagos",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop",
    },
    {
      id: 12,
      title: "Waterfront Apartment",
      location: "Lekki, Lagos",
      price: "₦ 120,000",
      period: "/month",
      bedrooms: "2-bed",
      area: "90 m²",
      type: "Apartment",
      city: "Lagos",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    },
    {
      id: 13,
      title: "Suburban Family Home",
      location: "Ajah, Lagos",
      price: "₦ 95,000",
      period: "/month",
      bedrooms: "3-bed",
      area: "180 m²",
      type: "House",
      city: "Lagos",
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
    },
  ],
};

const cities = ["Addis Ababa", "Nairobi", "Lagos"];

const categories = ["All", "House", "Apartment", "Office"];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Addis Ababa");
  const [locationDropdownVisible, setLocationDropdownVisible] = useState(false);

  // Get properties for selected city
  const cityProperties = allPropertyData[selectedCity] || [];

  // Filter properties based on category and search
  const filteredProperties = useMemo(() => {
    let filtered = cityProperties;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (property) => property.type === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [cityProperties, selectedCategory, searchQuery]);

  const renderPropertyCard = (property: (typeof cityProperties)[0]) => (
    <TouchableOpacity
      key={property.id}
      style={styles.propertyCard}
      onPress={() =>
        router.push({
          pathname: "/property-detail",
          params: { id: property.id },
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.image }}
          style={styles.propertyImage}
          contentFit="cover"
        />
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{property.type}</Text>
        </View>
      </View>

      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle}>{property.title}</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#FF3B30" />
          <Text style={styles.locationText}>{property.location}</Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="bed-outline" size={14} color="#888888" />
            <Text style={styles.detailText}>{property.bedrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="resize-outline" size={14} color="#888888" />
            <Text style={styles.detailText}>{property.area}</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{property.price}</Text>
          <Text style={styles.period}>{property.period}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.locationHeader}
          onPress={() => setLocationDropdownVisible(true)}
        >
          <Ionicons name="location-outline" size={20} color="#888888" />
          <Text style={styles.locationHeaderText}>{selectedCity}</Text>
          <Ionicons name="chevron-down-outline" size={16} color="#888888" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setSearchVisible(true)}
        >
          <Ionicons name="search-outline" size={20} color="#888888" />
        </TouchableOpacity>
      </View>

      {/* Location Dropdown Modal */}
      <Modal
        visible={locationDropdownVisible}
        animationType="fade"
        transparent={true}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setLocationDropdownVisible(false)}
        >
          <View style={styles.locationDropdown}>
            {cities.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.locationOption,
                  selectedCity === city && styles.selectedLocationOption,
                ]}
                onPress={() => {
                  setSelectedCity(city);
                  setLocationDropdownVisible(false);
                  setSelectedCategory("All"); // Reset category when changing city
                }}
              >
                <Ionicons name="location-outline" size={18} color="#888888" />
                <Text
                  style={[
                    styles.locationOptionText,
                    selectedCity === city && styles.selectedLocationText,
                  ]}
                >
                  {city}
                </Text>
                {selectedCity === city && (
                  <Ionicons name="checkmark" size={18} color="#000000" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Search Modal */}
      <Modal
        visible={searchVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.searchModal}>
          <View style={styles.searchHeader}>
            <TouchableOpacity
              onPress={() => setSearchVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.searchTitle}>Search Properties</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color="#888888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by title or location..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#888888" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.searchResults}>
            {filteredProperties.map(renderPropertyCard)}
          </ScrollView>
        </View>
      </Modal>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollView}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.activeCategoryTab,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Property List */}
      <ScrollView
        style={styles.propertyList}
        showsVerticalScrollIndicator={false}
      >
        {filteredProperties.map(renderPropertyCard)}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationHeaderText: {
    fontSize: 16,
    color: "#000000",
    marginLeft: 8,
    marginRight: 4,
    fontWeight: "500",
  },
  searchButton: {
    padding: 8,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryScrollView: {
    paddingRight: 20,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  activeCategoryTab: {
    backgroundColor: "#000000",
  },
  categoryText: {
    fontSize: 14,
    color: "#888888",
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#ffffff",
  },
  propertyList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  propertyCard: {
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
  },
  imageContainer: {
    position: "relative",
  },
  propertyImage: {
    width: "100%",
    height: 250,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#000000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#000000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  typeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
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
  locationText: {
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
  priceRow: {
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
  bottomSpacing: {
    height: 100,
  },
  searchModal: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  closeButton: {
    padding: 4,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  placeholder: {
    width: 32,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    marginLeft: 12,
  },
  searchResults: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
