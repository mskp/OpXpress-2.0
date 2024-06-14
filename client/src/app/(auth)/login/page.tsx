import LoginComponent from "@/components/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpXpress | Login",
};

/**
 * Represents the login page of the application.
 * @returns {JSX.Element} The JSX element representing the login page.
 */
export default function LoginPage(): JSX.Element {
  return <LoginComponent />;
}
