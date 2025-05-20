# Transcript Component Build Guide

## Overview
The Transcript Component is a real-time meeting analysis tool that integrates with Recall AI and Assembly AI for live transcription of video calls. It provides a seamless interface for capturing, categorizing, and analyzing meeting content through an intelligent tagging system. Users can input a meeting URL to begin recording, after which the component displays a diarized transcript that automatically updates as people speak. The interface enables real-time categorization of utterances through a sophisticated tagging system, allowing users to mark important moments such as competitor mentions, tool discussions, pain points, and process descriptions. A specialized Q&A linking feature helps connect questions with their corresponding answers, creating a structured knowledge base from the conversation. The component interfaces with a comprehensive API backend that manages client data, call histories, and utterances, making it a powerful tool for meeting documentation, analysis, and knowledge extraction.

## Core Components

### 1. Meeting Recorder Interface
- **Initial State**
  - Text input field labeled "Meeting URL:"
  - Record button with red recording icon
  - Input validates for non-empty URL
  - Full-width layout with clean spacing

- **Recording State**
  - URL input and record section collapses
  - Shows recording indicator
  - Record button transforms into Stop button
  - Displays live transcript below

- **Reset State**
  - Clear button to reset to initial state
  - Clears transcript and URL
  - Returns to URL input view

### 2. Transcript Display
- **Layout**
  - Scrollable container (60vh max height)
  - Auto-scrolls to newest messages
  - Stops auto-scroll when user manually scrolls up
  - Resumes auto-scroll when user scrolls to bottom
  - Light padding around utterances
  - Smooth scroll behavior

- **Utterance Styling**
  - Each utterance in a rounded card
  - Speaker name in bold
  - Timestamp display
  - Light hover effect with shadow
  - Proper spacing between utterances

### 3. Tagging System

#### Tag Button UI
- **Location**: Appears above utterance on hover
- **Layout**:
  - Q&A button on left
  - Vertical separator (|)
  - Colored dot buttons for other tags
- **Button States**:
  - Normal: Transparent background with colored dot
  - Selected: Full color background with white dot
  - Hover: Scale up effect (1.05x)

#### Tag Types and Colors
- **Q&A Tags**
  - Question: Blue background
  - Answer: Green background
  - Visual linking between related Q&A pairs

- **Other Tags**
  - Competitors Mentioned
  - Tools Used
  - Pain Point
  - Current Process
  - Ideal Process
  - Each with unique color dot

#### Tagging Interaction
1. **Basic Tagging**
   - Hover over utterance shows tag buttons
   - Click tag to apply immediately
   - Tag appears as colored pill with white text
   - Multiple tags per utterance allowed

2. **Q&A Linking**
   - Click Q&A button to enter linking mode
   - Select source utterance (question)
   - Select target utterance(s) (answers)
   - Confirm or cancel the link
   - Linked pairs show visual connection

### 4. Visual States

#### Utterance States
- **Normal**: White/dark background
- **Hover**: Light shadow and ring effect
- **Selected**: Stronger shadow effect
- **Tagged**: 
  - Colored background based on tag
  - White text for tag labels
  - Tag icons visible
  - Smooth transitions between states

#### Q&A Linking States
- **Question Selected**: Blue border/background
- **Answer Selected**: Green border/background
- **Linking Mode**: 
  - Clear visual indicator of mode
  - Confirm/Cancel buttons
  - Visual feedback for selection

## Technical Requirements

### Styling
- Tailwind CSS for styling
- Dark mode support
- Responsive design
- Smooth transitions (200ms duration)
- Accessible color contrast

### State Management
- URL input state
- Recording state (idle/recording/completed)
- Transcript array with speaker diarization
- Tag management
- Q&A link tracking
- Scroll position tracking

### Performance
- Efficient rendering of large transcripts
- Smooth scrolling behavior
- Responsive tag interactions
- No UI jank during state transitions

## Implementation Notes
- Use Server Actions for all state modifications
- Maintain proper component hierarchy
- Handle edge cases (empty states, errors)
- Ensure accessibility compliance
- Support keyboard navigation
- Implement proper error boundaries
