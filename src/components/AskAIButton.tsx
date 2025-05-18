"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { askAIAboutNotesAction } from "@/actions/notes";
import "@/styles/ai-response.css";

type Props = {
  user: User | null;
  note: string | undefined;
};

function AskAIButton({ user, note }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState<string>("");

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!user) {
      router.push("/login");
    } else {
      if (isOpen) {
        setResponse("");
      }
      setOpen(isOpen);
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const summarizeNote = useCallback(() => {
    if (!note) return;

    setTimeout(scrollToBottom, 100);

    startTransition(async () => {
      const response = await askAIAboutNotesAction(note);
      if (response) setResponse(response);

      setTimeout(scrollToBottom, 100);
    });
  }, [note]);

  useEffect(() => {
    summarizeNote();
  }, [summarizeNote]);

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">AI Summarise</Button>
      </DialogTrigger>
      <DialogContent
        className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col overflow-y-auto"
        ref={contentRef}
      >
        <DialogHeader>
          <DialogTitle>AI Summarise Your Notes</DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-8">
          <p
            className="bot-response text-muted-foreground text-sm"
            dangerouslySetInnerHTML={{ __html: response }}
          />
          {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AskAIButton;
