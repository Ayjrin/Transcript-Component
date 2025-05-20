import MeetingRecorderDriver from "@/components/meeting-recorder-driver"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Meeting Recorder & Analyzer</h1>
      <MeetingRecorderDriver />
    </main>
  )
}
