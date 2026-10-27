import { useImperativeHandle, useState, type ReactNode, type Ref } from "react";
import { Drawer } from "vaul";
import { layout, useTheme } from "@/theme";
import type { BottomSheetModalBaseRef } from "@/types";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import ThemedText from "@/components/ui/ThemedText";

interface BottomSheetModalBaseProps {
  title: string;
  children: ReactNode;
  ref?: Ref<BottomSheetModalBaseRef>;
}

/** Modal sheet over a dimmed screen, sized to its content. Drag down, tap outside or Escape to close. */
export default function BottomSheetModalBase({ title, children, ref }: BottomSheetModalBaseProps) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const side = Math.max(0, (width - layout.contentMaxWidth) / 2);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        {/* Same as @gorhom/bottom-sheet's default backdrop. */}
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Drawer.Content
          aria-describedby={undefined}
          className="view fixed bottom-0 z-50 max-h-[calc(100dvh-env(safe-area-inset-top)-24px)] rounded-t-sheet bg-card outline-none"
          style={{ left: side, right: side }}
        >
          <div className="view h-6 shrink-0 items-center justify-center">
            <span
              className="block h-1 w-10 rounded-full"
              style={{ backgroundColor: colors.lineStrong }}
            />
          </div>
          <div className="view no-scrollbar overflow-y-auto overscroll-contain px-5 pb-[calc(32px+env(safe-area-inset-bottom))] pt-1">
            <Drawer.Title className="mb-4">
              <ThemedText variant="title">{title}</ThemedText>
            </Drawer.Title>
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
