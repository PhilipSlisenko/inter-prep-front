"use client";

import GenerateFromFeedbackButton from "@/components/app/app/generateFromFeedback/generateFromFeedbacButton";
import QaPairListItem from "@/components/app/app/qaPairListItem";
import TopUpModal from "@/components/app/app/topUpModal/topUpModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useLoginHook } from "@/lib/loginHook";
import { QAPair } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import {
  CircleHelpIcon,
  LoaderCircleIcon,
  MoveLeftIcon,
  MoveRightIcon,
  SparkleIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { generateQAPairs } from "./generateQAPairs";

// set input cv and job description to result of react query so that it displays it when loading new page -> redirected to new sessio id and cv and job description is maybe not yet in db - or this should not happen

// on load
//   get session id from local storage
//     get history from back
//   if not present - create
// on button click
//   generate new questions
//   update qa history
export default function Page() {
  const queryParams = useSearchParams();
  const sessionIdQParam = queryParams.get("sessionId");

  const [userId, setUserId] = useState<string>("");
  useEffect(() => {
    // on load user id management
    const userId = localStorage.getItem("ip-user-id");
    if (userId) {
      setUserId(userId);
    } else {
      const userId = v4();
      localStorage.setItem("ip-user-id", userId);
      setUserId(userId);
    }
  }, []);

  const [sessionId, setSessionId] = useState<string>("");
  useEffect(() => {
    // on load session id management
    // if session id was passed as query param - use it
    if (!!sessionIdQParam) {
      // sessionStorage.setItem("ip-session-id", sessionIdQParam);
      setSessionId(sessionIdQParam);
      return;
    }
    // // otherwise - check in session store and redirect to proper url
    // let sessionId = sessionStorage.getItem("ip-session-id");
    // if (sessionId) {
    //   router.push(`/app?sessionId=${sessionId}`);
    //   return;
    // }
    // // otherwise - generate new
    // sessionId = v4();
    // sessionStorage.setItem("ip-session-id", sessionId);
    // setSessionId(sessionId);
  }, []);

  const [cv, setCV] = useState(""); // fetch based on session id
  const [jobDescription, setJobDescription] = useState(""); // fetch based on session id
  const {
    data: CVAndJobDescription,
    dataUpdatedAt: dataUpdatedAtCVAndJobDescription,
    error: errorCVAndJobDescription,
    isFetching: isFetchingCVAndJobDescription,
    isLoading: isLoadingCVAndJobDescription,
    isSuccess: isSuccessCVAndJobDescription,
  } = useQuery<{ cv: string; job_description: string }>({
    queryKey: ["CVAndJobDescription", sessionId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/get_cv_and_job_description`,
        { params: { session_id: sessionId } }
      );
      console.log(data);
      return data;
    },
    enabled: !!sessionId,
  });
  useEffect(() => {
    if (!!isSuccessCVAndJobDescription) {
      setCV(CVAndJobDescription.cv);
      setJobDescription(CVAndJobDescription.job_description);
    }
  }, [isSuccessCVAndJobDescription, dataUpdatedAtCVAndJobDescription]);

  const [qaPairs, setQAPairs] = useState<QAPair[]>([]);

  const { data, dataUpdatedAt, error, isLoading, isSuccess } = useQuery<{
    qa_pairs: QAPair[];
  }>({
    queryKey: ["qaPairs", sessionId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/get_qas`,
        { params: { session_id: sessionId } }
      );
      return data;
    },
    enabled: !!sessionId,
  });
  useEffect(() => {
    if (isSuccess) {
      setQAPairs(data["qa_pairs"]);
    }
  }, [isSuccess, dataUpdatedAt]);

  const getQABatchMutation = useMutation({
    mutationFn: generateQAPairs,
    // mutationFn: mockGenerateQAPairs,
  });
  const queryClient = useQueryClient();

  const onGenerateButtonPress = () => {
    // generate new session id
    // remove existing qa pairs
    // log cv, job description with session id
    // // invalidate or refetch or set it up in the right places to refetch on invalidate
    // generate qa batch for session id
    const sessionId_ = v4();
    setSessionId(sessionId_);
    // sessionStorage.setItem("ip-session-id", sessionId_);

    setQAPairs([]);

    // register new session
    axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register_session`, {
      user_id: userId,
      session_id: sessionId_,
    });

    // post to /log_cv_and_job_description in body cv and job description
    axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/log_cv_and_job_description`,
      {
        session_id: sessionId_,
        cv,
        job_description: jobDescription,
      }
    );

    // generate first batch
    setFirstBatchIsLoading(true);
    getQABatchMutation.mutate(
      { sessionId: sessionId_, cv, jobDescription, accessToken },
      {
        onSuccess(data) {
          if (data["status"] == "success") {
            setFirstBatchIsLoading(false);
            queryClient.invalidateQueries({
              queryKey: ["qaPairs", sessionId_],
            });

            setQAPairs(data["qa_pairs"]);

            queryClient.invalidateQueries({
              queryKey: ["qaSessions"],
            });

            router.push(`/app?sessionId=${sessionId_}`);
          }
          if (data["status"] == "prompt_to_top_up") {
            setShowTopUpModal(true);
          }
        },
        onError(error) {},
      }
    );
  };

  const onGenerateSubsequentButtonPress = () => {
    setSubsequentBatchIsLoading(true);
    getQABatchMutation.mutate(
      { sessionId: sessionId, cv, jobDescription, accessToken: accessToken },
      {
        onSuccess(data) {
          setSubsequentBatchIsLoading(false);
          queryClient.invalidateQueries({
            queryKey: ["qaPairs", sessionId],
          });
          setQAPairs([...qaPairs, ...data["qa_pairs"]]);
        },
        onError(error) {},
      }
    );
  };

  const [firstBatchIsLoading, setFirstBatchIsLoading] = useState(false);
  const [subsequentBatchIsLoading, setSubsequentBatchIsLoading] =
    useState(false);
  const [
    subsequentBatchFromFeedbackIsLoading,
    setSubsequentBatchFromFeedbackIsLoading,
  ] = useState(false);

  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // --
  // Sessions navigation
  // --
  // get sessions
  const {
    data: sessions,
    dataUpdatedAt: dataUpdatedAtSessions,
    error: errorSessions,
    isFetching: isFetchingSessions,
    isLoading: isLoadingSessions,
    isSuccess: isSuccessSessions,
  } = useQuery<string[]>({
    queryKey: ["qaSessions"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/get_qa_session_ids`,
        { params: { user_id: userId } }
      );
      console.log(data);
      return data["session_ids"];
    },
    enabled: !!userId,
  });
  const [nextSessionId, setNextSessionId] = useState("");
  const [prevSessionId, setPrevSessionId] = useState("");
  useEffect(() => {
    // populate links to prev and next sessions based on the list of all session ids and current session id
    // if current session id is not present - it's considered to be last (newest) session - no next, prev is latest received
    // if empty list recieved - no prev
    if (isSuccessSessions) {
      if (sessions.length === 0) {
        return;
      }
      const currentSessionIndex = sessions.findIndex(
        (sessionId_) => sessionId_ === sessionId
      );

      // debugger;
      // i am not present in the list
      //   if list exists - set prev to last
      // whether next exists
      //   i am present in the list and i am not last
      // whether prev exists
      //   i am present in the list and i am not first
      if (currentSessionIndex === -1) {
        setPrevSessionId(sessions[sessions.length - 1]);
        setNextSessionId("");
        return;
      }
      if (currentSessionIndex !== sessions.length - 1) {
        setNextSessionId(sessions[currentSessionIndex + 1]);
      } else {
        setNextSessionId("");
      }
      if (currentSessionIndex !== 0) {
        setPrevSessionId(sessions[currentSessionIndex - 1]);
      } else {
        setPrevSessionId("");
      }
    }
  }, [isSuccessSessions, dataUpdatedAtSessions, sessionId]);

  const {
    isReady: isReadyAuth,
    user: auth0User,
    getAccessTokenSilently,
    accessToken,
  } = useLoginHook();
  // const [accessToken, setAccessToken] = useState("");

  const router = useRouter();

  if (isReadyAuth) {
    return (
      <div className="container space-y-4 my-4">
        {/* cv + job description */}
        <div className="space-y-2">
          <div>
            <div className="flex mb-1">
              <Label>Your CV:</Label>
              {/* Info popup */}
              <Popover>
                <PopoverTrigger asChild>
                  <CircleHelpIcon className="size-4 ml-0.5 opacity-70 hover:cursor-pointer -mt-0.5" />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <p className="text-sm text-muted-foreground">
                    Copy and paste your CV into the text field below. You
                    don&#39;t need to worry about formatting, just copy and
                    paste it &quot;as is&quot;.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            <Textarea
              placeholder="Paste your CV here"
              value={cv}
              onChange={(e) => setCV(e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <div className="flex mb-1">
              <Label>Job description:</Label>
              {/* Info popup */}
              <Popover>
                <PopoverTrigger asChild>
                  <CircleHelpIcon className="size-4 ml-0.5 opacity-70 hover:cursor-pointer -mt-0.5" />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <p className="text-sm text-muted-foreground">
                    Copy and paste job description into the text field below.
                    You don&#39;t need to worry about formatting, just copy and
                    paste it &quot;as is&quot;. <br /> We will use it to
                    generate questions that are tailored to the CV and job
                    description that you provide.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            <Textarea
              placeholder="Paste job description here"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        {/* generate button + sessions nav */}
        <div className="flex justify-center gap-2">
          <Button
            className={clsx(!prevSessionId && " invisible")}
            variant={"outline"}
            asChild={true}
            onClick={() => {
              setSessionId(prevSessionId);
              // router.push(`/app?sessionId=${prevSessionId}`);
            }}
          >
            <Link href={`/app?sessionId=${prevSessionId}`}>
              <MoveLeftIcon />
            </Link>
          </Button>
          <Button onClick={onGenerateButtonPress}>
            <SparkleIcon
              className={clsx(
                "mr-2 size-5",
                firstBatchIsLoading && "animate-spin"
              )}
            />
            Generate questions
          </Button>
          <Button
            className={clsx(!nextSessionId && " invisible")}
            variant={"outline"}
            asChild={true}
            onClick={() => {
              setSessionId(nextSessionId);
              // router.push(`/app?sessionId=${nextSessionId}`);
            }}
          >
            <Link href={`/app?sessionId=${nextSessionId}`}>
              <MoveRightIcon />
            </Link>
          </Button>
        </div>

        {/* qa pairs + generate more buttons section */}
        {qaPairs.length !== 0 && (
          <div className="space-y-4 ">
            {/* qa pairs */}
            <div className="space-y-4">
              {qaPairs.map((qaPair, idx) => (
                <QaPairListItem
                  key={idx}
                  question={qaPair.question}
                  answer={qaPair.answer}
                />
              ))}
            </div>
            {/* generate more buttons */}
            <div className="flex gap-2 justify-center items-center">
              <Button onClick={onGenerateSubsequentButtonPress}>
                <LoaderCircleIcon
                  className={clsx(
                    "mr-2 size-5",
                    !subsequentBatchIsLoading && "hidden",
                    subsequentBatchIsLoading && "animate-spin"
                  )}
                />
                Generate more
              </Button>
              <GenerateFromFeedbackButton
                onGenerateFromFeedback={({ feedback }) => {
                  setSubsequentBatchFromFeedbackIsLoading(true);
                  setTimeout(() => {
                    setSubsequentBatchFromFeedbackIsLoading(false);
                  }, 1000);
                }}
              />
              {/* <ShareFeedbackButton userId={userId} /> */}
            </div>
          </div>
        )}
        <Button onClick={() => setShowTopUpModal(!showTopUpModal)}>om</Button>
        <TopUpModal
          isOpen={showTopUpModal}
          setIsOpen={setShowTopUpModal}
          userEmail={auth0User?.email || ""}
          userSub={auth0User?.sub || ""}
        />
      </div>
    );
  }
}
