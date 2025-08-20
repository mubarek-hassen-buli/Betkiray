import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to onboarding screen
  return <Redirect href="/onboarding" />;
}
