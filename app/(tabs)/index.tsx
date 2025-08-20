import { useAppState } from "@/contexts/AppStateContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const cities = ["Addis Ababa", "Nairobi", "Lagos"] as const;

const categories = ["All", "House", "Apartment", "Office"] as const;

export default function HomeScreen() {
  const { propertiesByCity } = useAppState();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] =
    useState<(typeof cities)[number]>("Addis Ababa");
  const [locationDropdownVisible, setLocationDropdownVisible] = useState(false);

  // Get properties for selected city
  const cityProperties = propertiesByCity[selectedCity] || [];

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
      onPress={() => router.push(`/property/${property.id}`)}
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
        onRequestClose={() => setLocationDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setLocationDropdownVisible(false)}
        >
          <View style={styles.locationDropdown}>
            <Text style={styles.dropdownTitle}>Select a City</Text>
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
                  setSelectedCategory("All");
                }}
              >
                <Text style={styles.locationOptionText}>{city}</Text>
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
        onRequestClose={() => setSearchVisible(false)}
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
            {filteredProperties.length === 0 ? (
              <Text>No results.</Text>
            ) : (
              filteredProperties.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={{ paddingVertical: 12 }}
                  onPress={() => {
                    setSearchVisible(false);
                    router.push(`/property/${p.id}`);
                  }}
                >
                  <Text style={{ fontWeight: "600", color: "#000" }}>
                    {p.title}
                  </Text>
                  <Text style={{ color: "#666" }}>{p.location}</Text>
                </TouchableOpacity>
              ))
            )}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  locationDropdown: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    width: width * 0.8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    color: "#000000",
  },
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "f0f0f0",
  },
  selectedLocationOption: {
    borderBottomColor: "#FF3B30",
  },
  locationOptionText: {
    fontSize: 16,
    color: "#888888",
    marginLeft: 12,
    flex: 1,
  },
  selectedLocationText: {
    color: "#000000",
    fontWeight: "500",
  },
});
