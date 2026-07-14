"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emulator_1 = require("./lib/emulator");
const assembler_1 = require("./lib/assembler");
const assembler = new assembler_1.Assembler8085();
const emulator = new emulator_1.Emulator8085();
const code = `MVI A,55H
OUT 00H
HLT`;
const result = assembler.assemble(code);
console.log('Machine code:', result.machineCode);
console.log('Instructions:', result.instructions);
emulator.loadProgram(result.machineCode);
emulator.run();
const state = emulator.getState();
console.log('Register A:', state.registers.A.toString(16));
console.log('Port 00H:', state.ioPorts.get(0));
