interface FeedbackQuestionThumbsUp {
  type: "question_thumbs_up";
  user_id: string;
}

interface FeedbackQuestionThumbsDown {
  type: "question_thumbs_down";
  user_id: string;
  content: string;
}

interface BottomFeedback {
  type: "bottom_feedback";
  user_id: string;
  content: string;
}

export type Feedback =
  | FeedbackQuestionThumbsUp
  | FeedbackQuestionThumbsDown
  | BottomFeedback;
