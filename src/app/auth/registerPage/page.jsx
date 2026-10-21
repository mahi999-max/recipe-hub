
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5 MB.");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setMessage("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!imageFile) {
      setMessage("Please select a profile image.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload image to ImgBB
      const formData = new FormData();
      formData.append("image", imageFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.url) {
        throw new Error(
          uploadResult.message || "Image upload failed."
        );
      }

      const imageUrl = uploadResult.url;

      // Step 2: Create account with Better Auth
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        image: imageUrl,
        role:"user",
        callbackURL: "/dashboard",
          isBlocked: false
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Registration failed."
        );
      }

      setMessage("Registration successful!");

      window.location.href = "/";
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Create Account
        </h1>

        <p className="text-center text-sm text-gray-500">
          Register to get started
        </p>

        {/* Profile Image */}
        <div className="flex flex-col items-center gap-3">
          {preview ? (
            <Image
              src={preview}
              alt="Profile preview"
              height={96}
              width={96}
              className="h-24 w-24 rounded-full border object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-500">
              No Photo
            </div>
          )}

          <label className="cursor-pointer rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200">
            Choose Profile Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            autoComplete="name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Message */}
        {message && (
          <p
            role="status"
            className="break-words text-sm text-blue-700"
          >
            {message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </main>
  );
}
