import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",
  // user: {
  //   additionalFields: {
  //     role: {
  //       type: "string",
  //     },
  //     isPremium: {
  //       type: "boolean",
  //       defaultValue: false,
  //       required: false,
  //     },
  //     premiumSince: {
  //       type: "date",
  //       required: false,
  //     }
  //   },
  // },
})
export const { signIn, signUp, useSession } = authClient()