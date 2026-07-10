// lib/instruction-details.ts

export interface InstructionMetadata {
  opcode: number;
  mnemonic: string;
  length: number; // in bytes
  machineCycles: number;
  tStates: number | string;
  addressingMode: string;
  description: string;
}

const REGISTERS = ["B", "C", "D", "E", "H", "L", "M", "A"];
const RP = ["B", "D", "H", "SP"];

export function decodeInstruction(memory: Uint8Array, pc: number): { hex: string[], meta: InstructionMetadata } {
  const opcode = memory[pc];
  let meta: InstructionMetadata = {
    opcode,
    mnemonic: `UNKNOWN`,
    length: 1,
    machineCycles: 1,
    tStates: "-",
    addressingMode: "-",
    description: "Unknown Instruction"
  };

  // Helper to format hex
  const toHex = (val: number) => val.toString(16).toUpperCase().padStart(2, "0");
  const read16 = () => `${toHex(memory[(pc + 2) & 0xFFFF])}${toHex(memory[(pc + 1) & 0xFFFF])}H`;
  const read8 = () => `${toHex(memory[(pc + 1) & 0xFFFF])}H`;

  if (opcode === 0x00) {
    meta = { opcode, mnemonic: "NOP", length: 1, machineCycles: 1, tStates: 4, addressingMode: "Implied", description: "No operation" };
  } else if (opcode === 0x76) {
    meta = { opcode, mnemonic: "HLT", length: 1, machineCycles: 1, tStates: 5, addressingMode: "Implied", description: "Halt execution" };
  } else if ((opcode & 0xC0) === 0x40 && opcode !== 0x76) {
    // MOV r1, r2 (01DDDSSS)
    const dst = REGISTERS[(opcode >> 3) & 0x07];
    const src = REGISTERS[opcode & 0x07];
    const isMem = dst === "M" || src === "M";
    meta = { 
      opcode, 
      mnemonic: `MOV ${dst}, ${src}`, 
      length: 1, 
      machineCycles: isMem ? 2 : 1, 
      tStates: isMem ? 7 : 4, 
      addressingMode: isMem ? "Register Indirect" : "Register", 
      description: `Copy contents of ${src} to ${dst}` 
    };
  } else if ((opcode & 0xC7) === 0x06) {
    // MVI r, data (00DDD110)
    const dst = REGISTERS[(opcode >> 3) & 0x07];
    const isMem = dst === "M";
    meta = {
      opcode,
      mnemonic: `MVI ${dst}, ${read8()}`,
      length: 2,
      machineCycles: isMem ? 3 : 2,
      tStates: isMem ? 10 : 7,
      addressingMode: "Immediate",
      description: `Load immediate data into ${dst}`
    };
  } else if ((opcode & 0xCF) === 0x01) {
    // LXI rp, data16 (00RR0001)
    const rp = RP[(opcode >> 4) & 0x03];
    meta = {
      opcode,
      mnemonic: `LXI ${rp}, ${read16()}`,
      length: 3,
      machineCycles: 3,
      tStates: 10,
      addressingMode: "Immediate",
      description: `Load 16-bit data into register pair ${rp}`
    };
  } else if ((opcode & 0xF8) === 0x80) {
    // ADD/ADC r
    const src = REGISTERS[opcode & 0x07];
    const isAdc = (opcode & 0x08) !== 0;
    const isMem = src === "M";
    meta = {
      opcode,
      mnemonic: `${isAdc ? 'ADC' : 'ADD'} ${src}`,
      length: 1,
      machineCycles: isMem ? 2 : 1,
      tStates: isMem ? 7 : 4,
      addressingMode: isMem ? "Register Indirect" : "Register",
      description: `Add ${src} ${isAdc ? 'with carry ' : ''}to Accumulator`
    };
  } else if ((opcode & 0xF8) === 0x90) {
    // SUB/SBB r
    const src = REGISTERS[opcode & 0x07];
    const isSbb = (opcode & 0x08) !== 0;
    const isMem = src === "M";
    meta = {
      opcode,
      mnemonic: `${isSbb ? 'SBB' : 'SUB'} ${src}`,
      length: 1,
      machineCycles: isMem ? 2 : 1,
      tStates: isMem ? 7 : 4,
      addressingMode: isMem ? "Register Indirect" : "Register",
      description: `Subtract ${src} ${isSbb ? 'with borrow ' : ''}from Accumulator`
    };
  } else if (opcode === 0x3A) {
    meta = { opcode, mnemonic: `LDA ${read16()}`, length: 3, machineCycles: 4, tStates: 13, addressingMode: "Direct", description: "Load Accumulator direct" };
  } else if (opcode === 0x32) {
    meta = { opcode, mnemonic: `STA ${read16()}`, length: 3, machineCycles: 4, tStates: 13, addressingMode: "Direct", description: "Store Accumulator direct" };
  } else if (opcode === 0xC3) {
    meta = { opcode, mnemonic: `JMP ${read16()}`, length: 3, machineCycles: 3, tStates: 10, addressingMode: "Immediate", description: "Jump unconditionally" };
  } else if (opcode === 0xCD) {
    meta = { opcode, mnemonic: `CALL ${read16()}`, length: 3, machineCycles: 5, tStates: 18, addressingMode: "Immediate/Register Indirect", description: "Call subroutine" };
  } else if (opcode === 0xC9) {
    meta = { opcode, mnemonic: `RET`, length: 1, machineCycles: 3, tStates: 10, addressingMode: "Register Indirect", description: "Return from subroutine" };
  } else {
    // Basic fallback for other length instructions based on opcode ranges
    // This isn't perfect for all 256 but avoids crashing.
    const is3Byte = (opcode & 0xCF) === 0xCD || (opcode & 0xC7) === 0xC2 || (opcode & 0xC7) === 0xC4;
    const is2Byte = (opcode & 0xC7) === 0xC6 || (opcode & 0xC7) === 0xCE || (opcode === 0xD3) || (opcode === 0xDB);
    
    meta = {
      opcode,
      mnemonic: `OP-${toHex(opcode)}`,
      length: is3Byte ? 3 : (is2Byte ? 2 : 1),
      machineCycles: 1,
      tStates: "-",
      addressingMode: "-",
      description: "Generic Instruction"
    };
  }

  // Generate hex bytes
  const hex = [];
  for (let i = 0; i < meta.length; i++) {
    hex.push(toHex(memory[(pc + i) & 0xFFFF]));
  }

  return { hex, meta };
}
