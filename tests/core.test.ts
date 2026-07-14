import { describe, it, expect, beforeEach } from 'vitest';
import { Emulator8085 } from '../lib/emulator';
import { Assembler8085 } from '../lib/assembler';

describe('8085 Core Architecture & Execution Engine', () => {
  let emulator: Emulator8085;
  let assembler: Assembler8085;

  beforeEach(() => {
    emulator = new Emulator8085();
    assembler = new Assembler8085();
  });

  const runCode = (code: string) => {
    const result = assembler.assemble(code);
    expect(result.errors).toHaveLength(0);
    emulator.loadProgram(result.machineCode);
    emulator.run();
    return emulator.getState();
  };

  it('Test 1: Writes 55H to Port 00H', () => {
    const code = `
      MVI A,55H
      OUT 00H
      HLT
    `;
    const state = runCode(code);
    expect(state.ioPorts.get(0x00)).toBe(0x55);
  });

  it('Test 2: PUSH/POP PSW and Stack Integrity', () => {
    const code = `
      LXI SP,FFFFH
      MVI A,55H
      PUSH PSW
      MVI A,AAH
      POP PSW
      OUT 00H
      HLT
    `;
    const state = runCode(code);
    expect(state.registers.A).toBe(0x55);
    expect(state.ioPorts.get(0x00)).toBe(0x55);
    expect(state.registers.SP).toBe(0xFFFF); // Stack pointer must return to original
  });

  it('Test 3: CALL, RET, and Delay Routine', () => {
    const code = `
LXI SP,FFFFH
MVI A,01H

LOOP:
OUT 00H
CALL DELAY
INR A
CPI 0BH
JNZ LOOP
HLT

DELAY:
PUSH PSW
LXI B,0002H

D1:
DCX B
MOV A,B
ORA C
JNZ D1

POP PSW
RET
    `;
    const result = assembler.assemble(code);
    expect(result.errors).toHaveLength(0);
    emulator.loadProgram(result.machineCode);

    const outputSequence: number[] = [];
    
    // Override setPort to spy on it
    const originalSetPort = emulator.setPort.bind(emulator);
    emulator.setPort = (port, value) => {
      if (port === 0x00) {
        outputSequence.push(value);
      }
      originalSetPort(port, value);
    };

    // Run enough instructions to complete the entire sequence
    let count = 0;
    while (!emulator.getState().halted && count < 200000) {
      emulator.step();
      count++;
    }
    
    expect(outputSequence).toEqual([
      0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A
    ]);
  });

  it('Test 4: Verify Stack Behavior (PUSH/POP exactly 2 bytes)', () => {
    const code = `
      LXI SP,FFFFH
      MVI A,AAH
      PUSH PSW
      HLT
    `;
    const state = runCode(code);
    expect(state.registers.SP).toBe(0xFFFD); // FFFF - 2 = FFFD
    
    // High byte (A = AA) should be at SP-1 (FFFE)
    expect(state.memory[0xFFFE]).toBe(0xAA);
    // Low byte (Flags) should be at SP-2 (FFFD)
    // We expect bit 1 to be 1, others 0 since we didn't do arithmetic
    expect(state.memory[0xFFFD]).toBe(0x02);
  });
});
