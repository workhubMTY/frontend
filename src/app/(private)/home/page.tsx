"use client";

import PageTransition from "@/app/shared/components/PageTransition/PageTransition";
import { useAuth } from "@/app/shared/auth/useAuth";

import { useHomePage } from "@/app/features/home/hooks/useHomePage";
import { HomePageLayout } from "@/app/features/home/components/Layouts/HomePageLayout";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";

  return "Buenas noches";
}

export default function Home() {
  const { user } = useAuth();

  const homePage = useHomePage();

  return (
    <PageTransition>
      <HomePageLayout name={user?.name} {...homePage} />
    </PageTransition>
  );
}