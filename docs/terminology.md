# Terminology

This document defines core Stacksmith terms so future planning and implementation tasks use the same language.

## Builder

A person using Stacksmith to create software. A builder can be a developer, beginner developer, founder, student, designer, technical non-coder, indie hacker, agency person, or anyone who wants to build without platform lock-in.

## Studio

The local browser interface for Stacksmith. The planned studio runs on localhost and guides the user through project creation, blueprint review, generation, preview, and chat edits.

## Blueprint

A structured plan generated before code is written. A blueprint should describe the app, target users, screens, components, data models, database tables, API routes, auth requirements, file structure, environment variables, integrations, risks, unclear requirements, build steps, and generation boundaries.

## Plan Mode

A mode where Stacksmith creates or updates the blueprint only. Plan Mode should not write project files.

## Build Mode

A mode where Stacksmith generates or edits code after the user approves a blueprint or change plan.

## Fix Mode

A future mode where Stacksmith reads errors, logs, or failing commands and proposes fixes before applying changes.

## Chat/Edit Mode

A mode where the user asks for changes in natural language, such as adding dark mode, improving a page, changing schema, or fixing an error. Significant changes should still be reviewable before they are applied.

## Generated Project

The app, website, dashboard, tool, or full-stack project created by Stacksmith. Generated projects should be separate from Stacksmith itself and should remain usable without Stacksmith.

## Workspace

The local folder where Stacksmith stores or creates generated projects. The workspace should keep generated projects separate from Stacksmith core files.

## Provider Adapter

An internal adapter that lets Stacksmith communicate with an AI provider or local model without tying the rest of the product to one vendor.

## Database Adapter

An internal adapter that represents a database mode such as no database, SQLite, Supabase, or future database providers.

## Local-First

A product direction where Stacksmith runs on the user's machine and keeps the default development workflow local.

## Own Your Code

The principle that generated projects should be normal codebases the user can inspect, edit, run, commit, move, and deploy without being locked into Stacksmith.
