import { useAppState } from "@/contexts/AppStateContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { simulatePropertyUpload, formatCurrency } from "@/utils/propertyUtils";

const { width } = Dimensions.get("window");

type Billing = "Monthly" | "Weekly" | "Daily";

export default function AddScreen() {
  const { addProperty } = useAppState();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1
  const [photos, setPhotos] = useState<string[]>([]);
  const [audioAdded, setAudioAdded] = useState(false);
  const [imageErrors, setImageErrors] = useState<string[]>([]);

  // Step 2
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<
    "House" | "Apartment" | "Office" | "Retail" | "Studio" | "Warehouse"
  >("House");
  const [rooms, setRooms] = useState(1);
  const [baths, setBaths] = useState(1);
  const [furnished, setFurnished] = useState(false);

  // Step 3
  const [price, setPrice] = useState("");
  const [billing, setBilling] = useState<Billing>("Monthly");
  const [negotiable, setNegotiable] = useState(false);
  const [includeUtilities, setIncludeUtilities] = useState(false);

  // Step 4
  const [coords, setCoords] = useState({ lat: 9.03, lng: 38.75 });
  const [address, setAddress] = useState("");

  const period = useMemo(() => {
    if (billing === "Monthly") return "/month";
    if (billing === "Weekly") return "/week";
    return "/day";
  }, [billing]);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll permissions to upload images."
        );
        return;
      }

      if (photos.length >= 3) {
        Alert.alert(
          "Maximum Images Reached",
          "You can only upload exactly 3 images. Please remove an existing image first."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri);
        const totalImages = photos.length + newImages.length;

        if (totalImages > 3) {
          const allowedCount = 3 - photos.length;
          Alert.alert(
            "Image Limit",
            `You can only add ${allowedCount} more image(s). Only the first ${allowedCount} will be selected.`
          );
          setPhotos((prev) => [...prev, ...newImages.slice(0, allowedCount)]);
        } else {
          setPhotos((prev) => [...prev, ...newImages]);
        }
        setImageErrors([]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick images. Please try again.");
    }
  };

  const removeImage = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        if (photos.length !== 3) {
          setImageErrors([
            `Please upload exactly 3 images of your property (currently ${photos.length}/3)`,
          ]);
          return false;
        }
        setImageErrors([]);
        return true;
      case 2:
        if (!title.trim()) {
          Alert.alert(
            "Add title",
            "Please enter a property title before continuing."
          );
          return false;
        }
        if (!description.trim()) {
          Alert.alert(
            "Add description",
            "Please add a description of your property."
          );
          return false;
        }
        return true;
      case 3:
        if (!price.trim()) {
          Alert.alert("Add price", "Please enter a rental price.");
          return false;
        }
        if (isNaN(Number(price)) || Number(price) <= 0) {
          Alert.alert("Invalid price", "Please enter a valid price amount.");
          return false;
        }
        return true;
      case 4:
        if (!address.trim()) {
          Alert.alert("Add address", "Please enter the property address.");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(4, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const postProperty = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    try {
      // Calculate area based on rooms (simple estimation)
      const estimatedArea = rooms * 25 + baths * 5;

      // Format price with currency
      const formattedPrice = formatCurrency(price, "Addis Ababa");

      const propertyData = {
        title: title.trim(),
        city: "Addis Ababa" as const,
        location: address.trim(),
        price: formattedPrice,
        period,
        bedrooms: rooms === 1 ? "Studio" : `${rooms}-bed`,
        area: `${estimatedArea} m²`,
        type,
        image: photos[0],
        images: photos,
        coords: { lat: coords.lat, lng: coords.lng },
        description: description.trim(),
        address: address.trim(),
      };

      // Simulate property upload with validation
      const result = await simulatePropertyUpload(propertyData);

      if (!result.success) {
        Alert.alert("Validation Error", result.message);
        return;
      }

      const id = addProperty(propertyData);

      Alert.alert(
        "Success!",
        "Your property has been posted successfully and is now live!",
        [
          {
            text: "View Property",
            onPress: () => router.replace(`/property-detail?id=${id}`),
          },
          {
            text: "Add Another",
            onPress: () => {
              // Reset form
              setStep(1);
              setPhotos([]);
              setTitle("");
              setDescription("");
              setPrice("");
              setAddress("");
              setAudioAdded(false);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Upload Failed",
        "Failed to post your property. Please check your internet connection and try again.",
        [{ text: "Retry", onPress: postProperty }, { text: "Cancel" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepHeader = ({
    icon,
    tint,
    title,
    subtitle,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    tint: string;
    title: string;
    subtitle: string;
  }) => (
    <>
      <View style={[styles.stepBarWrap]}>
        <Text style={styles.stepLabel}>Step {step} of 4</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${(step - 1) * 33.33 + 25}%` },
            ]}
          />
        </View>
      </View>
      <View style={[styles.heroIcon, { backgroundColor: `${tint}22` }]}>
        <Ionicons name={icon} size={26} color={tint} />
      </View>
      <Text style={styles.heroTitle}>{title}</Text>
      <Text style={styles.heroSubtitle}>{subtitle}</Text>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {step === 1 && (
          <>
            <StepHeader
              icon="camera"
              tint="#3772FF"
              title="Add Photos of Your Property"
              subtitle="Upload exactly 3 high-quality photos"
            />

            <View style={styles.cardUpload}>
              <TouchableOpacity
                style={[
                  styles.uploadTap,
                  photos.length >= 3 && styles.uploadTapDisabled,
                ]}
                onPress={pickImage}
                disabled={photos.length >= 3}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={28}
                  color={photos.length >= 3 ? "#ccc" : "#3772FF"}
                />
                <Text
                  style={[
                    styles.uploadTitle,
                    photos.length >= 3 && styles.uploadTitleDisabled,
                  ]}
                >
                  {photos.length >= 3
                    ? "3 images uploaded"
                    : "Tap to upload photos"}
                </Text>
                <Text
                  style={[
                    styles.uploadHint,
                    photos.length >= 3 && styles.uploadHintDisabled,
                  ]}
                >
                  {photos.length >= 3
                    ? "Maximum reached"
                    : "Select exactly 3 images"}
                </Text>
              </TouchableOpacity>

              {imageErrors.length > 0 && (
                <View style={styles.errorContainer}>
                  {imageErrors.map((error, index) => (
                    <Text key={index} style={styles.errorText}>
                      {error}
                    </Text>
                  ))}
                </View>
              )}

              <View style={styles.imageGrid}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <View key={index} style={styles.imageSlot}>
                    {photos[index] ? (
                      <View style={styles.imageContainer}>
                        <Image
                          source={{ uri: photos[index] }}
                          style={styles.uploadedImage}
                        />
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeImage(index)}
                        >
                          <Ionicons name="close" size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.emptySlot}
                        onPress={pickImage}
                      >
                        <Ionicons name="add" size={22} color="#888" />
                        <Text style={styles.slotText}>Photo {index + 1}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              <Text style={styles.imageCount}>
                {photos.length}/3 images uploaded
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                photos.length !== 3 && styles.primaryButtonDisabled,
              ]}
              onPress={goNext}
              disabled={photos.length !== 3}
            >
              <Text style={styles.primaryButtonText}>
                Next ({photos.length === 3 ? "✓" : `${photos.length}/3`})
              </Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <StepHeader
              icon="home"
              tint="#22A06B"
              title="Property Details"
              subtitle="Tell us about your amazing space"
            />

            <View style={styles.formGroup}>
              <Text style={styles.label}>Property Title *</Text>
              <TextInput
                placeholder="e.g., Cozy Downtown Apartment"
                value={title}
                onChangeText={setTitle}
                style={[styles.input, !title.trim() && styles.inputError]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                placeholder="Describe your property features, amenities, and what makes it special..."
                value={description}
                onChangeText={setDescription}
                style={[
                  styles.input,
                  styles.textArea,
                  !description.trim() && styles.inputError,
                ]}
                multiline
                maxLength={500}
              />
              <Text style={styles.charCount}>
                {description.length}/500 characters
              </Text>
            </View>

            <View style={styles.inlineCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inlineTitle}>Add Audio (Optional)</Text>
                <Text style={styles.inlineSubtitle}>
                  Let users hear more about your place
                </Text>
              </View>
              <TouchableOpacity
                style={styles.inlineButton}
                onPress={() => {
                  setAudioAdded(true);
                  Alert.alert("Audio", "Audio file uploaded (placeholder)");
                }}
              >
                <Text style={styles.inlineButtonText}>
                  {audioAdded ? "Added" : "Upload"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { marginTop: 16 }]}>Property Type</Text>
            <View style={styles.typeGrid}>
              {(
                [
                  "House",
                  "Apartment",
                  "Office",
                  "Retail",
                  "Studio",
                  "Warehouse",
                ] as const
              ).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, type === t && styles.typeChipActive]}
                  onPress={() => setType(t)}
                >
                  <Ionicons
                    name={
                      t === "House"
                        ? "home"
                        : t === "Apartment"
                        ? "business"
                        : t === "Office"
                        ? "briefcase"
                        : t === "Retail"
                        ? "storefront"
                        : t === "Studio"
                        ? "musical-notes"
                        : "cube"
                    }
                    size={18}
                    color={type === t ? "#fff" : "#555"}
                  />
                  <Text
                    style={[
                      styles.typeChipText,
                      type === t && styles.typeChipTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.counterRow}>
              <View style={styles.counterBox}>
                <Text style={styles.counterLabel}>Rooms</Text>
                <View style={styles.counterControls}>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => setRooms((v) => Math.max(1, v - 1))}
                  >
                    <Ionicons name="remove" size={18} color="#000" />
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{rooms}</Text>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => setRooms((v) => v + 1)}
                  >
                    <Ionicons name="add" size={18} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.counterBox}>
                <Text style={styles.counterLabel}>Bathrooms</Text>
                <View style={styles.counterControls}>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => setBaths((v) => Math.max(1, v - 1))}
                  >
                    <Ionicons name="remove" size={18} color="#000" />
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{baths}</Text>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => setBaths((v) => v + 1)}
                  >
                    <Ionicons name="add" size={18} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.furnishedCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inlineTitle}>Furnished</Text>
                <Text style={styles.inlineSubtitle}>
                  Is your property furnished?
                </Text>
              </View>
              <Switch
                value={furnished}
                onValueChange={setFurnished}
                trackColor={{ false: "#E0E6EF", true: "#22A06B" }}
                thumbColor={furnished ? "#fff" : "#f4f3f4"}
              />
            </View>

            <View style={styles.navRow}>
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Ionicons name="arrow-back" size={18} color="#000" />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButtonSmall}
                onPress={goNext}
              >
                <Text style={styles.primaryButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <StepHeader
              icon="cash"
              tint="#16C47F"
              title="Set Your Price"
              subtitle="What would you like to charge?"
            />

            <View style={styles.formGroup}>
              <Text style={styles.label}>Rental Price</Text>
              <View style={styles.priceInputRow}>
                <Text style={styles.currency}>$</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="0"
                  value={price}
                  onChangeText={setPrice}
                  style={[styles.input, { flex: 1, marginLeft: 8 }]}
                />
              </View>
            </View>

            <Text style={[styles.label, { marginTop: 8 }]}>Billing Period</Text>
            <View style={{ gap: 10 }}>
              {(["Monthly", "Weekly", "Daily"] as Billing[]).map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[
                    styles.billingRow,
                    billing === b && styles.billingRowActive,
                  ]}
                  onPress={() => setBilling(b)}
                >
                  <View
                    style={[
                      styles.billingIcon,
                      billing === b && { backgroundColor: "#2F6BFF" },
                    ]}
                  >
                    <Ionicons
                      name="calendar"
                      size={18}
                      color={billing === b ? "#fff" : "#6C6C6C"}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.billingTitle,
                        billing === b && { color: "#0B0B0B" },
                      ]}
                    >
                      {b}
                    </Text>
                    <Text style={styles.billingSub}>
                      {b === "Monthly"
                        ? "Per month"
                        : b === "Weekly"
                        ? "Per week"
                        : "Per day"}
                    </Text>
                  </View>
                  <View
                    style={[styles.radio, billing === b && styles.radioActive]}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.noticeRow, { backgroundColor: "#FFF6E5" }]}>
              <Ionicons name="hand-left" size={18} color="#F5A524" />
              <View style={{ flex: 1 }}>
                <Text style={styles.noticeTitle}>Negotiable</Text>
                <Text style={styles.noticeSub}>Open to price discussions</Text>
              </View>
              <Switch value={negotiable} onValueChange={setNegotiable} />
            </View>

            <View style={[styles.noticeRow, { backgroundColor: "#EFFFF6" }]}>
              <Ionicons name="flash" size={18} color="#16C47F" />
              <View style={{ flex: 1 }}>
                <Text style={styles.noticeTitle}>Include Utilities</Text>
                <Text style={styles.noticeSub}>
                  Water, electricity, internet, etc.
                </Text>
              </View>
              <Switch
                value={includeUtilities}
                onValueChange={setIncludeUtilities}
              />
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLeft}>Your listing price:</Text>
              <Text style={styles.summaryRight}>${price || 0}</Text>
            </View>

            <View style={styles.navRow}>
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Ionicons name="arrow-back" size={18} color="#000" />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButtonSmall}
                onPress={goNext}
              >
                <Text style={styles.primaryButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepContainer}>
            <StepHeader
              icon="pin"
              tint="#FF5C5C"
              title="Location & Contact"
              subtitle="Help renters find your property"
            />

            <Text style={[styles.label, { marginTop: 8 }]}>
              Property Location
            </Text>
            <View style={styles.mapCard}>
              <MapView
                style={styles.mapView}
                region={{
                  latitude: coords.lat,
                  longitude: coords.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={(e) =>
                  setCoords({
                    lat: e.nativeEvent.coordinate.latitude,
                    lng: e.nativeEvent.coordinate.longitude,
                  })
                }
                showsUserLocation={true}
                showsMyLocationButton={true}
              >
                <Marker
                  coordinate={{ latitude: coords.lat, longitude: coords.lng }}
                  draggable
                  onDragEnd={(e) =>
                    setCoords({
                      lat: e.nativeEvent.coordinate.latitude,
                      lng: e.nativeEvent.coordinate.longitude,
                    })
                  }
                  title="Property Location"
                  description="Drag to adjust location"
                />
              </MapView>
            </View>
            <Text style={[styles.hint, { marginTop: 8 }]}>
              Tap on map or drag marker to set exact location
            </Text>

            <View
              style={[styles.formGroup, { marginTop: 16, marginBottom: 20 }]}
            >
              <Text style={styles.label}>Full Address *</Text>
              <TextInput
                placeholder="Enter your property address"
                value={address}
                onChangeText={setAddress}
                style={[styles.input, !address.trim() && styles.inputError]}
                multiline={false}
                returnKeyType="done"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.postButton,
                isSubmitting && styles.postButtonDisabled,
              ]}
              onPress={postProperty}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="home" size={18} color="#fff" />
              )}
              <Text style={styles.postButtonText}>
                {isSubmitting ? "Posting..." : "Post My Property"}
              </Text>
            </TouchableOpacity>

            <View style={styles.navRow}>
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Ionicons name="arrow-back" size={18} color="#000" />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 20,
  },
  stepContainer: {
    paddingBottom: 100, // Extra space for navigation
  },
  stepBarWrap: {
    marginBottom: 12,
  },
  stepLabel: {
    textAlign: "center",
    color: "#6C6C6C",
    marginBottom: 6,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#E9ECEF",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    backgroundColor: "#2F6BFF",
  },
  heroIcon: {
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  heroTitle: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#0B0B0B",
  },
  heroSubtitle: {
    textAlign: "center",
    color: "#6C6C6C",
    marginTop: 6,
    marginBottom: 14,
  },
  cardUpload: {
    borderWidth: 1,
    borderColor: "#E0E6EF",
    borderRadius: 14,
    padding: 14,
  },
  uploadTap: {
    borderWidth: 1,
    borderColor: "#D7E2FF",
    backgroundColor: "#F3F7FF",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTitle: {
    color: "#2F6BFF",
    marginTop: 8,
    fontWeight: "600",
  },
  uploadHint: {
    color: "#6C6C6C",
    marginTop: 6,
  },
  thumbRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  thumbBox: {
    flex: 1,
    height: 110,
    borderWidth: 1,
    borderColor: "#E0E6EF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFBFD",
  },
  inlineCard: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E0E6EF",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  inlineTitle: { fontWeight: "700", color: "#0B0B0B" },
  inlineSubtitle: { color: "#6C6C6C", marginTop: 2 },
  inlineButton: {
    borderWidth: 1,
    borderColor: "#D7B3FF",
    backgroundColor: "#F7EDFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  inlineButtonText: { color: "#7A3EF2", fontWeight: "600" },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#000000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  primaryButtonDisabled: {
    backgroundColor: "#ccc",
  },
  primaryButtonSmall: {
    backgroundColor: "#2F6BFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: { color: "#ffffff", fontWeight: "700" },

  formGroup: { marginTop: 10 },
  label: { color: "#0B0B0B", fontWeight: "700", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#E0E6EF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#0B0B0B",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#FF5C5C",
    backgroundColor: "#FFF5F5",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  charCount: { alignSelf: "flex-end", color: "#9CA3AF", marginTop: 4 },

  typeGrid: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E6EF",
  },
  typeChipActive: {
    backgroundColor: "#2F6BFF",
    borderColor: "#2F6BFF",
  },
  typeChipText: { color: "#555" },
  typeChipTextActive: { color: "#fff", fontWeight: "600" },

  counterRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  counterBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E6EF",
    borderRadius: 12,
    padding: 12,
  },
  counterLabel: { color: "#0B0B0B", fontWeight: "700" },
  counterControls: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E6EF",
    alignItems: "center",
    justifyContent: "center",
  },
  counterValue: { fontWeight: "700", color: "#0B0B0B" },

  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  backButton: { flexDirection: "row", alignItems: "center", gap: 6 },
  backText: { color: "#000" },

  priceInputRow: { flexDirection: "row", alignItems: "center" },
  currency: { fontSize: 18, fontWeight: "700", color: "#0B0B0B" },
  billingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0E6EF",
  },
  billingRowActive: { backgroundColor: "#E7F0FF", borderColor: "#2F6BFF" },
  billingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2F2F3",
    alignItems: "center",
    justifyContent: "center",
  },
  billingTitle: { fontWeight: "700", color: "#6C6C6C" },
  billingSub: { color: "#9CA3AF" },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  radioActive: { borderColor: "#2F6BFF", backgroundColor: "#2F6BFF" },

  noticeRow: {
    marginTop: 12,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  noticeTitle: { fontWeight: "700", color: "#0B0B0B" },
  noticeSub: { color: "#6C6C6C" },

  summaryBox: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E0E6EF",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLeft: { color: "#6C6C6C" },
  summaryRight: { color: "#0B0B0B", fontWeight: "700" },

  mapCard: {
    height: 200,
    borderWidth: 1,
    borderColor: "#E0E6EF",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FAFBFD",
    marginTop: 8,
  },
  mapView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  hint: { color: "#9CA3AF" },

  postButton: {
    marginTop: 16,
    backgroundColor: "#16C47F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  postButtonDisabled: {
    backgroundColor: "#ccc",
  },
  postButtonText: { color: "#fff", fontWeight: "700" },

  // Image upload styles
  imageGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 12,
  },
  imageSlot: {
    flex: 1,
    height: 120,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptySlot: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: "#E0E6EF",
    borderStyle: "dashed",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFBFD",
  },
  slotText: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  uploadTapDisabled: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  uploadTitleDisabled: {
    color: "#ccc",
  },
  uploadHintDisabled: {
    color: "#ccc",
  },
  imageCount: {
    textAlign: "center",
    color: "#6C6C6C",
    marginTop: 8,
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FF5C5C",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  errorText: {
    color: "#FF5C5C",
    fontSize: 14,
    fontWeight: "500",
  },

  // Enhanced furnished card
  furnishedCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E0E6EF",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
