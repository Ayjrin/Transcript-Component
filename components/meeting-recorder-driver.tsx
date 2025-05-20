"use client"

import { useState, useEffect } from "react"
import MeetingRecorder from "./meeting-recorder"
import type { Utterance, Speaker, TagType } from "@/types/meeting"

// Recording states
type RecorderState = "idle" | "waiting" | "recording" | "completed"

export default function MeetingRecorderDriver() {
  const [meetingUrl, setMeetingUrl] = useState("")
  const [state, setState] = useState<RecorderState>("idle")
  const [transcript, setTranscript] = useState<Utterance[]>([])

  // Handle starting the recording
  const handleStartRecordingAction = (url: string) => {
    if (!url.trim()) return

    setMeetingUrl(url)
    setTranscript([])
    setState("waiting")

    // After a delay, transition to recording state and start streaming data
    setTimeout(() => {
      setState("recording")
    }, 2000)
  }

  // Handle ending the recording
  const handleEndRecordingAction = () => {
    // When ending recording, show all remaining utterances immediately
    if (mockData.length > 0) {
      setTranscript(prev => {
        // Add all remaining messages that haven't been shown yet
        const remaining = mockData.slice(currentIndex)
        return [...prev, ...remaining]
      })
    }
    setState("completed")
  }

  // Handle resetting to initial state
  const handleResetAction = () => {
    setState("idle")
    setTranscript([])
    setMeetingUrl("")
    setCurrentIndex(0)
    setMockData([])
  }

  // Handle adding a tag to an utterance
  const handleAddTagAction = (utteranceId: string, tagType: TagType) => {
    setTranscript((prev) =>
      prev.map((utterance) =>
        utterance.id === utteranceId
          ? {
              ...utterance,
              tags: [
                ...utterance.tags.filter((t) => t.type !== tagType),
                { type: tagType, label: getTagLabel(tagType) },
              ],
            }
          : utterance,
      ),
    )
  }

  // Handle removing a tag from an utterance
  const handleRemoveTagAction = (utteranceId: string, tagType: TagType) => {
    setTranscript((prev) =>
      prev.map((utterance) =>
        utterance.id === utteranceId
          ? {
              ...utterance,
              tags: utterance.tags.filter((t) => t.type !== tagType),
            }
          : utterance,
      ),
    )
  }

  // Handle linking Q&A utterances
  const handleLinkQAAction = (questionId: string, answerIds: string[]) => {
    setTranscript((prev) => {
      const newTranscript = [...prev]

      // Update question with links to answers
      const questionIndex = newTranscript.findIndex((u) => u.id === questionId)
      if (questionIndex >= 0) {
        newTranscript[questionIndex] = {
          ...newTranscript[questionIndex],
          tags: [
            ...newTranscript[questionIndex].tags.filter((t) => t.type !== "question"),
            { type: "question", label: "Question" },
          ],
          linkedUtterances: answerIds,
        }
      }

      // Add answer tag to all answers
      return newTranscript.map((utterance) =>
        answerIds.includes(utterance.id)
          ? {
              ...utterance,
              tags: [...utterance.tags.filter((t) => t.type !== "answer"), { type: "answer", label: "Answer" }],
              linkedUtterances: [questionId],
            }
          : utterance,
      )
    })
  }

  // Keep track of current transcript index
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mockData, setMockData] = useState<Utterance[]>([])

  // Debug logs
  useEffect(() => {
    console.warn('Transcript updated:', transcript.map(t => ({ id: t.id, text: t.text.substring(0, 20) })))
  }, [transcript])

  useEffect(() => {
    console.warn('Current index updated:', currentIndex)
  }, [currentIndex])

  useEffect(() => {
    console.warn('Mock data updated:', mockData.map(t => t.id))
  }, [mockData])

  // Initialize mock data when recording starts
  useEffect(() => {
    if (state === "recording") {
      const data = generateMockTranscript()
      const uniqueData = data.filter((item, index, self) => 
        index === self.findIndex((t) => t.id === item.id && t.timestamp === item.timestamp)
      )
      setMockData(uniqueData)
      if (uniqueData.length > 0) {
        setTranscript([uniqueData[0]])
        setCurrentIndex(1)
      }
    }
  }, [state])

  // Simulate streaming data when in recording state
  useEffect(() => {
    if (state !== "recording" || currentIndex >= mockData.length) return

    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => {
        if (prevIndex < mockData.length) {
          console.warn(`Adding utterance ${prevIndex + 1}`)
          setTranscript(prev => {
            const newUtterance = mockData[prevIndex]
            // Check if this utterance is already in the transcript
            const exists = prev.some(u => u.id === newUtterance.id && u.timestamp === newUtterance.timestamp)
            return exists ? prev : [...prev, newUtterance]
          })
          return prevIndex + 1
        }
        return prevIndex
      })
    }, 2000)

    return () => clearInterval(intervalId)
  }, [state, mockData, currentIndex])

  return (
    <MeetingRecorder
      meetingUrl={meetingUrl}
      state={state}
      transcript={transcript}
      onStartRecordingAction={handleStartRecordingAction}
      onEndRecordingAction={handleEndRecordingAction}
      onResetAction={handleResetAction}
      onAddTagAction={handleAddTagAction}
      onRemoveTagAction={handleRemoveTagAction}
      onLinkQAAction={handleLinkQAAction}
    />
  )
}

// Helper function to get tag label
function getTagLabel(tagType: TagType): string {
  const labels: Record<TagType, string> = {
    question: "Question",
    answer: "Answer",
    competitor: "Competitor",
    tool: "Tool",
    "pain-point": "Pain Point",
    "current-process": "Current Process",
    "ideal-process": "Ideal Process",
  }
  return labels[tagType]
}

// Mock data generation
function generateMockTranscript(): Utterance[] {
  const speakers: Speaker[] = [
    { id: "1", name: "John (Host)" },
    { id: "2", name: "Sarah (Client)" },
  ]

  return [
    {
      id: "1",
      speakerId: speakers[0].id,
      speakerName: speakers[0].name,
      text: "Thanks for joining today. Could you tell us about your current workflow for managing customer data?",
      timestamp: "00:00:15",
      tags: [],
    },
    {
      id: "2",
      speakerId: speakers[1].id,
      speakerName: speakers[1].name,
      text: "Currently we're using Excel spreadsheets and it's becoming a nightmare as we scale. We have data scattered across multiple files and it's hard to keep track of everything.",
      timestamp: "00:00:30",
      tags: [],
    },
    {
      id: "3",
      speakerId: speakers[0].id,
      speakerName: speakers[0].name,
      text: "I see. What's the biggest pain point with your current system?",
      timestamp: "00:01:05",
      tags: [],
    },
    {
      id: "4",
      speakerId: speakers[1].id,
      speakerName: speakers[1].name,
      text: "Definitely the lack of real-time collaboration. We've tried Google Sheets but it doesn't have the advanced features we need. We looked at Salesforce but it's too expensive for our small team.",
      timestamp: "00:01:20",
      tags: [],
    },
    {
      id: "5",
      speakerId: speakers[0].id,
      speakerName: speakers[0].name,
      text: "What would an ideal solution look like for your team?",
      timestamp: "00:02:00",
      tags: [],
    },
    {
      id: "6",
      speakerId: speakers[1].id,
      speakerName: speakers[1].name,
      text: "We need something cloud-based with good collaboration features, custom fields for our industry-specific data, and ideally some automation for follow-ups. We're currently using Zapier for some automation but it's not integrated well with our spreadsheets.",
      timestamp: "00:02:15",
      tags: [],
    },
  ]
}
