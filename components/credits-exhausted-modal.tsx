"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CreditsExhaustedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreditsExhaustedModal({ open, onOpenChange }: CreditsExhaustedModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onOpenChange(false);
    router.push("/dashboard/billing");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={true}>
        <DialogHeader>
          <DialogTitle className="text-white">You have no credits left</DialogTitle>
          <DialogDescription className="text-slate-400">
            Upgrade your plan to continue using AI generation features.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
          >
            Upgrade your plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
