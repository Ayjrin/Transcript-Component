"use client"

import type React from "react"

import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import TranscriptViewer from "./transcript-viewer"
import type { Utterance, TagType } from "@/types/meeting"

// Recording states
type RecorderState = "idle" | "waiting" | "recording" | "completed"

interface MeetingRecorderProps {
  meetingUrl: string
  state: RecorderState
  transcript: Utterance[]
  onStartRecordingAction: (_url: string) => void
  onEndRecordingAction: () => void
  onResetAction: () => void
  onAddTagAction: (_utteranceId: string, _tagType: TagType) => void
  onRemoveTagAction: (_utteranceId: string, _tagType: TagType) => void
  onLinkQAAction: (_questionId: string, _answerIds: string[]) => void
}

export default function MeetingRecorder({
  meetingUrl,
  state,
  transcript,
  onStartRecordingAction,
  onEndRecordingAction,
  onResetAction,
  onAddTagAction,
  onRemoveTagAction,
  onLinkQAAction,
}: MeetingRecorderProps) {
  // Local state for the URL input
  const [inputUrl, setInputUrl] = useState(meetingUrl)

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onStartRecordingAction(inputUrl)
  }

  // Render the appropriate content based on the current state
  const renderContent = () => {
    switch (state) {
      case "idle":
        return (
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="meeting-url" className="text-sm font-medium">
                  Meeting URL:
                </label>
                <Input
                  id="meeting-url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://zoom.us/j/123456789"
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={!inputUrl.trim()} className="w-full">
                Record
              </Button>
            </form>
          </div>
        )

      case "waiting":
      case "recording":
      case "completed": {
        const isActive = state === "waiting" || state === "recording"
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Meeting Transcript</h3>
                <p className="text-sm text-muted-foreground truncate">{meetingUrl}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={isActive ? onEndRecordingAction : onResetAction}
                className="flex items-center"
              >
                {isActive && (
                  <div
                    className={cn(
                      "animate-pulse h-2 w-2 rounded-full mr-2",
                      state === "waiting" ? "bg-yellow-500" : "bg-red-500",
                    )}
                  ></div>
                )}
                {isActive ? "End Recording" : "New Recording"}
              </Button>
            </div>

            <TranscriptViewer
              transcript={transcript}
              onAddTagAction={onAddTagAction}
              _onRemoveTagAction={onRemoveTagAction}
              onLinkQAAction={onLinkQAAction}
            />
          </div>
        )
      }
    }
  }

  return (
    <Card className="w-full">
      <CardContent
        className={cn(
          "p-6",
          state === "waiting" || state === "recording" || state === "completed" ? "max-h-[80vh] overflow-y-auto" : "",
        )}
      >
        {renderContent()}
      </CardContent>
    </Card>
  )
}
