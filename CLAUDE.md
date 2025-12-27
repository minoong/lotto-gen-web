# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start development server with HMR
npm run build    # TypeScript compile + Vite production build
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Tech Stack

- React 19 with TypeScript
- Vite 7 for bundling and dev server
- ESLint with TypeScript and React hooks plugins

## Project Structure

- `src/main.tsx` - Application entry point, renders App in StrictMode
- `src/App.tsx` - Root component
- `vite.config.ts` - Vite configuration with React plugin
- `eslint.config.js` - ESLint flat config with TypeScript and React rules
- `tsconfig.json` - References separate configs for app (`tsconfig.app.json`) and node (`tsconfig.node.json`)
