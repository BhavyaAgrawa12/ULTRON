# ULTRON - Technology Stack

**Document:** 04-Technology-Stack.md\
**Version:** v1.0\
**Status:** Draft

------------------------------------------------------------------------

# Purpose

This document defines the official technology stack for ULTRON and
explains why each technology has been selected.

The stack prioritizes performance, maintainability, modularity, and
long-term scalability.

------------------------------------------------------------------------

# Design Principles

-   Use the right tool for each responsibility.
-   Avoid vendor lock-in.
-   Keep AI providers replaceable.
-   Prefer mature, well-supported technologies.
-   Optimize for long-term maintainability.

------------------------------------------------------------------------

# Desktop Client

## Framework

-   Electron

Reason: - Native desktop application - Windows integration - Mature
ecosystem

## Frontend

-   React
-   TypeScript
-   Tailwind CSS
-   Framer Motion

Purpose: - Modern UI - Strong typing - Reusable components - Smooth
animations

------------------------------------------------------------------------

# ULTRON Core

Language: - Python 3.12+

Reason: - Excellent AI ecosystem - Automation libraries - Computer
vision - Fast prototyping

------------------------------------------------------------------------

# Backend Framework

-   FastAPI

Responsibilities: - IPC endpoints - Core services - Internal APIs -
Background tasks

------------------------------------------------------------------------

# AI Providers

Supported:

-   Gemini
-   OpenAI
-   Groq
-   OpenRouter
-   Ollama
-   LM Studio

Rule:

The core never depends directly on one provider.

All providers implement the same interface.

------------------------------------------------------------------------

# Local Models

Recommended minimum:

-   Gemma 3 1B
-   Qwen 2.5 1.5B

Future:

-   Larger Ollama models
-   Additional local runtimes

------------------------------------------------------------------------

# Databases

Primary: - SQLite

Future: - PostgreSQL (Cloud) - Vector Database for semantic memory

------------------------------------------------------------------------

# Automation

Libraries may include:

-   Playwright
-   PyAutoGUI
-   Windows APIs
-   psutil

Purpose: - Browser automation - Desktop control - System information

------------------------------------------------------------------------

# Voice

Speech-to-Text: - Whisper (or compatible)

Text-to-Speech: - Initially provider TTS - Future custom voice pipeline

------------------------------------------------------------------------

# Vision

Potential libraries:

-   OpenCV
-   OCR engine
-   AI vision models

------------------------------------------------------------------------

# Development Tools

-   Git
-   GitHub
-   VS Code
-   Prettier
-   ESLint
-   Ruff
-   Black

------------------------------------------------------------------------

# Packaging

Desktop: - Electron Builder

Future: - Auto-updater - Signed installers

------------------------------------------------------------------------

# Technology Selection Criteria

Every dependency must satisfy:

-   Actively maintained
-   Good documentation
-   Stable community
-   Replaceable if needed
-   Production ready

------------------------------------------------------------------------

# Future Review

The technology stack should be reviewed before every major release to
determine whether a newer technology provides a significant benefit
without introducing unnecessary complexity.
