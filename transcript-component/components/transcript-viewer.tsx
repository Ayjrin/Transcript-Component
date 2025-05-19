"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  CircleDot,
  Building2,
  Wrench,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Utterance, TagType } from "@/types/meeting"

interface TranscriptViewerProps {
  transcript: Utterance[]
  onAddTag: (utteranceId: string, tagType: TagType) => void
  onRemoveTag: (utteranceId: string, tagType: TagType) => void
  onLinkQA: (questionId: string, answerIds: string[]) => void
}

export default function TranscriptViewer({ transcript, onAddTag, onRemoveTag, onLinkQA }: TranscriptViewerProps) {
  const [hoveredUtteranceId, setHoveredUtteranceId] = useState<string | null>(null)
  const [selectedUtteranceId, setSelectedUtteranceId] = useState<string | null>(null)
  const [selectedTagType, setSelectedTagType] = useState<TagType | null>(null)
  const [qaLinkMode, setQaLinkMode] = useState<boolean>(false)
  const [qaSource, setQaSource] = useState<string | null>(null)
  const [qaTargets, setQaTargets] = useState<Set<string>>(new Set())

  const tagConfig: Record<TagType, { color: string; icon: React.ReactNode; label: string }> = {
    question: {
      color: "bg-blue-500",
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Question",
    },
    answer: {
      color: "bg-green-500",
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Answer",
    },
    competitor: {
      color: "bg-red-500",
      icon: <Building2 className="h-4 w-4" />,
      label: "Competitor",
    },
    tool: {
      color: "bg-purple-500",
      icon: <Wrench className="h-4 w-4" />,
      label: "Tool",
    },
    "pain-point": {
      color: "bg-amber-500",
      icon: <AlertCircle className="h-4 w-4" />,
      label: "Pain Point",
    },
    "current-process": {
      color: "bg-slate-500",
      icon: <CircleDot className="h-4 w-4" />,
      label: "Current Process",
    },
    "ideal-process": {
      color: "bg-emerald-500",
      icon: <CircleDot className="h-4 w-4" />,
      label: "Ideal Process",
    },
  }

  const handleUtteranceClick = (utteranceId: string) => {
    if (qaLinkMode) {
      if (utteranceId === qaSource) return

      // Toggle target selection
      const newTargets = new Set(qaTargets)
      if (newTargets.has(utteranceId)) {
        newTargets.delete(utteranceId)
      } else {
        newTargets.add(utteranceId)
      }
      setQaTargets(newTargets)
    } else if (selectedTagType) {
      onAddTag(utteranceId, selectedTagType)
      setSelectedTagType(null)
    } else {
      // Toggle selection of the utterance for tagging
      setSelectedUtteranceId((prevId) => (prevId === utteranceId ? null : utteranceId))
    }
  }

  const startQALinking = (utteranceId: string) => {
    setQaLinkMode(true)
    setQaSource(utteranceId)
    setQaTargets(new Set())

    // Add question tag to source
    onAddTag(utteranceId, "question")
  }

  const confirmQALink = () => {
    if (!qaSource || qaTargets.size === 0) return

    // Link the question to the answers
    onLinkQA(qaSource, Array.from(qaTargets))

    // Reset QA linking mode
    cancelQALink()
  }

  const cancelQALink = () => {
    setQaLinkMode(false)
    setQaSource(null)
    setQaTargets(new Set())
  }

  const renderTagButtons = (utteranceId: string) => {
    return (
      <div className="absolute -top-10 left-0 bg-white dark:bg-gray-800 shadow-md rounded-md p-1 flex items-center space-x-1 z-10 border">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-xs font-medium"
          onClick={() => startQALinking(utteranceId)}
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          Q&A
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {Object.entries(tagConfig)
          .filter(([type]) => type !== "question" && type !== "answer")
          .map(([type, config]) => (
            <Button
              key={type}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => {
                onAddTag(utteranceId, type as TagType)
                // Keep the utterance selected after tagging
                setSelectedUtteranceId(utteranceId)
              }}
              title={config.label}
            >
              <div className={cn("h-3 w-3 rounded-full", config.color)} />
            </Button>
          ))}
      </div>
    )
  }

  const renderQALinkingControls = () => {
    if (!qaLinkMode) return null

    return (
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 p-3 mb-4 border rounded-md shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-medium text-sm">Linking Question to Answer(s)</span>
            <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
              {qaTargets.size} selected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" onClick={cancelQALink}>
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={confirmQALink} disabled={qaTargets.size === 0}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Confirm
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Handle clicks outside utterances to clear selection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedUtteranceId && !qaLinkMode && !selectedTagType) {
        const target = event.target as HTMLElement
        if (!target.closest(`[data-utterance-id="${selectedUtteranceId}"]`)) {
          setSelectedUtteranceId(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [selectedUtteranceId, qaLinkMode, selectedTagType])

  // Auto-scroll to the bottom when new utterances are added
  useEffect(() => {
    if (transcript.length > 0) {
      const container = document.querySelector(".transcript-container")
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }, [transcript.length])

  return (
    <div className="space-y-4">
      {renderQALinkingControls()}

      <div className="space-y-6 transcript-container">
        {transcript.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Waiting for transcript...</div>
        ) : (
          transcript.map((utterance) => {
            const isSource = qaSource === utterance.id
            const isTarget = qaTargets.has(utterance.id)
            const isLinked = utterance.linkedUtterances && utterance.linkedUtterances.length > 0
            const isQuestion = utterance.tags.some((t) => t.type === "question")
            const isAnswer = utterance.tags.some((t) => t.type === "answer")

            return (
              <div
                key={utterance.id}
                data-utterance-id={utterance.id}
                className={cn(
                  "relative p-4 rounded-lg transition-colors",
                  isSource ? "bg-blue-50 dark:bg-blue-950 border-2 border-blue-500" : "",
                  isTarget ? "bg-green-50 dark:bg-green-950 border-2 border-green-500" : "",
                  !isSource && !isTarget && isQuestion ? "bg-blue-50 dark:bg-blue-950" : "",
                  !isSource && !isTarget && isAnswer ? "bg-green-50 dark:bg-green-950" : "",
                  qaLinkMode && !isSource && !isTarget ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" : "",
                  selectedTagType ? "cursor-pointer" : "",
                  selectedUtteranceId === utterance.id ? "ring-2 ring-primary ring-opacity-50" : "",
                )}
                onMouseEnter={() => setHoveredUtteranceId(utterance.id)}
                onMouseLeave={() => setHoveredUtteranceId(null)}
                onClick={() => handleUtteranceClick(utterance.id)}
              >
                {/* Tagging UI */}
                {(hoveredUtteranceId === utterance.id || selectedUtteranceId === utterance.id) &&
                  !qaLinkMode &&
                  !selectedTagType &&
                  renderTagButtons(utterance.id)}

                {/* Speaker and timestamp */}
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-sm">{utterance.speakerName}</span>
                  <span className="text-xs text-muted-foreground">{utterance.timestamp}</span>
                </div>

                {/* Utterance text */}
                <p className="whitespace-pre-wrap">{utterance.text}</p>

                {/* Tags */}
                {utterance.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {utterance.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                          tagConfig[tag.type].color.replace("bg-", "bg-opacity-20 text-"),
                        )}
                      >
                        {tagConfig[tag.type].icon}
                        <span className="ml-1">{tag.label}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Q&A linking visualization */}
                {isLinked && (
                  <div className="mt-2 text-xs text-muted-foreground flex items-center">
                    {isQuestion ? (
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Linked to {utterance.linkedUtterances?.length} answer(s)
                        <ArrowRight className="h-3 w-3 mx-1" />
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Answer to question #{transcript.findIndex((u) => u.id === utterance.linkedUtterances?.[0]) + 1}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
