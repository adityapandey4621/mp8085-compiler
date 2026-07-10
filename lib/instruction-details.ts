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
  } else if ((opcode & 0xCF) === 0xC5) {
    const rpId = (opcode >> 4) & 0x03;
    const rp = rpId === 3 ? "PSW" : RP[rpId];
    meta = { opcode, mnemonic: `PUSH ${rp}`, length: 1, machineCycles: 3, tStates: 11, addressingMode: "Register Indirect", description: `Push register pair ${rp} onto stack` };
  } else if ((opcode & 0xCF) === 0xC1) {
    const rpId = (opcode >> 4) & 0x03;
    const rp = rpId === 3 ? "PSW" : RP[rpId];
    meta = { opcode, mnemonic: `POP ${rp}`, length: 1, machineCycles: 3, tStates: 10, addressingMode: "Register Indirect", description: `Pop register pair ${rp} from stack` };
  } else if ((opcode & 0xCF) === 0x03) {
    const rp = RP[(opcode >> 4) & 0x03];
    meta = { opcode, mnemonic: `INX ${rp}`, length: 1, machineCycles: 1, tStates: 6, addressingMode: "Register", description: `Increment register pair ${rp}` };
  } else if ((opcode & 0xCF) === 0x0B) {
    const rp = RP[(opcode >> 4) & 0x03];
    meta = { opcode, mnemonic: `DCX ${rp}`, length: 1, machineCycles: 1, tStates: 6, addressingMode: "Register", description: `Decrement register pair ${rp}` };
  } else if ((opcode & 0xC7) === 0x04) {
    const dst = REGISTERS[(opcode >> 3) & 0x07];
    const isMem = dst === "M";
    meta = { opcode, mnemonic: `INR ${dst}`, length: 1, machineCycles: isMem ? 3 : 1, tStates: isMem ? 10 : 4, addressingMode: isMem ? "Register Indirect" : "Register", description: `Increment ${dst}` };
  } else if ((opcode & 0xC7) === 0x05) {
    const dst = REGISTERS[(opcode >> 3) & 0x07];
    const isMem = dst === "M";
    meta = { opcode, mnemonic: `DCR ${dst}`, length: 1, machineCycles: isMem ? 3 : 1, tStates: isMem ? 10 : 4, addressingMode: isMem ? "Register Indirect" : "Register", description: `Decrement ${dst}` };
  } else if ((opcode & 0xF8) === 0xA0) {
    const src = REGISTERS[opcode & 0x07];
    const isMem = src === "M";
    meta = { opcode, mnemonic: `ANA ${src}`, length: 1, machineCycles: isMem ? 2 : 1, tStates: isMem ? 7 : 4, addressingMode: isMem ? "Register Indirect" : "Register", description: `Logical AND ${src} with Accumulator` };
  } else if ((opcode & 0xF8) === 0xA8) {
    const src = REGISTERS[opcode & 0x07];
    const isMem = src === "M";
    meta = { opcode, mnemonic: `XRA ${src}`, length: 1, machineCycles: isMem ? 2 : 1, tStates: isMem ? 7 : 4, addressingMode: isMem ? "Register Indirect" : "Register", description: `Exclusive OR ${src} with Accumulator` };
  } else if ((opcode & 0xF8) === 0xB0) {
    const src = REGISTERS[opcode & 0x07];
    const isMem = src === "M";
    meta = { opcode, mnemonic: `ORA ${src}`, length: 1, machineCycles: isMem ? 2 : 1, tStates: isMem ? 7 : 4, addressingMode: isMem ? "Register Indirect" : "Register", description: `Logical OR ${src} with Accumulator` };
  } else if ((opcode & 0xF8) === 0xB8) {
    const src = REGISTERS[opcode & 0x07];
    const isMem = src === "M";
    meta = { opcode, mnemonic: `CMP ${src}`, length: 1, machineCycles: isMem ? 2 : 1, tStates: isMem ? 7 : 4, addressingMode: isMem ? "Register Indirect" : "Register", description: `Compare ${src} with Accumulator` };
  } else if ((opcode & 0xC7) === 0xC6) {
    const opId = (opcode >> 3) & 0x07;
    const ops = ["ADI", "ACI", "SUI", "SBI", "ANI", "XRI", "ORI", "CPI"];
    const op = ops[opId];
    meta = { opcode, mnemonic: `${op} ${read8()}`, length: 2, machineCycles: 2, tStates: 7, addressingMode: "Immediate", description: `Immediate operation: ${op}` };
  } else if (opcode === 0xEB) { meta = { opcode, mnemonic: "XCHG", length: 1, machineCycles: 1, tStates: 4, addressingMode: "Register", description: "Exchange H-L with D-E" };
  } else if (opcode === 0xE3) { meta = { opcode, mnemonic: "XTHL", length: 1, machineCycles: 5, tStates: 18, addressingMode: "Register Indirect", description: "Exchange H-L with top of stack" };
  } else if (opcode === 0xF9) { meta = { opcode, mnemonic: "SPHL", length: 1, machineCycles: 1, tStates: 5, addressingMode: "Register", description: "Copy H-L to Stack Pointer" };
  } else if (opcode === 0xE9) { meta = { opcode, mnemonic: "PCHL", length: 1, machineCycles: 1, tStates: 5, addressingMode: "Register", description: "Copy H-L to Program Counter" };
  } else if (opcode === 0x27) { meta = { opcode, mnemonic: "DAA", length: 1, machineCycles: 1, tStates: 4, addressingMode: "Implied", description: "Decimal Adjust Accumulator" };
  } else if (opcode === 0x2F) { meta = { opcode, mnemonic: "CMA", length: 1, machineCycles: 1, tStates: 4, addressingMode: "Implied", description: "Complement Accumulator" };
  } else if (opcode === 0x37) { meta = { opcode, mnemonic: "STC", length: 1, machineCycles: 1, tStates: 4, addressingMode: "Implied", description: "Set Carry Flag" };
  } else if (opcode === 0x3F) { meta = { opcode, mnemonic: "CMC", length: 1, machineCycles: 1, tStates: 4, addressingMode: "Implied", description: "Complement Carry Flag" };
  } else if (opcode === 0xD3) { meta = { opcode, mnemonic: `OUT ${read8()}`, length: 2, machineCycles: 3, tStates: 10, addressingMode: "Direct", description: "Output to port" };
  } else if (opcode === 0xDB) { meta = { opcode, mnemonic: `IN ${read8()}`, length: 2, machineCycles: 3, tStates: 10, addressingMode: "Direct", description: "Input from port" };
  } else if (opcode === 0x0A) { meta = { opcode, mnemonic: "LDAX B", length: 1, machineCycles: 2, tStates: 7, addressingMode: "Register Indirect", description: "Load A from address in BC" };
  } else if (opcode === 0x1A) { meta = { opcode, mnemonic: "LDAX D", length: 1, machineCycles: 2, tStates: 7, addressingMode: "Register Indirect", description: "Load A from address in DE" };
  } else if (opcode === 0x02) { meta = { opcode, mnemonic: "STAX B", length: 1, machineCycles: 2, tStates: 7, addressingMode: "Register Indirect", description: "Store A to address in BC" };
  } else if (opcode === 0x12) { meta = { opcode, mnemonic: "STAX D", length: 1, machineCycles: 2, tStates: 7, addressingMode: "Register Indirect", description: "Store A to address in DE" };
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
