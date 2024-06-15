import SignupComponent from "@/components/signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpXpress - Create New Account",
};

/**
 * Represents the signup page of the application.
 * @returns {JSX.Element} The JSX element representing the signup page.
 */
export default function SignupPage(): JSX.Element {
  return <SignupComponent />;
}
