import { describe, it, expect, beforeEach } from 'vitest';
import { Emulator8085 } from '../lib/emulator';
import { Assembler8085 } from '../lib/assembler';

describe('8085 PUSH/POP PSW and Stack Architecture', () => {
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

  it('Test 3: Delay routine', () => {
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
    
    const originalSetPort = emulator.setPort.bind(emulator);
    emulator.setPort = (port, value) => {
      if (port === 0x00) {
        outputSequence.push(value);
      }
      originalSetPort(port, value);
    };

    let count = 0;
    while (!emulator.getState().halted && count < 200000) {
      emulator.step();
      count++;
    }
    
    expect(outputSequence).toEqual([
      0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A
    ]);
  });
});
