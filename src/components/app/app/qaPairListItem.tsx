import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export function AnswerCard({ answer }: { answer: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div>{answer}</div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default function QaPairListItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>{question}</div>
        {showAnswer && <AnswerCard answer={answer} />}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => setShowAnswer(!showAnswer)}>
          {!showAnswer ? "Show answer" : "Hide answer"}
        </Button>
      </CardFooter>
    </Card>
  );
}
