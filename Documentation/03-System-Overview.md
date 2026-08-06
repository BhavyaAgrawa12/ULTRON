# ULTRON - System Overview

**Document:** 03-System-Overview.md\
**Version:** v1.0\
**Status:** Draft

------------------------------------------------------------------------

# Purpose

This document explains how every major subsystem inside ULTRON works
together.

It describes the complete lifecycle of a request, from user interaction
to final execution.

------------------------------------------------------------------------

# System Overview

ULTRON is composed of five primary domains:

1.  User Experience
2.  Core Intelligence
3.  Execution Layer
4.  AI Providers
5.  Data & Synchronization

Each domain has a clearly defined responsibility.

------------------------------------------------------------------------

# Complete Request Lifecycle

``` text
User
   │
   ▼
Desktop UI
   │
IPC
   │
Conversation Engine
   │
Intent Engine
   │
Planner
   │
Decision Engine
   │
 ┌──────────────┬──────────────┬──────────────┐
 │              │              │
Memory      Local Tools     AI Router
 │              │              │
 └──────────────┴──────────────┘
        │
Response Generator
        │
Desktop UI
        │
User
```

------------------------------------------------------------------------

# System Domains

## 1. User Experience

Responsible for:

-   Chat interface
-   Voice interaction
-   Settings
-   Notifications
-   AI Orb
-   Streaming responses

Technology: - Electron - React - TypeScript

------------------------------------------------------------------------

## 2. Core Intelligence

Responsible for:

-   Intent detection
-   Context tracking
-   Planning
-   Personality
-   Conversation
-   Decision making

The Core never directly performs operating system actions.

------------------------------------------------------------------------

## 3. Execution Layer

Responsible for executing actions.

Modules include:

-   Windows Controller
-   Browser Controller
-   File Controller
-   Workspace Manager
-   Git Integration
-   VS Code Integration

------------------------------------------------------------------------

## 4. AI Provider Layer

The AI Router selects the most appropriate provider.

Priority:

1.  No AI (local logic)
2.  Local Model
3.  Cloud Model

Supported providers:

-   Ollama
-   Gemini
-   OpenAI
-   Groq
-   OpenRouter
-   LM Studio

------------------------------------------------------------------------

## 5. Data Layer

Stores:

-   Conversations
-   Projects
-   Preferences
-   Memories
-   Logs
-   Device information

Primary storage: - SQLite

Future: - Vector database - Cloud synchronization

------------------------------------------------------------------------

# Request Decision Flow

## Local Action

Example:

User: \> Open Chrome

Flow:

User → Intent Engine → Windows Controller → Chrome Opens

No AI involved.

------------------------------------------------------------------------

## Memory Request

Example:

User: \> What was I working on yesterday?

Flow:

User → Memory Engine → Context Ranking → Response

------------------------------------------------------------------------

## AI Request

Example:

User: \> Research AI agent architectures.

Flow:

User → Planner → AI Router → Selected Provider → Research Engine →
Response

------------------------------------------------------------------------

# Design Principles

-   AI is optional.
-   Local actions should not require internet.
-   Every module has a single responsibility.
-   Every module communicates through interfaces.
-   User data remains under user control.

------------------------------------------------------------------------

# Performance Budget

  Component        Target
  ---------------- -------------------------------------
  UI Startup       \< 2 sec
  Local Action     \< 500 ms
  Memory Lookup    \< 200 ms
  AI First Token   \< 1 sec (streaming when available)

------------------------------------------------------------------------

# Future Expansion

The same architecture supports:

-   Android Client
-   Cloud Client
-   Multi-device synchronization
-   Plugin marketplace
-   SDK
-   Enterprise edition

No redesign should be required to support these features.

------------------------------------------------------------------------

# Acceptance Criteria

A feature may be added only if:

-   It follows the architecture.
-   It fits one of the five product pillars.
-   It does not break modularity.
-   It does not significantly increase startup time.
-   It has defined interfaces and documentation.

------------------------------------------------------------------------

# Next Documents

-   04-Technology-Stack.md
-   05-Folder-Structure.md
-   06-Brain.md
-   07-Memory-Architecture.md
-   08-AI-Router.md
-   09-IPC-Communication.md
