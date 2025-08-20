import { useAppState } from "@/contexts/AppStateContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const { width } = Dimensions.get("window");

type Billing = "Monthly" | "Weekly" | "Daily";

export default function AddScreen() {
  const { addProperty } = useAppState();

  const [step, setStep] = useState(1);

  // Step 1
  const [photos, setPhotos] = useState<string[]>([]);
  const [audioAdded, setAudioAdded] = useState(false);

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

  const goNext = () => {
    if (step === 2 && !title.trim()) {
      Alert.alert(
        "Add title",
        "Please enter a property title before continuing."
      );
      return;
    }
    if (step === 3 && !price.trim()) {
      Alert.alert("Add price", "Please enter a rental price.");
      return;
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const postProperty = () => {
    const id = addProperty({
      title: title || "Untitled Property",
      city: "Addis Ababa",
      location: address || "Addis Ababa",
      price: price || "ETB 0",
      period,
      bedrooms: `${rooms}-bed`,
      area: "20 m²",
      type,
      image: photos[0] || (undefined as unknown as string),
      images: photos,
      coords: { lat: coords.lat, lng: coords.lng },
      description,
    });
    router.replace(`/property/${id}`);
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
    <View style={styles.container}>
      {step === 1 && (
        <>
          <StepHeader
            icon="camera"
            tint="#3772FF"
            title="Add Photos of Your Property"
            subtitle="Upload up to 10 high-quality photos to showcase your space"
          />

          <View style={styles.cardUpload}>
            <TouchableOpacity
              style={styles.uploadTap}
              onPress={() =>
                Alert.alert("Upload", "Connect image picker here if desired.")
              }
            >
              <Ionicons name="cloud-upload-outline" size={28} color="#3772FF" />
              <Text style={styles.uploadTitle}>Tap to upload photos</Text>
              <Text style={styles.uploadHint}>or drag and drop</Text>
            </TouchableOpacity>
            <View style={styles.thumbRow}>
              <TouchableOpacity style={styles.thumbBox}>
                <Ionicons name="add" size={22} color="#888" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.thumbBox}>
                <Ionicons name="add" size={22} color="#888" />
              </TouchableOpacity>
            </View>
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

          <TouchableOpacity style={styles.primaryButton} onPress={goNext}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <StepHeader
            icon="home"
            tint="#22A06B"
            title="Property Details"
            subtitle="Tell us about your amazing space"
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Property Title</Text>
            <TextInput
              placeholder="e.g., Cozy Downtown Apartment"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              placeholder="Describe your property features, amenities, and what makes it special..."
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              multiline
              maxLength={500}
            />
            <Text style={styles.charCount}>
              {description.length}/500 characters
            </Text>
          </View>

          <Text style={[styles.label, { marginTop: 8 }]}>Property Type</Text>
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
                      ? "pricetag"
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
              <Text style={styles.counterLabel}>Number of Rooms</Text>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setRooms((v) => Math.max(0, v - 1))}
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
                  onPress={() => setBaths((v) => Math.max(0, v - 1))}
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

          <View style={[styles.inlineCard, { alignItems: "center" }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inlineTitle}>Furnished</Text>
              <Text style={styles.inlineSubtitle}>
                Is your property furnished?
              </Text>
            </View>
            <Switch value={furnished} onValueChange={setFurnished} />
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
        </>
      )}

      {step === 3 && (
        <>
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
        </>
      )}

      {step === 4 && (
        <>
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
              style={{ flex: 1 }}
              initialRegion={{
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
              />
            </MapView>
          </View>
          <Text style={[styles.hint, { marginTop: 8 }]}>
            Tap and drag to adjust pin location
          </Text>

          <View style={[styles.formGroup, { marginTop: 8 }]}>
            <Text style={styles.label}>Full Address</Text>
            <TextInput
              placeholder="Enter your property address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.postButton} onPress={postProperty}>
            <Ionicons name="home" size={18} color="#fff" />
            <Text style={styles.postButtonText}>Post My Property</Text>
          </TouchableOpacity>

          <View style={styles.navRow}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Ionicons name="arrow-back" size={18} color="#000" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 36,
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
    height: 180,
    borderWidth: 1,
    borderColor: "#E0E6EF",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FAFBFD",
    marginTop: 8,
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
  },
  postButtonText: { color: "#fff", fontWeight: "700" },
});
