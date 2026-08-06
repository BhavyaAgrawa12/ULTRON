# ULTRON - IPC Communication

**Document:** 09-IPC-Communication.md\
**Version:** v1.0\
**Status:** Draft

------------------------------------------------------------------------

# Purpose

This document defines how the Desktop application communicates with the
ULTRON Core.

IPC (Inter-Process Communication) provides a secure and structured
bridge between the Electron frontend and the Python backend.

------------------------------------------------------------------------

# Design Goals

-   Secure communication
-   Low latency
-   Streaming support
-   Typed messages
-   Background task support
-   Platform independence

------------------------------------------------------------------------

# Architecture

``` text
React UI
    │
Electron Renderer
    │
Electron Main Process
    │
IPC Bridge
    │
Python FastAPI Server
    │
ULTRON Core
```

------------------------------------------------------------------------

# Communication Principles

-   UI never calls Python directly.
-   All communication passes through the Electron Main process.
-   Messages are validated before execution.
-   Responses use structured payloads.

------------------------------------------------------------------------

# Message Lifecycle

``` text
User Action
      │
Renderer
      │
IPC Request
      │
Electron Main
      │
Python API
      │
ULTRON Core
      │
Response
      │
Electron
      │
UI Update
```

------------------------------------------------------------------------

# Message Format

Every request contains:

``` json
{
  "id": "request-id",
  "type": "intent",
  "action": "open_app",
  "payload": {},
  "timestamp": "ISO8601"
}
```

Every response contains:

``` json
{
  "id": "request-id",
  "status": "success",
  "result": {},
  "duration_ms": 120
}
```

------------------------------------------------------------------------

# Streaming Responses

Streaming is used for:

-   AI chat
-   Research
-   Long-running tasks

Events:

-   started
-   progress
-   token
-   completed
-   failed

------------------------------------------------------------------------

# Background Tasks

Supported examples:

-   Index memory
-   Download model
-   Research
-   Workspace scan

Background tasks must never block the UI.

------------------------------------------------------------------------

# Error Handling

Errors include:

-   Validation errors
-   Timeout
-   Module unavailable
-   Permission denied
-   Internal error

Each error returns:

-   code
-   message
-   recovery suggestion

------------------------------------------------------------------------

# Security

-   IPC channels are allow-listed.
-   Renderer cannot execute arbitrary code.
-   Sensitive actions require explicit confirmation.
-   Requests are validated before execution.

------------------------------------------------------------------------

# Performance Targets

  Metric               Target
  -------------------- ----------
  IPC Round Trip       \<20 ms
  Message Validation   \<5 ms
  Stream Start         \<200 ms

------------------------------------------------------------------------

# Future Extensions

-   Binary message support
-   Mobile bridge
-   Cloud bridge
-   Plugin IPC
-   Remote execution

------------------------------------------------------------------------

# Acceptance Criteria

IPC is considered complete when:

-   Communication is typed.
-   Streaming works reliably.
-   UI never freezes.
-   Invalid requests are rejected safely.
-   New modules can register IPC endpoints without modifying existing
    channels.
