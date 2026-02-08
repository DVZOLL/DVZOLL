import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-primary/20 group-[.toaster]:shadow-[0_0_20px_hsl(var(--primary)/0.15),0_8px_32px_rgba(0,0,0,0.4)] group-[.toaster]:rounded-2xl group-[.toaster]:px-5 group-[.toaster]:py-4 group-[.toaster]:backdrop-blur-xl group-[.toaster]:font-sans",
          title:
            "group-[.toast]:text-sm group-[.toast]:font-bold group-[.toast]:tracking-wide",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:leading-relaxed",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl group-[.toast]:font-bold group-[.toast]:text-xs group-[.toast]:tracking-wide",
          cancelButton:
            "group-[.toast]:bg-secondary group-[.toast]:text-secondary-foreground group-[.toast]:rounded-xl",
          success:
            "group-[.toaster]:border-primary/30 group-[.toaster]:shadow-[0_0_24px_hsl(var(--primary)/0.25),0_8px_32px_rgba(0,0,0,0.4)]",
          error:
            "group-[.toaster]:border-destructive/30 group-[.toaster]:shadow-[0_0_24px_hsl(var(--destructive)/0.25),0_8px_32px_rgba(0,0,0,0.4)]",
          icon: "group-[.toast]:text-primary",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
