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
            "group toast group-[.toaster]:bg-[hsl(230,15%,10%)] group-[.toaster]:text-[hsl(45,80%,85%)] group-[.toaster]:border-[hsl(45,80%,55%,0.2)] group-[.toaster]:shadow-[0_0_24px_hsl(45,80%,55%,0.1),0_8px_32px_rgba(0,0,0,0.5)] group-[.toaster]:rounded-2xl group-[.toaster]:px-5 group-[.toaster]:py-4 group-[.toaster]:backdrop-blur-xl",
          title:
            "group-[.toast]:text-sm group-[.toast]:font-bold group-[.toast]:tracking-[0.05em] group-[.toast]:font-[Space_Grotesk,sans-serif]",
          description:
            "group-[.toast]:text-[hsl(45,20%,50%)] group-[.toast]:text-xs group-[.toast]:italic group-[.toast]:leading-relaxed",
          actionButton:
            "group-[.toast]:bg-[hsl(45,80%,55%)] group-[.toast]:text-[hsl(230,15%,8%)] group-[.toast]:rounded-xl group-[.toast]:font-bold group-[.toast]:text-xs group-[.toast]:tracking-wide",
          cancelButton:
            "group-[.toast]:bg-[hsl(230,15%,15%)] group-[.toast]:text-[hsl(45,20%,50%)] group-[.toast]:rounded-xl",
          success:
            "group-[.toaster]:border-[hsl(45,80%,55%,0.3)] group-[.toaster]:shadow-[0_0_24px_hsl(45,80%,55%,0.15),0_8px_32px_rgba(0,0,0,0.5)]",
          error:
            "group-[.toaster]:border-[hsl(0,72%,51%,0.3)] group-[.toaster]:shadow-[0_0_24px_hsl(0,72%,51%,0.2),0_8px_32px_rgba(0,0,0,0.5)]",
          icon: "group-[.toast]:text-[hsl(45,80%,55%)]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
