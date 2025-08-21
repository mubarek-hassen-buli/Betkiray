export const validatePropertyData = (data: any): string[] => {
  const errors: string[] = [];

  if (!data.title?.trim()) {
    errors.push("Property title is required");
  }

  if (!data.description?.trim()) {
    errors.push("Property description is required");
  }

  // Extract numeric value from formatted price (e.g., "ETB 1000" -> "1000")
  const priceMatch = data.price?.match(/[\d,]+/);
  const numericPrice = priceMatch ? Number(priceMatch[0].replace(/,/g, "")) : 0;

  if (!data.price || isNaN(numericPrice) || numericPrice <= 0) {
    errors.push("Valid price is required");
  }

  if (!data.address?.trim()) {
    errors.push("Property address is required");
  }

  if (!data.images || data.images.length !== 3) {
    errors.push("Exactly 3 images are required");
  }

  return errors;
};

export const simulatePropertyUpload = async (
  propertyData: any
): Promise<{ success: boolean; message: string }> => {
  // Simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 1000)
  );

  // Simulate occasional network errors (10% chance)
  if (Math.random() < 0.1) {
    throw new Error("Network error occurred");
  }

  // Validate data
  const errors = validatePropertyData(propertyData);
  if (errors.length > 0) {
    return {
      success: false,
      message: `Validation failed: ${errors.join(", ")}`,
    };
  }

  return {
    success: true,
    message: "Property uploaded successfully!",
  };
};

export const formatCurrency = (amount: string, city: string): string => {
  const numAmount = Number(amount);
  if (isNaN(numAmount)) return amount;

  switch (city) {
    case "Addis Ababa":
      return `ETB ${numAmount.toLocaleString()}`;
    case "Nairobi":
      return `KES ${numAmount.toLocaleString()}`;
    case "Lagos":
      return `₦ ${numAmount.toLocaleString()}`;
    default:
      return `${numAmount.toLocaleString()}`;
  }
};
