"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/stores/auth.store";

export function useAuthBootstrap() {
  const refreshUser = useAuthStore((state) => state.refreshUser);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);
}