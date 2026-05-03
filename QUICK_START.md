# 8085 Simulator - Quick Start Guide

## What's New

### 1. Complete Instruction Set
All 8085 instructions are now fully implemented and working:
- **Rotation Instructions**: RLC, RRC, RAL, RAR - now with correct behavior
- **Conditional Jumps**: JZ, JNZ, JC, JNC, JP, JM, JPE, JPO
- **Conditional Calls**: CZ, CNZ, CC, CNC, CP, CM, CPE, CPO
- **Conditional Returns**: RZ, RNZ, RC, RNC, RP, RM, RPE, RPO
- **All Data Transfer, Arithmetic, and Logical Instructions**

### 2. AI Assembly Tutor
A new AI-powered tutoring system is integrated into the simulator!

**Features:**
- **Guided Learning**: Ask the AI to teach you about any instruction
- **Code Review**: Get feedback on your assembly code
- **Debugging Help**: Get step-by-step debugging guidance

**Token System:**
- First message is **FREE** - no tokens required
- Each additional message costs 1 token
- Buy tokens in-app:
  - 5 tokens for $1.99
  - 20 tokens for $5.99

**Access the AI:**
Look for the **"AI Assembly Tutor"** panel on the right side of the simulator dashboard (desktop view). On mobile/tablet, scroll down to find it.

### 3. Better Hex Value Handling
- Hex values now work correctly in all formats: `FFH`, `0FFH`, `25H`
- 16-bit addresses in jumps work properly
- All numeric formats supported: hex (H), decimal (D), binary (B), characters ('C')

## Example Programs

### Simple Addition
```assembly
; Add two numbers and store result
MVI A, 25H      ; Load 25H into A
MVI B, 3AH      ; Load 3AH into B
ADD B           ; Add B to A
STA 2050H       ; Store result at address 2050H
HLT             ; Halt
```

### Conditional Jump Example
```assembly
; Check if A is zero
MVI A, 00H      ; Load 0 into A
JZ ZERO         ; Jump if zero
MVI A, 01H      ; This is skipped
ZERO: HLT       ; Halt
```

### Subroutine Example
```assembly
; Call a subroutine
LXI H, 2000H    ; Load H-L with address
CALL DOUBLE     ; Call subroutine
STA 2050H       ; Store result
HLT             ; Halt

DOUBLE:         ; Subroutine label
ADD A           ; Double the value (add to itself)
RET             ; Return to caller
```

## How to Use the AI Tutor

1. **For Learning**: Click "Guided Help" tab
   - Ask: "Teach me about MVI instruction"
   - Ask: "How do I add two numbers?"
   - Ask: "Explain conditional jumps"

2. **For Code Review**: Click "Code Review" tab
   - Paste your code and ask: "Review my code"
   - Ask: "Is my logic correct?"
   - Ask: "Any optimization suggestions?"

3. **For Debugging**: Click "Debugging" tab
   - Describe the issue: "My program doesn't jump when it should"
   - Provide details: "Register A has value 42H but JZ still executes"
   - Ask: "Why does this happen?"

## Control Guide

### Buttons
- **Assemble**: Compile your assembly code to machine code
- **Run**: Execute the program from start to finish
- **Step**: Execute one instruction at a time
- **Reset**: Clear all registers and memory
- **Clear**: Clear the code editor

### Viewing Results
- **Registers**: Shows current values of A, B, C, D, E, H, L, PC, SP
- **Flags**: Shows Z, S, P, CY, AC status
- **Memory**: Shows memory contents (click on address to inspect)
- **I/O Ports**: Shows any values written to I/O ports

## Tips & Tricks

1. **Use Labels**: They make your code more readable
   ```assembly
   LOOP: ADD B
        DCR A
        JNZ LOOP    ; Jump back if not zero
   ```

2. **Register Pairs**: Use H-L for 16-bit addresses
   ```assembly
   LXI H, 2000H    ; Load address into H-L pair
   MOV A, M        ; Load value from memory at address in H-L
   ```

3. **Flags Matter**: Know which instructions affect which flags
   ```assembly
   CMP B           ; Compare A with B (sets flags)
   JZ EQUAL        ; Jump if equal (Z flag = 1)
   ```

4. **Stack Operations**: Useful for saving registers
   ```assembly
   PUSH B          ; Save B-C pair on stack
   ; ... do something ...
   POP B           ; Restore B-C pair
   ```

## Common Instructions Reference

| Instruction | Description | Example |
|-----------|-----------|---------|
| MVI | Move immediate (8-bit) | `MVI A, 42H` |
| LXI | Load immediate (16-bit) | `LXI H, 2000H` |
| MOV | Move register to register | `MOV A, B` |
| ADD | Add register to A | `ADD B` |
| SUB | Subtract register from A | `SUB C` |
| INR | Increment register | `INR A` |
| DCR | Decrement register | `DCR B` |
| JMP | Jump unconditional | `JMP LABEL` |
| JZ  | Jump if zero | `JZ LABEL` |
| CALL | Call subroutine | `CALL SUBR` |
| RET | Return from subroutine | `RET` |
| PUSH | Push to stack | `PUSH B` |
| POP | Pop from stack | `POP D` |
| HLT | Halt execution | `HLT` |

## Troubleshooting

### "Unknown instruction" error
- Check spelling (case-insensitive)
- Make sure you're using valid 8085 instructions
- Check for typos in register names

### "Invalid operands" error
- Check operand format (registers vs immediate values)
- Use correct addressing modes
- Register names: A, B, C, D, E, H, L, M
- Register pairs: B (BC), D (DE), H (HL), SP

### Program doesn't jump correctly
- Check if the condition flag is set
- Use Step button to trace through
- Verify your label names match exactly
- Remember: Z=1 means zero, CY=1 means carry set

### Memory values don't appear
- Make sure you're using STA/STAX to write to memory
- Check you're viewing the right memory address
- Use LDA/LDAX to read from memory

## More Help

Use the **AI Assembly Tutor** for detailed help on any instruction or concept!
- Ask about specific instructions
- Request code reviews
- Get debugging help
- Learn 8085 assembly step-by-step

Start with the free message, or buy tokens for continued learning!

---

Happy learning! Enjoy the 8085 Microprocessor Simulator! 🚀
