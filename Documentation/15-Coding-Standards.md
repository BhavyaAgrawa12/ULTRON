# ULTRON - Coding Standards

**Document:** 15-Coding-Standards.md\
**Version:** v1.0\
**Status:** Draft

------------------------------------------------------------------------

# Purpose

This document defines the engineering standards for developing ULTRON.

Every contributor must follow these standards to maintain consistency,
quality, performance and long-term maintainability.

------------------------------------------------------------------------

# Engineering Principles

-   Readability over cleverness
-   Performance before optimization hacks
-   Composition over duplication
-   Modular architecture
-   Documentation before implementation
-   Test before merge

------------------------------------------------------------------------

# Repository Rules

-   One feature per branch
-   One responsibility per module
-   No direct edits to `main`
-   Pull request required for merges

Branch naming:

-   feature/`<name>`{=html}
-   fix/`<name>`{=html}
-   refactor/`<name>`{=html}
-   docs/`<name>`{=html}

------------------------------------------------------------------------

# Naming Conventions

## Folders

-   kebab-case

## React Components

-   PascalCase

## Python Files

-   snake_case

## Classes

-   PascalCase

## Functions

-   camelCase (TypeScript)
-   snake_case (Python)

## Constants

-   UPPER_SNAKE_CASE

------------------------------------------------------------------------

# Code Organization

Every module should contain:

-   README.md
-   Public interfaces
-   Tests
-   Documentation
-   Implementation

------------------------------------------------------------------------

# Documentation Rules

Before implementation every module must define:

-   Purpose
-   Inputs
-   Outputs
-   Dependencies
-   Error handling
-   Performance target

------------------------------------------------------------------------

# Error Handling

-   Never ignore exceptions
-   Return meaningful errors
-   Log unexpected failures
-   Preserve user context whenever possible

------------------------------------------------------------------------

# Performance Rules

-   Avoid blocking the UI
-   Prefer async operations
-   Cache expensive computations
-   Profile before optimizing

Targets:

-   Startup \< 2 sec
-   Local commands \< 500 ms
-   Memory lookup \< 200 ms

------------------------------------------------------------------------

# Security Rules

-   Never hardcode secrets
-   Validate all inputs
-   Principle of least privilege
-   Confirm high-risk actions
-   Sanitize external data

------------------------------------------------------------------------

# Testing Requirements

Required test types:

-   Unit tests
-   Integration tests
-   IPC tests
-   Performance tests
-   Regression tests

Every feature must include appropriate tests.

------------------------------------------------------------------------

# Git Commit Format

Examples:

-   feat: add memory ranking
-   fix: resolve IPC timeout
-   refactor: simplify planner
-   docs: update AI router
-   test: add automation tests

------------------------------------------------------------------------

# Code Review Checklist

Before merging verify:

-   Documentation updated
-   Tests passing
-   No circular dependencies
-   Performance unchanged or improved
-   Security considerations reviewed
-   Logging added where appropriate

------------------------------------------------------------------------

# Definition of Done

A task is complete only when:

-   Implementation finished
-   Documentation updated
-   Tests pass
-   Code reviewed
-   Performance acceptable
-   No critical issues remain

------------------------------------------------------------------------

# Acceptance Criteria

These standards are considered adopted when every future contribution
follows this document consistently.
