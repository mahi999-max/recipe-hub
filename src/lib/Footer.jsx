
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChefHat,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Play,
  Github,
  ArrowUpRight,
  Heart,
  Globe,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Recipes", href: "/recipes" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" },
];


const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/",
    icon: Globe,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/",
    icon: Globe,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/",
    icon: Play,
  },
  {
    name: "GitHub",
    href: "https://github.com/",
    icon: Globe,
  },
];


const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.12,
      duration: 0.6,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-default-200 bg-background text-foreground">

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative mx-auto max-w-7xl px-5 pb-6 pt-14 sm:px-8 sm:pt-16 lg:px-10"
      >
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Logo & Description */}
          <motion.div variants={itemVariants}>
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2"
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: 12 }}
                whileTap={{ scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 12,
                }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
              >
                <ChefHat size={29} strokeWidth={2.2} />
              </motion.div>

              <span className="text-2xl font-extrabold tracking-tight">
                Recipe
                <span className="text-primary">Hub</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-default-500">
              Discover delicious recipes, explore new flavors, and
              bring happiness to your kitchen with RecipeHub.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-default-500">
              Made with
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex text-danger"
              >
                <Heart size={17} fill="currentColor" />
              </motion.span>
              for food lovers.
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-5 text-lg font-bold">Quick Links</h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-default-500 transition-colors duration-300 hover:text-primary"
                  >
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="inline-flex"
                    >
                      <ArrowUpRight
                        size={15}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </motion.span>

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-5 text-lg font-bold">
              Contact Information
            </h3>

            <div className="space-y-4">
              <motion.a
                whileHover={{ x: 5 }}
                href="mailto:hello@recipehub.com"
                className="flex items-start gap-3 text-sm text-default-500 transition-colors hover:text-primary"
              >
                <Mail
                  size={19}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span>hello@recipehub.com</span>
              </motion.a>

              <motion.a
                whileHover={{ x: 5 }}
                href="tel:+8801700000000"
                className="flex items-start gap-3 text-sm text-default-500 transition-colors hover:text-primary"
              >
                <Phone
                  size={19}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span>+880 1700-000000</span>
              </motion.a>

              <div className="flex items-start gap-3 text-sm text-default-500">
                <MapPin
                  size={19}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span>Bangladesh</span>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-5 text-lg font-bold">Follow Us</h3>

            <p className="mb-5 text-sm leading-6 text-default-500">
              Follow us for fresh recipes, cooking tips, and food
              inspiration.
            </p>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <motion.a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  title={name}
                  whileHover={{
                    scale: 1.15,
                    y: -4,
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 12,
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-default-200 bg-default-100/50 text-default-600 transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Copyright */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-default-200 pt-6 text-center sm:flex-row sm:text-left"
        >
          <p className="text-sm text-default-500">
            © 2026 RecipeHub. All rights reserved.
          </p>

          <motion.div
            whileHover={{ scale: 1.04 }}
            className="text-sm text-default-500"
          >
            Cook something
            <span className="mx-1 font-semibold text-primary">
              amazing
            </span>
            today!
          </motion.div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
