import { describe, it, expect, beforeEach } from 'vitest';
import { Emulator8085 } from '../lib/emulator';
import { Assembler8085 } from '../lib/assembler';

describe('8085 OUT Instruction and I/O Architecture', () => {
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
    expect(state.registers.A).toBe(0x55);
    expect(state.ioPorts.get(0x00)).toBe(0x55);
  });

  it('Test 2: Writes AAH to Port 00H', () => {
    const code = `
      MVI A,AAH
      OUT 00H
      HLT
    `;
    const state = runCode(code);
    expect(state.registers.A).toBe(0xAA);
    expect(state.ioPorts.get(0x00)).toBe(0xAA);
  });

  it('Test 3: Outputs sequence 01 to 0A', () => {
    const code = `
      MVI A,01H
      LOOP:
      OUT 00H
      INR A
      CPI 0BH
      JNZ LOOP
      HLT
    `;
    
    // For this test, we want to trace the values written to Port 00H
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

    emulator.run();
    
    expect(outputSequence).toEqual([
      0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A
    ]);
    
    const state = emulator.getState();
    expect(state.ioPorts.get(0x00)).toBe(0x0A);
  });

  it('Test 4: Latches output port value regardless of future accumulator changes', () => {
    const code = `
      MVI A,55H
      OUT 00H
      MVI A,AAH
      HLT
    `;
    const state = runCode(code);
    expect(state.registers.A).toBe(0xAA);
    expect(state.ioPorts.get(0x00)).toBe(0x55);
  });
  
  it('Verify opcode decoding and PC advancement', () => {
    const code = `OUT 00H`;
    const result = assembler.assemble(code);
    expect(result.errors).toHaveLength(0);
    
    // D3 is OUT, followed by 00 (port)
    expect(result.machineCode[0]).toBe(0xD3);
    expect(result.machineCode[1]).toBe(0x00);
    
    // Size is 2 bytes
    expect(result.instructions[0].bytes).toEqual([0xD3, 0x00]);
    
    emulator.loadProgram(result.machineCode);
    const initialPC = emulator.getState().registers.PC;
    
    // Step one instruction (OUT 00H)
    emulator.step();
    
    const finalPC = emulator.getState().registers.PC;
    expect(finalPC - initialPC).toBe(2); // PC should advance by exactly 2
  });
});
