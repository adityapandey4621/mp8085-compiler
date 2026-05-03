# MP8085 — Modern 8085 Microprocessor Simulator

<div align="center">

A modern, web-based simulator for the Intel 8085 microprocessor with real-time visualization and AI-powered assistance.

**[Live Demo](#) · [Documentation](#features) · [Getting Started](#getting-started)**

</div>

---

## ✨ Features

- **Complete 8085 Instruction Set** — All standard 8085 instructions supported (MOV, MVI, ADD, SUB, JMP, CALL, HLT, and 70+ more)
- **Real-time Register Visualization** — Watch A, B, C, D, E, H, L, PC, SP registers update live as you step through code
- **Interactive Memory Map** — Hex-grid memory viewer with program counter highlighting
- **Status Flag Display** — Visual indicators for Z, S, CY, P, AC flags with tooltips
- **Seven-Segment & LED Display** — Output peripherals showing accumulator values
- **Interrupt & Serial I/O Panel** — RST 7.5, RST 6.5, RST 5.5, TRAP, INTR visualization
- **I/O Port Viewer** — Monitor IN/OUT port activity
- **AI Assembly Tutor** — Get guided help, code reviews, and debugging assistance (powered by Gemini)
- **Syntax-Highlighted Code Editor** — Professional editor with line numbers and 8085 syntax support
- **Cloud Save** — Save and load your assembly programs (requires Google sign-in)
- **Dark Theme** — Stunning deep-black neon aesthetic designed for focus

## 🖥️ Screenshots

### Landing Page
The landing page showcases the simulator's features with a modern, dark design.

### Simulator Dashboard
The main simulator interface with code editor, CPU registers, memory map, flags, output displays, and AI assistant — all in one view.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Radix UI + shadcn/ui |
| **Authentication** | NextAuth.js (Google OAuth + Guest) |
| **Database** | Prisma ORM + SQLite (dev) / PostgreSQL (prod) |
| **AI** | Google Gemini API |
| **Animations** | Framer Motion + CSS |

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (auth, code save, AI)
│   ├── auth/signin/        # Sign-in page
│   ├── simulator/          # Main simulator page
│   ├── documentation/      # Docs page
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── simulator-dashboard.tsx  # Main simulator UI
│   ├── code-editor.tsx     # Assembly code editor
│   ├── register-display.tsx # CPU register panel
│   ├── memory-grid.tsx     # Memory hex viewer
│   ├── flag-display.tsx    # Status flags
│   ├── ai-assistant-panel.tsx # AI tutor
│   └── ui/                 # shadcn/ui components
├── lib/                    # Core logic
│   ├── assembler.ts        # 8085 assembler (source → machine code)
│   ├── emulator.ts         # 8085 CPU emulator
│   ├── auth.ts             # NextAuth configuration
│   └── prisma.ts           # Database client
├── hooks/                  # React hooks
│   ├── use-simulator.ts    # Simulator state management
│   └── use-ai-assistant.ts # AI chat logic
└── prisma/
    └── schema.prisma       # Database schema
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/adityapandey4621/mp8085-compiler.git
cd mp8085-compiler

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see below)

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
DATABASE_URL="file:./dev.db"           # SQLite for local dev
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string"
GOOGLE_CLIENT_ID=""                    # Optional: for Google sign-in
GOOGLE_CLIENT_SECRET=""                # Optional: for Google sign-in
GEMINI_API_KEY=""                      # Optional: for AI assistant
```

> **Note:** The app works without Google OAuth or Gemini keys — you can use Guest mode and the AI assistant has built-in fallback responses.

## 📋 Supported Instructions

### Data Transfer
`MOV` `MVI` `LXI` `LDA` `STA` `LHLD` `SHLD` `LDAX` `STAX` `XCHG`

### Arithmetic
`ADD` `ADI` `ADC` `ACI` `SUB` `SUI` `SBB` `SBI` `INR` `DCR` `INX` `DCX` `DAD` `CMP` `CPI`

### Logical
`ANA` `ANI` `XRA` `XRI` `ORA` `ORI` `CMA` `CMC` `STC` `RLC` `RRC` `RAL` `RAR`

### Branch
`JMP` `JC` `JNC` `JZ` `JNZ` `JP` `JM` `JPE` `JPO` `CALL` `RET` `RST` `PCHL` + conditional variants

### Stack & I/O
`PUSH` `POP` `XTHL` `SPHL` `IN` `OUT`

### Machine Control
`EI` `DI` `HLT` `NOP` `SIM` `RIM`

## 💡 Usage

1. **Write** your 8085 assembly code in the editor
2. **Assemble** — converts your code to machine code and loads it into memory
3. **Run** — executes the entire program at once
4. **Step** — executes one instruction at a time (great for debugging)
5. **Reset** — clears the CPU state
6. **Observe** — watch registers, flags, memory, and I/O ports update in real-time

### Example Program

```asm
; Add two numbers and store result
MVI A, 25H    ; Load 25H into accumulator
MVI B, 3AH    ; Load 3AH into register B
ADD B         ; Add B to A (result: 5FH)
STA 2050H     ; Store result at memory address 2050H
HLT           ; Halt execution
```

