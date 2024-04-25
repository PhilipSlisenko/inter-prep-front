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
import { useToast } from "@/components/ui/use-toast";
import { Feedback } from "@/types/Feedback";
import axios from "axios";
import { CheckCircleIcon } from "lucide-react";
import { useState } from "react";

export default function ShareFeedbackButton({ userId }: { userId: string }) {
  const [modalOpen, setModalOpen] = useState(false);

  const [feedback, setFeedback] = useState("");

  const onClose = ({ status }: { status: "save" | "cancel" }) => {
    if (status === "cancel") {
      setModalOpen(false);
    }
    if (status === "save") {
      setModalOpen(false);
      toast({
        description: (
          <span className="flex">
            <CheckCircleIcon className="size-5 mr-2 text-green-500" />
            Thank you for sharing feedback!
          </span>
        ),
      });

      const feedback_: Feedback = {
        type: "bottom_feedback",
        user_id: userId,
        content: feedback,
      };
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback`, feedback_);
    }
  };

  const { toast } = useToast();

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} onClick={() => setFeedback("")}>
          Share feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription>
            What didn&#39;t you like about the generated content, or about your
            experience with us in general? How can we improve?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Type your feedback here"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => onClose({ status: "save" })}
            >
              Send
            </Button>
            <Button
              className="w-full"
              variant={"secondary"}
              onClick={() => onClose({ status: "cancel" })}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
`
share feedback
let us know what you didn't like about the generated content. how can we improve? (make it better)
                                 about your experience with our service
`;
