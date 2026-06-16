"use client";

import { useParams } from "next/navigation";
import { ExamRunner } from "@/components/exam/ExamRunner";

export default function PracticeExamPage() {
  const params = useParams();
  const examId = params.id as string;
  return <ExamRunner examId={examId} mode="practice" />;
}
