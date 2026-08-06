# ULTRON - AI Router

**Document:** 08-AI-Router.md\
**Version:** v1.0\
**Status:** Draft

------------------------------------------------------------------------

# Purpose

The AI Router determines whether a user request should be handled by
local logic, a local language model, or a cloud AI provider.

Its goal is to maximize performance, minimize cost, and keep ULTRON
provider-agnostic.

------------------------------------------------------------------------

# Objectives

-   Minimize unnecessary AI calls
-   Reduce latency
-   Support multiple providers
-   Allow seamless provider switching
-   Work offline whenever possible

------------------------------------------------------------------------

# Routing Philosophy

AI is the **last** option.

Priority:

1.  Local Logic
2.  Memory Engine
3.  Local Model
4.  Cloud AI

------------------------------------------------------------------------

# Routing Flow

``` text
User Request
      │
Intent Engine
      │
Need AI?
 ├── No
 │     │
 │  Execute Local Tool
 │
 └── Yes
       │
Need Memory?
       │
Memory Retrieval
       │
Need Reasoning?
       │
Local Model Available?
 ├── Yes → Local Model
 └── No  → Cloud Provider
       │
Response
```

------------------------------------------------------------------------

# Request Categories

## Local Only

Examples:

-   Open Chrome
-   Launch VS Code
-   Volume control
-   File operations
-   Clipboard
-   Screenshots

No LLM required.

------------------------------------------------------------------------

## Memory Assisted

Examples:

-   Continue yesterday's work
-   What project was I working on?
-   Remember this

Uses Memory Engine first.

------------------------------------------------------------------------

## Local Model

Recommended for:

-   Summaries
-   Translation
-   Small coding tasks
-   Offline chat
-   Basic reasoning

Suggested models:

-   Gemma 3 1B
-   Qwen 2.5 1.5B

------------------------------------------------------------------------

## Cloud AI

Reserved for:

-   Deep reasoning
-   Complex research
-   Large code generation
-   Long document analysis
-   Advanced planning

Supported providers:

-   Gemini
-   OpenAI
-   Groq
-   OpenRouter
-   Ollama (remote)
-   LM Studio

------------------------------------------------------------------------

# Provider Interface

Every provider implements:

-   initialize()
-   is_available()
-   chat()
-   stream()
-   embeddings()
-   health_check()

The Brain communicates only with this interface.

------------------------------------------------------------------------

# Fallback Strategy

Priority example:

1.  Local Logic
2.  Local Model
3.  Groq
4.  Gemini
5.  OpenAI

If one provider fails, the router automatically tries the next eligible
provider.

------------------------------------------------------------------------

# Cost Optimization

Rules:

-   Never use cloud AI for deterministic tasks.
-   Cache repeat requests when appropriate.
-   Reuse conversation context.
-   Stream responses whenever supported.

------------------------------------------------------------------------

# Performance Targets

  Metric              Target
  ------------------- ---------------------
  Route Decision      \<20 ms
  Local Model Start   \<300 ms
  Cloud First Token   \<1 sec (streaming)

------------------------------------------------------------------------

# Error Handling

If no provider is available:

-   Explain the limitation.
-   Suggest offline alternatives.
-   Preserve conversation context.

------------------------------------------------------------------------

# Future Extensions

-   Dynamic model benchmarking
-   Automatic provider selection by quality
-   User-defined routing policies
-   Specialized models for coding, research and vision

------------------------------------------------------------------------

# Acceptance Criteria

The AI Router is complete when:

-   Providers are interchangeable.
-   The Brain never depends on a specific provider.
-   Offline mode continues to function.
-   Provider failures do not crash ULTRON.
