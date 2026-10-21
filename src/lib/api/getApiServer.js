import "server-only";
import { getapiAuth } from "../commonApi/serverApi";

export const getAllUsers = async () => {
  return getapiAuth("/api/allUsers");
};

export const getAllReports = async () => {
  return getapiAuth("/api/reports");
};