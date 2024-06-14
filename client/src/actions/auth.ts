"use server";

import axios from "@/config/axios.config";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

type AuthParam = { email: string; password: string };

type AuthResponse = { message: string; success: boolean };

/**
 * Logs in a user with the provided credentials.
 *
 * @param {AuthParam} credentials - The login credentials.
 * @returns {Promise<AuthResponse>} The response indicating the login status.
 */
export async function login(credentials: AuthParam): Promise<AuthResponse> {
  try {
    const { data } = await axios.post<AuthResponse & { token: string }>(
      "/auth/login",
      credentials,
    );

    if (data.success) {
      cookies().set("opxpress_access_token", data.token);
      return {
        message: "Login successful",
        success: true,
      };
    }

    throw new Error(JSON.stringify(data));
  } catch (error) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message
        : "Some error occurred";
    return {
      message,
      success: false,
    };
  }
}
``;

/**
 * Signs up a user with the provided credentials.
 *
 * @param {AuthParam} credentials - The signup credentials.
 * @returns {Promise<AuthResponse>} The response indicating the signup status.
 */
export async function signup(credentials: AuthParam): Promise<AuthResponse> {
  try {
    const { data } = await axios.post<AuthResponse>(
      "/auth/signup",
      credentials,
    );

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Some error occurred";
    return {
      message,
      success: false,
    };
  }
}

/**
 * Logs out the currently logged-in user.
 *
 * @returns {Promise<AuthResponse>} The response indicating the logout status.
 */
export async function logout(): Promise<AuthResponse> {
  cookies().delete("opxpress_access_token");
  return {
    success: true,
    message: "Logged out successfully",
  };
}
