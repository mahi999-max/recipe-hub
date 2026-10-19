"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    UserRound,
    Mail,
    Camera,
    Save,
    Crown,
    ShieldCheck,
    LoaderCircle,
    ChefHat,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    console.log("profile: ",user);

    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // isPremium er jonno alada state nilam jate database theke direct fetch kore set kora jay
    const [isPremium, setIsPremium] = useState(false);

    // Session user ba Database theke isPremium check korar logic
    // Session user ba Database theke isPremium check korar logic
    useEffect(() => {
        if (user?.email) {
            // ১. প্রথমে সেশন বা লোকাল চেক
            if (user.isPremium || user.Premium) {
                setIsPremium(true);
            }

            // ২. সরাসরি ব্যাকএন্ড থেকে ইউজারের লেটেস্ট প্রিমিয়াম স্ট্যাটাস ফেচ করা
            fetch(`http://localhost:5000/api/user-status?email=${user.email}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data?.isPremium) {
                        setIsPremium(true);
                    }
                })
                .catch((err) => console.error("Status check error:", err));
        }
    }, [user?.email]);

    // Name এবং Image সেট করার জন্য
    useEffect(() => {
        if (user) {
            if (user.name) setName(user.name);
            if (user.image) setImage(user.image);
        }
    }, [user]);
    
    const handleSubscribe = async () => {
        try {
            const res = await fetch("/api/checkout_sessions", {
                method: "POST",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Unable to start checkout"
                );
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert(error.message || "Checkout failed");
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setMessage("Please select a valid image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage("Image must be 5 MB or smaller.");
            return;
        }

        setSelectedFile(file);
        setImage(URL.createObjectURL(file));
        setMessage("");
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setMessage("");

        if (!name.trim()) {
            setMessage("Name cannot be empty.");
            return;
        }

        setSaving(true);

        try {
            let imageUrl = user?.image || "";

            if (selectedFile) {
                const formData = new FormData();
                formData.append("image", selectedFile);

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const uploadResult = await uploadResponse.json();

                if (!uploadResponse.ok) {
                    throw new Error(
                        uploadResult.message || "Image upload failed"
                    );
                }

                imageUrl = uploadResult.url;
            }

            const { error } = await authClient.updateUser({
                name: name.trim(),
                ...(selectedFile ? { image: imageUrl } : {}),
            });

            if (error) {
                throw new Error(
                    error.message || "Profile update failed"
                );
            }

            setImage(imageUrl);
            setSelectedFile(null);
            setMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Profile update error:", error);
            setMessage(error.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    if (isPending) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoaderCircle className="animate-spin" size={32} />
            </div>
        );
    }
   
    if (!user) {
        return (
            <div className="mx-auto max-w-lg px-6 py-20 text-center">
                <UserRound className="mx-auto mb-4" size={42} />
                <h1 className="text-2xl font-bold">Please log in</h1>
                <p className="mt-2 text-gray-500">
                    Log in to view and edit your profile.
                </p>
                <a
                    href="/auth/signin"
                    className="mt-5 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white"
                >
                    Go to Login
                </a>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <p className="font-semibold text-orange-500">
                        RECIPEHUB ACCOUNT
                    </p>
                    <h1 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        My Profile
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Manage your account and discover Premium.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Profile card */}
                    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-3 sm:p-8">
                        <div className="flex flex-col items-center gap-5 border-b border-gray-100 pb-7 dark:border-gray-800 sm:flex-row">
                            <div className="relative h-28 w-28 shrink-0">
                                {image ? (
                                    <Image
                                        src={image}
                                        alt="Profile image"
                                        fill
                                        unoptimized
                                        className="rounded-full border-4 border-orange-100 object-cover"
                                        sizes="112px"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                        <UserRound size={48} />
                                    </div>
                                )}

                                <label
                                    htmlFor="profile-image"
                                    className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-orange-500 p-2 text-white shadow-md"
                                    title="Change profile image"
                                >
                                    <Camera size={17} />
                                </label>

                                <input
                                    id="profile-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>

                            <div className="min-w-0 text-center sm:text-left">
                                <h2 className="break-words text-2xl font-bold text-gray-900 dark:text-white">
                                    {user.name || "Recipe Lover"}
                                </h2>
                                <p className="mt-1 break-all text-sm text-gray-500">
                                    {user.email}
                                </p>

                                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    {isPremium ? (
                                        <>
                                            <Crown
                                                size={16}
                                                className="text-amber-500"
                                            />
                                            Premium Member
                                            <ShieldCheck
                                                size={15}
                                                className="text-amber-500"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <ChefHat size={16} />
                                            Free Member
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="mt-7 space-y-5">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Full Name
                                </label>
                                <div className="relative">
                                    <UserRound
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        id="name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        maxLength={100}
                                        required
                                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-950"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    Email Address
                                </label>
                                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                                    <Mail size={18} />
                                    <span className="break-all">
                                        {user.email}
                                    </span>
                                    <span className="ml-auto text-xs">
                                        Read-only
                                    </span>
                                </div>
                            </div>

                            {selectedFile && (
                                <p className="text-sm text-orange-600">
                                    New image selected. Save to upload it.
                                </p>
                            )}

                            {message && (
                                <p
                                    role="status"
                                    className="text-sm text-gray-600 dark:text-gray-300"
                                >
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={saving}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {saving ? (
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Save size={18} />
                                )}
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </section>

                    {/* Premium card */}
                    <aside className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 p-6 text-white shadow-lg lg:col-span-2 sm:p-8">
                        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
                        <div className="relative">
                            <div className="mb-5 inline-flex rounded-2xl bg-white/15 p-3">
                                <Crown size={32} />
                            </div>

                            <p className="text-sm font-bold tracking-widest text-orange-100">
                                RECIPEHUB PREMIUM
                            </p>

                            <h2 className="mt-3 text-3xl font-extrabold">
                                Cook beyond ordinary.
                            </h2>

                            <p className="mt-3 leading-7 text-orange-50">
                                Unlock exclusive recipes and enjoy your premium cooking journey.
                            </p>

                            <ul className="mt-6 space-y-3 text-sm">
                                <li>✓ Exclusive premium recipes</li>
                                © <li>✓ Premium member badge</li>
                                <li>✓ A richer RecipeHub experience</li>
                            </ul>

                            {isPremium ? (
                                <div className="mt-8 rounded-xl bg-white/15 p-4 font-semibold flex items-center">
                                    <ShieldCheck className="mr-2 inline" size={20} />
                                    You are a Premium Member!
                                </div>
                            ) : (
                                <div className="mt-8 rounded-xl bg-white/15 p-4">
                                    <p className="font-bold">Yearly Premium Plan</p>
                                    <p className="mt-1 text-sm text-orange-100">
                                        Subscription pricing will be shown at Stripe checkout.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleSubscribe}
                                        className="mt-4 w-full rounded-xl bg-white px-5 py-3 font-bold text-orange-600 hover:bg-orange-50 transition"
                                    >
                                        Become a Premium Member
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}