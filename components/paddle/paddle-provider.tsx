"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { PADDLE_CLIENT_TOKEN, PADDLE_ENVIRONMENT } from "@/lib/paddle";

// Types for Paddle.js
interface PaddleInstance {
  Checkout: {
    open: (options: {
      items: Array<{ priceId: string; quantity?: number }>;
      customer?: { email?: string };
      customData?: Record<string, string>;
      settings?: {
        displayMode?: "overlay" | "inline";
        theme?: "light" | "dark";
        locale?: string;
        allowLogout?: boolean;
        successUrl?: string;
      };
    }) => void;
  };
  Environment: {
    set: (env: "sandbox" | "production") => void;
  };
  Initialize: (options: { token: string; eventCallback?: (event: PaddleEvent) => void }) => void;
}

interface PaddleEvent {
  name: string;
  data?: Record<string, unknown>;
}

interface PaddleContextType {
  paddle: PaddleInstance | null;
  isLoaded: boolean;
  openCheckout: (priceId: string, userEmail?: string) => void;
}

const PaddleContext = createContext<PaddleContextType>({
  paddle: null,
  isLoaded: false,
  openCheckout: () => {},
});

export function usePaddle() {
  return useContext(PaddleContext);
}

declare global {
  interface Window {
    Paddle?: PaddleInstance;
  }
}

export function PaddleProvider({ children }: { children: ReactNode }) {
  const [paddle, setPaddle] = useState<PaddleInstance | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Paddle.js script
    if (typeof window !== "undefined" && !window.Paddle) {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;

      script.onload = () => {
        if (window.Paddle) {
          // Set environment
          window.Paddle.Environment.set(PADDLE_ENVIRONMENT);

          // Initialize Paddle
          window.Paddle.Initialize({
            token: PADDLE_CLIENT_TOKEN,
            eventCallback: (event) => {
              console.log("Paddle event:", event);

              // Handle checkout completed
              if (event.name === "checkout.completed") {
                // Redirect to dashboard or success page
                window.location.href = "/dashboard?checkout=success";
              }
            },
          });

          setPaddle(window.Paddle);
          setIsLoaded(true);
        }
      };

      document.body.appendChild(script);
    } else if (window.Paddle) {
      setPaddle(window.Paddle);
      setIsLoaded(true);
    }
  }, []);

  const openCheckout = (priceId: string, userEmail?: string) => {
    if (!paddle) {
      console.error("Paddle not loaded");
      return;
    }

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: userEmail ? { email: userEmail } : undefined,
      settings: {
        displayMode: "overlay",
        theme: "light",
        locale: "fr",
        allowLogout: true,
        successUrl: `${window.location.origin}/dashboard?checkout=success`,
      },
    });
  };

  return (
    <PaddleContext.Provider value={{ paddle, isLoaded, openCheckout }}>
      {children}
    </PaddleContext.Provider>
  );
}
