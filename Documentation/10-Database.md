# ULTRON - Database Design

**Document:** 10-Database.md\
**Version:** v1.0\
**Status:** Draft

------------------------------------------------------------------------

# Purpose

This document defines the data architecture for ULTRON.

The database is responsible for persistent storage of user information,
memories, projects, preferences, devices and application state.

------------------------------------------------------------------------

# Design Principles

-   Local-first
-   Offline capable
-   Fast reads
-   Secure by default
-   Versioned schema
-   Future cloud synchronization

------------------------------------------------------------------------

# Database Technology

Primary Database: - SQLite

Future: - PostgreSQL (Cloud) - Vector Database (Semantic Search)

------------------------------------------------------------------------

# Core Entities

``` text
User
 │
 ├── Preferences
 ├── Memories
 ├── Projects
 ├── Conversations
 ├── Devices
 ├── Research
 ├── Automations
 └── Logs
```

------------------------------------------------------------------------

# Tables

## users

Stores profile information.

Fields: - id - display_name - created_at - updated_at

------------------------------------------------------------------------

## preferences

Stores:

-   language
-   theme
-   voice
-   personality
-   AI provider
-   privacy settings

------------------------------------------------------------------------

## memories

Stores:

-   memory_id
-   title
-   content
-   memory_type
-   importance_score
-   tags
-   created_at
-   updated_at

------------------------------------------------------------------------

## conversations

Stores:

-   conversation_id
-   title
-   summary
-   started_at
-   last_active

------------------------------------------------------------------------

## messages

Stores:

-   role
-   content
-   timestamp
-   conversation_id

------------------------------------------------------------------------

## projects

Stores:

-   name
-   path
-   technology
-   git_repository
-   status
-   last_opened

------------------------------------------------------------------------

## workspace

Stores:

-   open applications
-   terminals
-   browser tabs
-   windows layout

------------------------------------------------------------------------

## devices

Stores:

-   device_id
-   device_name
-   platform
-   trusted
-   last_seen

------------------------------------------------------------------------

## research

Stores:

-   title
-   summary
-   sources
-   tags

------------------------------------------------------------------------

## logs

Stores:

-   action
-   status
-   duration
-   timestamp

------------------------------------------------------------------------

# Relationships

``` text
User
 ├── Preferences (1:1)
 ├── Memories (1:N)
 ├── Conversations (1:N)
 │      └── Messages (1:N)
 ├── Projects (1:N)
 ├── Devices (1:N)
 └── Research (1:N)
```

------------------------------------------------------------------------

# Index Strategy

Indexes should exist on:

-   memory_type
-   tags
-   project_name
-   last_opened
-   last_seen
-   timestamps

------------------------------------------------------------------------

# Encryption

Sensitive fields should be encrypted at rest.

Examples:

-   API keys
-   Access tokens
-   Device secrets

------------------------------------------------------------------------

# Backup Strategy

-   Manual export
-   Scheduled local backups
-   Future encrypted cloud backup

------------------------------------------------------------------------

# Migration Strategy

Every schema change must use versioned migrations.

No direct production schema edits.

------------------------------------------------------------------------

# Performance Targets

  Metric            Target
  ----------------- ----------
  Startup DB Load   \<100 ms
  Memory Query      \<200 ms
  Project Lookup    \<100 ms
  Insert            \<50 ms

------------------------------------------------------------------------

# Future Expansion

-   Multi-user profiles
-   Shared memories
-   Cloud sync
-   Semantic indexing
-   Analytics

------------------------------------------------------------------------

# Acceptance Criteria

The database is complete when:

-   All core entities are normalized.
-   Migrations are versioned.
-   Offline mode is fully supported.
-   Data can be backed up and restored.
-   Future cloud synchronization requires no schema redesign.
