import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function GenerateFromFeedbackButton({
  onGenerateFromFeedback,
}: {
  onGenerateFromFeedback: ({}: { feedback: string }) => any;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const [feedback, setFeedback] = useState("");

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} onClick={() => setFeedback("")}>
          Generate from feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Generate from feedback</DialogTitle>
          <DialogDescription>
            {/* Provide feedback to incorporate when generating next batch of
            questions. */}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder='Type your feedback here. E.g. "I need more technical questions", or "Ask me more questions on my X skill", or even something funky like "Check my allegiance to woke culture"'
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => {
                onGenerateFromFeedback({ feedback });
                setModalOpen(false);
                setFeedback("");
              }}
            >
              Generate
            </Button>
            <Button
              className="w-full"
              variant={"secondary"}
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
