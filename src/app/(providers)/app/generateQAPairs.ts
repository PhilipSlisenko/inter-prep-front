import { QAPair } from "@/types/types";
import axios from "axios";
import { mockQAPairs } from "./mockQAPairs";

export const generateQAPairs = async ({
  sessionId,
  cv,
  jobDescription,
  accessToken,
}: {
  sessionId: string;
  cv: string;
  jobDescription: string;
  accessToken: string;
}): Promise<{ status: "success" | "prompt_to_top_up"; qa_pairs: QAPair[] }> => {
  const userId = localStorage.getItem("ip-user-id") as string;
  console.log(`authToken:\n${accessToken}\n${JSON.stringify(accessToken)}`);
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/generate_qa_batch`,
    {
      params: {
        user_id: userId,
        session_id: sessionId,
        cv,
        job_description: jobDescription,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return data;
};

export const mockGenerateQAPairs = async ({
  sessionId,
  cv,
  jobDescription,
}: {
  sessionId: string;
  cv: string;
  jobDescription: string;
}): Promise<QAPair[]> => {
  return new Promise((res) =>
    setTimeout(() => {
      res(mockQAPairs);
    }, 1000)
  );
};
