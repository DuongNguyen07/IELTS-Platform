'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { SpeakingExam as SpeakingExamData } from '@/shared/data/exams/speaking/types';
import MicrophoneTestScreen from './MicrophoneTestScreen';
import SpeakingHeader from './SpeakingHeader';
import SpeakingQuestionCard from './SpeakingQuestionCard';
import SpeakingTranscript from './SpeakingTranscript';
import SpeakingRecordButton from './SpeakingRecordButton';
import SpeakingFooter from './SpeakingFooter';

type Phase = 'waiting' | 'prep' | 'recording';

interface Props {
  exam: SpeakingExamData;
}

export default function SpeakingExam({ exam }: Props) {
  const router = useRouter();

  const [micTestDone, setMicTestDone]           = useState(false);
  const [activePartIndex, setActivePartIndex]   = useState(0);
  const [activeQIndex, setActiveQIndex]         = useState(0);
  const [phase, setPhase]                       = useState<Phase>('waiting');
  const [answered, setAnswered]                 = useState<Set<string>>(new Set());
  const [transcripts, setTranscripts]           = useState<Record<string, string>>({});

  const activePart     = exam.parts[activePartIndex];
  const activeQuestion = activePart.questions[activeQIndex];
  const currentKey     = `p${activePartIndex}q${activeQIndex}`;

  const advanceQuestion = useCallback(() => {
    setAnswered((prev) => new Set([...prev, `p${activePartIndex}q${activeQIndex}`]));
    setPhase('waiting');

    const nextQ = activeQIndex + 1;
    if (nextQ < activePart.questions.length) {
      setActiveQIndex(nextQ);
      return;
    }
    const nextP = activePartIndex + 1;
    if (nextP < exam.parts.length) {
      setActivePartIndex(nextP);
      setActiveQIndex(0);
      return;
    }
    // All parts done
    router.push('/exam-library');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePartIndex, activeQIndex, activePart.questions.length, exam.parts.length]);

  const handleStartRecording = useCallback(() => {
    if (activePart.partNumber === 2 && activeQuestion.prepTimeSecs) {
      setPhase('prep');
    } else {
      setPhase('recording');
    }
  }, [activePart.partNumber, activeQuestion.prepTimeSecs]);

  const handleSubmit = useCallback((_blob: Blob | null) => {
    // TODO: POST blob to /api/exam/speaking/transcribe → AI service
    setTranscripts((prev) => ({ ...prev, [currentKey]: prev[currentKey] ?? '' }));
    advanceQuestion();
  }, [currentKey, advanceQuestion]);

  if (!micTestDone) {
    return <MicrophoneTestScreen onComplete={() => setMicTestDone(true)} />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-exam-bg">
      <SpeakingHeader
        examTitle={exam.title}
        partNumber={activePart.partNumber}
        questionIndex={activeQIndex}
        totalQuestions={activePart.questions.length}
      />

      {/* Centered single-column content */}
      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="flex flex-col gap-5 items-center max-w-3xl mx-auto">
          <SpeakingQuestionCard
            partNumber={activePart.partNumber}
            questionNumber={activeQuestion.questionNumber}
            text={activeQuestion.text}
            bulletPoints={activeQuestion.bulletPoints}
          />

          <SpeakingTranscript
            text={transcripts[currentKey] ?? ''}
            isRecording={phase === 'recording'}
          />

          <SpeakingRecordButton
            phase={phase}
            timeLimitSecs={activeQuestion.timeLimitSecs}
            prepTimeSecs={activeQuestion.prepTimeSecs}
            onStartRecording={handleStartRecording}
            onSubmit={handleSubmit}
            onPrepDone={() => setPhase('recording')}
          />
        </div>
      </div>

      <SpeakingFooter
        exam={exam}
        activePartIndex={activePartIndex}
        activeQuestionIndex={activeQIndex}
        answered={answered}
        onFinish={() => router.push('/exam-library')}
      />
    </div>
  );
}
