import { allPropertyData, City, Property } from "@/data/properties";
import React, { createContext, useContext, useMemo, useState } from "react";

export type AppState = {
  propertiesByCity: Record<City, Property[]>;
  savedIds: number[];
  isSaved: (id: number) => boolean;
  toggleSaved: (id: number) => void;
  addProperty: (property: Omit<Property, "id"> & { id?: number }) => number;
  getPropertyById: (id: number) => Property | undefined;
  getAllProperties: () => Property[];
};

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [propertiesByCity, setPropertiesByCity] =
    useState<Record<City, Property[]>>(allPropertyData);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  const isSaved = (id: number) => savedIds.includes(id);

  const toggleSaved = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getAllProperties = () =>
    (Object.keys(propertiesByCity) as City[]).flatMap(
      (c) => propertiesByCity[c]
    );

  const getPropertyById = (id: number) =>
    getAllProperties().find((p) => p.id === id);

  const addProperty: AppState["addProperty"] = (propertyInput) => {
    // Generate a new id if not provided
    const all = getAllProperties();
    const currentMax = all.length ? Math.max(...all.map((p) => p.id)) : 0;
    const newId = propertyInput.id ?? currentMax + 1;

    const city: City = propertyInput.city;
    const newProperty: Property = {
      ...propertyInput,
      id: newId,
      image: propertyInput.images?.[0] ?? propertyInput.image ?? "",
    } as Property;

    setPropertiesByCity((prev) => ({
      ...prev,
      [city]: [...(prev[city] ?? []), newProperty],
    }));

    return newId;
  };

  const value = useMemo(
    () => ({
      propertiesByCity,
      savedIds,
      isSaved,
      toggleSaved,
      addProperty,
      getPropertyById,
      getAllProperties,
    }),
    [propertiesByCity, savedIds]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
