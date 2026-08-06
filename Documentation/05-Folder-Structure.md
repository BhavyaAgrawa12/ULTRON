# ULTRON - Folder Structure

**Document:** 05-Folder-Structure.md\
**Version:** v1.0\
**Status:** Draft

------------------------------------------------------------------------

# Purpose

This document defines the official repository structure for ULTRON.

The structure is designed for long-term scalability, modular
development, and future expansion into a complete ecosystem.

------------------------------------------------------------------------

# Monorepo Layout

``` text
ultron/
│
├── apps/
│   ├── desktop/
│   ├── mobile/
│   └── cloud/
│
├── packages/
│   ├── core/
│   ├── memory/
│   ├── ai-router/
│   ├── automation/
│   ├── plugins/
│   ├── shared/
│   └── sdk/
│
├── services/
│   ├── voice/
│   ├── vision/
│   ├── research/
│   └── sync/
│
├── docs/
├── scripts/
├── assets/
├── tests/
├── README.md
└── LICENSE
```

------------------------------------------------------------------------

# Folder Responsibilities

## apps/

Contains runnable applications.

### desktop/

Electron + React desktop application.

### mobile/

Future Android client.

### cloud/

Future synchronization services.

------------------------------------------------------------------------

## packages/

Reusable business modules.

### core/

Conversation engine, planner, personality, context manager.

### memory/

Memory storage, retrieval, ranking and learning.

### ai-router/

Routes requests to local or cloud providers.

### automation/

Windows automation, browser control, workspace restore.

### plugins/

Plugin runtime and loader.

### shared/

Common utilities, types and constants.

### sdk/

Developer SDK for future plugin authors.

------------------------------------------------------------------------

## services/

Standalone supporting services.

-   Voice
-   Vision
-   Research
-   Synchronization

Each service exposes a stable interface to the core.

------------------------------------------------------------------------

## docs/

Engineering documentation.

No implementation belongs here.

------------------------------------------------------------------------

## scripts/

Build scripts, automation and development utilities.

------------------------------------------------------------------------

## assets/

Icons, logos, animations, fonts and bundled resources.

------------------------------------------------------------------------

## tests/

Unit tests, integration tests and performance tests.

------------------------------------------------------------------------

# Design Rules

-   One responsibility per module.
-   No circular dependencies.
-   Shared code belongs only in `packages/shared`.
-   Core modules must not depend on UI code.
-   UI communicates with Core through defined interfaces only.

------------------------------------------------------------------------

# Dependency Direction

``` text
apps
   │
packages/core
   │
packages/*
   │
services
```

Lower layers must never depend on higher layers.

------------------------------------------------------------------------

# Naming Conventions

-   kebab-case for folders
-   PascalCase for React components
-   snake_case only when required by external tools
-   Meaningful module names only

------------------------------------------------------------------------

# Future Expansion

The structure supports:

-   macOS client
-   Linux client
-   Enterprise edition
-   Plugin marketplace
-   Cloud deployment
-   Additional AI providers

without restructuring the repository.

------------------------------------------------------------------------

# Acceptance Criteria

The repository is considered correctly organized when:

-   Every folder has a single purpose.
-   New modules can be added without moving existing code.
-   UI, Core and Services remain loosely coupled.
-   Documentation mirrors implementation.
