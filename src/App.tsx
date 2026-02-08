import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import DemoBanner from "@/components/DemoBanner";
import { isTauri } from "@/lib/isTauri";

const Index = lazy(() => import("./pages/Index"));
const DevTerminal = lazy(() => import("./pages/DevTerminal"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const isDesktop = isTauri();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeSwitcher />
        {/* V0 (web): show demo banner; V1 (desktop): skip it */}
        {!isDesktop && <DemoBanner />}
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dev" element={<DevTerminal />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
