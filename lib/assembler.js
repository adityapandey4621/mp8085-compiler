"use strict";
// 8085 Assembler - Converts assembly code to machine code
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assembler8085 = void 0;
const analyzer_1 = require("./analyzer");
class Assembler8085 {
    labels = new Map();
    instructions = [];
    parsedInstructions = [];
    errors = [];
    currentAddress = 0;
    // Instruction set mapping
    instructionMap = new Map([
        // Data Transfer Instructions
        ['MOV', this.encodeMOV.bind(this)],
        ['MVI', this.encodeMVI.bind(this)],
        ['LXI', this.encodeLXI.bind(this)],
        ['LDA', this.encodeLDA.bind(this)],
        ['STA', this.encodeSTA.bind(this)],
        ['LHLD', this.encodeLHLD.bind(this)],
        ['SHLD', this.encodeSHLD.bind(this)],
        ['LDAX', this.encodeLDAX.bind(this)],
        ['STAX', this.encodeSTAX.bind(this)],
        ['XCHG', this.encodeXCHG.bind(this)],
        // Arithmetic Instructions
        ['ADD', this.encodeADD.bind(this)],
        ['ADI', this.encodeADI.bind(this)],
        ['ADC', this.encodeADC.bind(this)],
        ['ACI', this.encodeACI.bind(this)],
        ['SUB', this.encodeSUB.bind(this)],
        ['SUI', this.encodeSUI.bind(this)],
        ['SBB', this.encodeSBB.bind(this)],
        ['SBI', this.encodeSBI.bind(this)],
        ['INR', this.encodeINR.bind(this)],
        ['DCR', this.encodeDCR.bind(this)],
        ['INX', this.encodeINX.bind(this)],
        ['DCX', this.encodeDCX.bind(this)],
        ['DAD', this.encodeDAD.bind(this)],
        ['DAA', this.encodeDAA.bind(this)],
        ['CMP', this.encodeCMP.bind(this)],
        ['CPI', this.encodeCPI.bind(this)],
        // Logical Instructions
        ['ANA', this.encodeANA.bind(this)],
        ['ANI', this.encodeANI.bind(this)],
        ['XRA', this.encodeXRA.bind(this)],
        ['XRI', this.encodeXRI.bind(this)],
        ['ORA', this.encodeORA.bind(this)],
        ['ORI', this.encodeORI.bind(this)],
        ['CMA', this.encodeCMA.bind(this)],
        ['CMC', this.encodeCMC.bind(this)],
        ['STC', this.encodeSTC.bind(this)],
        ['RAR', this.encodeRAR.bind(this)],
        ['RAL', this.encodeRAL.bind(this)],
        ['RRC', this.encodeRRC.bind(this)],
        ['RLC', this.encodeRLC.bind(this)],
        // Branch Instructions
        ['JMP', this.encodeJMP.bind(this)],
        ['JC', this.encodeJC.bind(this)],
        ['JNC', this.encodeJNC.bind(this)],
        ['JZ', this.encodeJZ.bind(this)],
        ['JNZ', this.encodeJNZ.bind(this)],
        ['JP', this.encodeJP.bind(this)],
        ['JM', this.encodeJM.bind(this)],
        ['JPE', this.encodeJPE.bind(this)],
        ['JPO', this.encodeJPO.bind(this)],
        ['CALL', this.encodeCALL.bind(this)],
        ['CC', this.encodeCC.bind(this)],
        ['CNC', this.encodeCNC.bind(this)],
        ['CZ', this.encodeCZ.bind(this)],
        ['CNZ', this.encodeCNZ.bind(this)],
        ['CP', this.encodeCP.bind(this)],
        ['CM', this.encodeCM.bind(this)],
        ['CPE', this.encodeCPE.bind(this)],
        ['CPO', this.encodeCPO.bind(this)],
        ['RET', this.encodeRET.bind(this)],
        ['RC', this.encodeRC.bind(this)],
        ['RNC', this.encodeRNC.bind(this)],
        ['RZ', this.encodeRZ.bind(this)],
        ['RNZ', this.encodeRNZ.bind(this)],
        ['RP', this.encodeRP.bind(this)],
        ['RM', this.encodeRM.bind(this)],
        ['RPE', this.encodeRPE.bind(this)],
        ['RPO', this.encodeRPO.bind(this)],
        ['RST', this.encodeRST.bind(this)],
        ['PCHL', this.encodePCHL.bind(this)],
        // Stack Instructions
        ['PUSH', this.encodePUSH.bind(this)],
        ['POP', this.encodePOP.bind(this)],
        ['XTHL', this.encodeXTHL.bind(this)],
        ['SPHL', this.encodeSPHL.bind(this)],
        // I/O Instructions
        ['IN', this.encodeIN.bind(this)],
        ['OUT', this.encodeOUT.bind(this)],
        // Machine Control Instructions
        ['EI', this.encodeEI.bind(this)],
        ['DI', this.encodeDI.bind(this)],
        ['HLT', this.encodeHLT.bind(this)],
        ['NOP', this.encodeNOP.bind(this)],
        ['SIM', this.encodeSIM.bind(this)],
        ['RIM', this.encodeRIM.bind(this)],
    ]);
    // Register encoding
    registerMap = new Map([
        ['A', 7],
        ['B', 0],
        ['C', 1],
        ['D', 2],
        ['E', 3],
        ['H', 4],
        ['L', 5],
        ['M', 6],
    ]);
    // Register pair encoding
    registerPairMap = new Map([
        ['B', 0],
        ['D', 1],
        ['H', 2],
        ['SP', 3],
    ]);
    // Condition codes
    conditionMap = new Map([
        ['NZ', 0],
        ['Z', 1],
        ['NC', 2],
        ['C', 3],
        ['PO', 4],
        ['PE', 5],
        ['P', 6],
        ['M', 7],
    ]);
    // Parse a line of assembly code
    parseLine(line) {
        line = line.trim();
        // Remove comments
        const commentIndex = line.indexOf(';');
        if (commentIndex !== -1) {
            line = line.substring(0, commentIndex).trim();
        }
        if (!line) {
            return { label: null, instruction: null, operands: [] };
        }
        let label = null;
        let instruction = null;
        let operands = [];
        // Check for label
        if (line.includes(':')) {
            const parts = line.split(':');
            label = parts[0].trim();
            line = parts.slice(1).join(':').trim();
        }
        // Parse instruction and operands
        if (line) {
            const parts = line.split(/\s+/);
            instruction = parts[0].toUpperCase();
            if (parts.length > 1) {
                const operandStr = parts.slice(1).join(' ');
                operands = operandStr.split(',').map(op => op.trim());
            }
        }
        return { label, instruction, operands };
    }
    // Convert hex string to number
    parseNumber(str) {
        str = str.toUpperCase();
        if (str.endsWith('H')) {
            // Hexadecimal
            const hexStr = str.substring(0, str.length - 1);
            if (/^[0-9A-F]+$/.test(hexStr)) {
                return parseInt(hexStr, 16);
            }
        }
        else if (str.endsWith('D')) {
            // Decimal
            const decStr = str.substring(0, str.length - 1);
            if (/^[0-9]+$/.test(decStr)) {
                return parseInt(decStr, 10);
            }
        }
        else if (str.endsWith('B')) {
            // Binary
            const binStr = str.substring(0, str.length - 1);
            if (/^[01]+$/.test(binStr)) {
                return parseInt(binStr, 2);
            }
        }
        else if (str.startsWith("'") && str.endsWith("'") && str.length === 3) {
            // Character
            return str.charCodeAt(1);
        }
        else if (str.startsWith('0X')) {
            // Hexadecimal with 0x prefix
            const hexStr = str.substring(2);
            if (/^[0-9A-F]+$/.test(hexStr)) {
                return parseInt(hexStr, 16);
            }
        }
        else if (/^[0-9A-F]+H$/.test(str)) {
            // Hexadecimal without explicit H (assume hex if all chars are hex digits)
            const hexStr = str.substring(0, str.length - 1);
            if (/^[0-9A-F]+$/.test(hexStr)) {
                return parseInt(hexStr, 16);
            }
        }
        else if (/^[0-9]+$/.test(str)) {
            // Decimal
            return parseInt(str, 10);
        }
        return null;
    }
    // First pass - collect labels
    firstPass(lines) {
        this.currentAddress = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const { label, instruction, operands } = this.parseLine(line);
            // Store label if present
            if (label) {
                this.labels.set(label, this.currentAddress);
            }
            // Calculate size if instruction is present
            if (instruction) {
                const encoder = this.instructionMap.get(instruction);
                if (encoder) {
                    // For first pass, we just check operand count and basic validity
                    // We don't actually encode operand values since labels might not be resolved yet
                    // Create dummy operands for size calculation
                    const dummyOperands = operands.map(op => {
                        // If it looks like a label (not a register or number), use a dummy value
                        const upperOp = op.toUpperCase();
                        const isRegister = this.registerMap.has(upperOp) || this.registerPairMap.has(upperOp) ||
                            ['B', 'D', 'PSW'].includes(upperOp); // For LDAX/STAX/PUSH/POP
                        // Also check if it's a condition code (NZ, Z, NC, C, PO, PE, P, M)
                        const isCondition = this.conditionMap.has(upperOp);
                        if (!isRegister && !isCondition && op.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
                            return '0000H'; // Dummy address
                        }
                        return op;
                    });
                    const inst = encoder(dummyOperands);
                    if (inst) {
                        this.parsedInstructions.push({
                            opcode: instruction,
                            args: operands,
                            address: this.currentAddress,
                            lineNumber: i + 1
                        });
                        this.currentAddress += inst.size;
                    }
                    else {
                        this.errors.push(`Line ${i + 1}: Invalid operands for ${instruction}`);
                    }
                }
                else {
                    this.errors.push(`Line ${i + 1}: Unknown instruction ${instruction}`);
                }
            }
        }
    }
    // Second pass - generate machine code
    secondPass(lines) {
        this.currentAddress = 0;
        this.instructions = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const { label, instruction, operands } = this.parseLine(line);
            // Process instruction if present
            if (instruction) {
                const encoder = this.instructionMap.get(instruction);
                if (encoder) {
                    const inst = encoder(operands);
                    if (inst) {
                        const bytes = [inst.opcode];
                        if (inst.operands) {
                            bytes.push(...inst.operands);
                        }
                        this.instructions.push({
                            address: this.currentAddress,
                            bytes,
                            source: line.trim(),
                            lineNumber: i
                        });
                        this.currentAddress += inst.size;
                    }
                }
            }
            else if (label) {
                // Just a label line, no instruction
                this.instructions.push({
                    address: this.currentAddress,
                    bytes: [],
                    source: line.trim(),
                    lineNumber: i
                });
            }
        }
    }
    // Assemble the code
    assemble(code) {
        this.labels.clear();
        this.instructions = [];
        this.parsedInstructions = [];
        this.errors = [];
        this.currentAddress = 0;
        // Remove C-style block comments while preserving newlines to maintain line numbers
        code = code.replace(/\/\*[\s\S]*?\*\//g, (match) => '\n'.repeat(match.split('\n').length - 1));
        // Remove C-style inline comments
        code = code.replace(/\/\/.*/g, '');
        const lines = code.split('\n');
        // First pass - collect labels
        this.firstPass(lines);
        // If there are errors, stop here
        if (this.errors.length > 0) {
            return {
                machineCode: new Uint8Array(0),
                instructions: [],
                errors: this.errors,
                warnings: []
            };
        }
        // Second pass - generate machine code
        this.secondPass(lines);
        // Analyze code
        const labelsObj = Object.fromEntries(this.labels);
        const warnings = analyzer_1.Analyzer8085.analyze(this.parsedInstructions, labelsObj);
        // Create machine code array
        const totalSize = this.instructions.reduce((sum, inst) => sum + inst.bytes.length, 0);
        const machineCode = new Uint8Array(totalSize);
        let offset = 0;
        for (const inst of this.instructions) {
            for (let i = 0; i < inst.bytes.length; i++) {
                machineCode[offset + i] = inst.bytes[i];
            }
            offset += inst.bytes.length;
        }
        return {
            machineCode,
            instructions: this.instructions,
            errors: this.errors,
            warnings
        };
    }
    // Helper methods for encoding instructions
    encodeOperand(operand) {
        // Check if it's a label
        if (this.labels.has(operand)) {
            return this.labels.get(operand);
        }
        // Check if it's a number
        return this.parseNumber(operand);
    }
    // Helper method to check if operand is valid (for first pass)
    isValidOperand(operand) {
        // Check if it's a label (will be resolved in second pass)
        if (operand.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
            return true; // Assume labels will be valid
        }
        // Check if it's a number
        return this.parseNumber(operand) !== null;
    }
    // MOV instruction
    encodeMOV(operands) {
        if (operands.length !== 2)
            return null;
        const reg1 = this.registerMap.get(operands[0].toUpperCase());
        const reg2 = this.registerMap.get(operands[1].toUpperCase());
        if (reg1 === undefined || reg2 === undefined)
            return null;
        const opcode = 0x40 | (reg1 << 3) | reg2;
        return { opcode, size: 1, cycles: reg1 === 6 || reg2 === 6 ? 7 : 5 };
    }
    // MVI instruction
    encodeMVI(operands) {
        if (operands.length !== 2)
            return null;
        const reg = this.registerMap.get(operands[0].toUpperCase());
        if (reg === undefined)
            return null;
        const data = this.encodeOperand(operands[1]);
        if (data === null)
            return null;
        const opcode = 0x06 | (reg << 3);
        return { opcode, operands: [data & 0xFF], size: 2, cycles: reg === 6 ? 10 : 7 };
    }
    // LXI instruction
    encodeLXI(operands) {
        if (operands.length !== 2)
            return null;
        const rp = this.registerPairMap.get(operands[0].toUpperCase());
        if (rp === undefined)
            return null;
        const data = this.encodeOperand(operands[1]);
        if (data === null)
            return null;
        const opcode = 0x01 | (rp << 4);
        return {
            opcode,
            operands: [data & 0xFF, (data >> 8) & 0xFF],
            size: 3,
            cycles: 10
        };
    }
    // LDA instruction
    encodeLDA(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0x3A,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 13
        };
    }
    // STA instruction
    encodeSTA(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0x32,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 13
        };
    }
    // LHLD instruction
    encodeLHLD(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0x2A,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 16
        };
    }
    // SHLD instruction
    encodeSHLD(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0x22,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 16
        };
    }
    // LDAX instruction
    encodeLDAX(operands) {
        if (operands.length !== 1)
            return null;
        const rp = operands[0].toUpperCase();
        if (rp !== 'B' && rp !== 'D')
            return null;
        const opcode = rp === 'B' ? 0x0A : 0x1A;
        return { opcode, size: 1, cycles: 7 };
    }
    // STAX instruction
    encodeSTAX(operands) {
        if (operands.length !== 1)
            return null;
        const rp = operands[0].toUpperCase();
        if (rp !== 'B' && rp !== 'D')
            return null;
        const opcode = rp === 'B' ? 0x02 : 0x12;
        return { opcode, size: 1, cycles: 7 };
    }
    // XCHG instruction
    encodeXCHG(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xEB, size: 1, cycles: 5 };
    }
    // ADD instruction
    encodeADD(operands) {
        if (operands.length !== 1)
            return null;
        const reg = this.registerMap.get(operands[0].toUpperCase());
        if (reg === undefined)
            return null;
        const opcode = 0x80 | reg;
        return { opcode, size: 1, cycles: reg === 6 ? 7 : 4 };
    }
    // ADI instruction
    encodeADI(operands) {
        if (operands.length !== 1)
            return null;
        const data = this.encodeOperand(operands[0]);
        if (data === null)
            return null;
        return { opcode: 0xC6, operands: [data & 0xFF], size: 2, cycles: 7 };
    }
    // SUB instruction
    encodeSUB(operands) {
        if (operands.length !== 1)
            return null;
        const reg = this.registerMap.get(operands[0].toUpperCase());
        if (reg === undefined)
            return null;
        const opcode = 0x90 | reg;
        return { opcode, size: 1, cycles: reg === 6 ? 7 : 4 };
    }
    // SUI instruction
    encodeSUI(operands) {
        if (operands.length !== 1)
            return null;
        const data = this.encodeOperand(operands[0]);
        if (data === null)
            return null;
        return { opcode: 0xD6, operands: [data & 0xFF], size: 2, cycles: 7 };
    }
    // INR instruction
    encodeINR(operands) {
        if (operands.length !== 1)
            return null;
        const reg = this.registerMap.get(operands[0].toUpperCase());
        if (reg === undefined)
            return null;
        const opcode = 0x04 | (reg << 3);
        return { opcode, size: 1, cycles: reg === 6 ? 10 : 5 };
    }
    // DCR instruction
    encodeDCR(operands) {
        if (operands.length !== 1)
            return null;
        const reg = this.registerMap.get(operands[0].toUpperCase());
        if (reg === undefined)
            return null;
        const opcode = 0x05 | (reg << 3);
        return { opcode, size: 1, cycles: reg === 6 ? 10 : 5 };
    }
    // INX instruction
    encodeINX(operands) {
        if (operands.length !== 1)
            return null;
        const rp = this.registerPairMap.get(operands[0].toUpperCase());
        if (rp === undefined)
            return null;
        const opcode = 0x03 | (rp << 4);
        return { opcode, size: 1, cycles: 5 };
    }
    // DCX instruction
    encodeDCX(operands) {
        if (operands.length !== 1)
            return null;
        const rp = this.registerPairMap.get(operands[0].toUpperCase());
        if (rp === undefined)
            return null;
        const opcode = 0x0B | (rp << 4);
        return { opcode, size: 1, cycles: 5 };
    }
    // DAD instruction
    encodeDAD(operands) {
        if (operands.length !== 1)
            return null;
        const rp = this.registerPairMap.get(operands[0].toUpperCase());
        if (rp === undefined)
            return null;
        const opcode = 0x09 | (rp << 4);
        return { opcode, size: 1, cycles: 10 };
    }
    // DAA instruction - Decimal Adjust Accumulator
    encodeDAA(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0x27, size: 1, cycles: 4 };
    }
    // CMP instruction
    encodeCMP(operands) {
        if (operands.length !== 1)
            return null;
        const reg = this.registerMap.get(operands[0].toUpperCase());
        if (reg === undefined)
            return null;
        const opcode = 0xB8 | reg;
        return { opcode, size: 1, cycles: reg === 6 ? 7 : 4 };
    }
    // CPI instruction
    encodeCPI(operands) {
        if (operands.length !== 1)
            return null;
        const data = this.encodeOperand(operands[0]);
        if (data === null)
            return null;
        return { opcode: 0xFE, operands: [data & 0xFF], size: 2, cycles: 7 };
    }
    // ANA instruction
    encodeANA(operands) {
        if (operands.length !== 1)
            return null;
        const reg = this.registerMap.get(operands[0].toUpperCase());
        if (reg === undefined)
            return null;
        const opcode = 0xA0 | reg;
        return { opcode, size: 1, cycles: reg === 6 ? 7 : 4 };
    }
    // ANI instruction
    encodeANI(operands) {
        if (operands.length !== 1)
            return null;
        const data = this.encodeOperand(operands[0]);
        if (data === null)
            return null;
        return { opcode: 0xE6, operands: [data & 0xFF], size: 2, cycles: 7 };
    }
    // XRA instruction
    encodeXRA(operands) {
        if (operands.length !== 1)
            return null;
        const reg = this.registerMap.get(operands[0].toUpperCase());
        if (reg === undefined)
            return null;
        const opcode = 0xA8 | reg;
        return { opcode, size: 1, cycles: reg === 6 ? 7 : 4 };
    }
    // XRI instruction
    encodeXRI(operands) {
        if (operands.length !== 1)
            return null;
        const data = this.encodeOperand(operands[0]);
        if (data === null)
            return null;
        return { opcode: 0xEE, operands: [data & 0xFF], size: 2, cycles: 7 };
    }
    // ORA instruction
    encodeORA(operands) {
        if (operands.length !== 1)
            return null;
        const reg = this.registerMap.get(operands[0].toUpperCase());
        if (reg === undefined)
            return null;
        const opcode = 0xB0 | reg;
        return { opcode, size: 1, cycles: reg === 6 ? 7 : 4 };
    }
    // ORI instruction
    encodeORI(operands) {
        if (operands.length !== 1)
            return null;
        const data = this.encodeOperand(operands[0]);
        if (data === null)
            return null;
        return { opcode: 0xF6, operands: [data & 0xFF], size: 2, cycles: 7 };
    }
    // CMA instruction
    encodeCMA(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0x2F, size: 1, cycles: 4 };
    }
    // CMC instruction
    encodeCMC(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0x3F, size: 1, cycles: 4 };
    }
    // STC instruction
    encodeSTC(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0x37, size: 1, cycles: 4 };
    }
    // JMP instruction
    encodeJMP(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xC3,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 10
        };
    }
    // JC instruction
    encodeJC(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xDA,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 10
        };
    }
    // JNC instruction
    encodeJNC(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xD2,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 10
        };
    }
    // JZ instruction
    encodeJZ(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xCA,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 10
        };
    }
    // JNZ instruction
    encodeJNZ(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xC2,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 10
        };
    }
    // JP instruction
    encodeJP(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xF2,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 10
        };
    }
    // JM instruction
    encodeJM(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xFA,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 10
        };
    }
    // CALL instruction
    encodeCALL(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xCD,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 17
        };
    }
    // CC instruction
    encodeCC(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xDC,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 17
        };
    }
    // CNC instruction
    encodeCNC(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xD4,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 17
        };
    }
    // CZ instruction
    encodeCZ(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xCC,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 17
        };
    }
    // CNZ instruction
    encodeCNZ(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xC4,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 17
        };
    }
    // CP instruction
    encodeCP(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xF4,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 17
        };
    }
    // CM instruction
    encodeCM(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xFC,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 17
        };
    }
    // RET instruction
    encodeRET(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xC9, size: 1, cycles: 10 };
    }
    // RC instruction
    encodeRC(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xD8, size: 1, cycles: 11 };
    }
    // RNC instruction
    encodeRNC(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xD0, size: 1, cycles: 11 };
    }
    // RZ instruction
    encodeRZ(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xC8, size: 1, cycles: 11 };
    }
    // RNZ instruction
    encodeRNZ(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xC0, size: 1, cycles: 11 };
    }
    // RP instruction
    encodeRP(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xF0, size: 1, cycles: 11 };
    }
    // RM instruction
    encodeRM(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xF8, size: 1, cycles: 11 };
    }
    // RST instruction
    encodeRST(operands) {
        if (operands.length !== 1)
            return null;
        const n = this.parseNumber(operands[0]);
        if (n === null || n < 0 || n > 7)
            return null;
        const opcode = 0xC7 | (n << 3);
        return { opcode, size: 1, cycles: 11 };
    }
    // PCHL instruction
    encodePCHL(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xE9, size: 1, cycles: 5 };
    }
    // PUSH instruction
    encodePUSH(operands) {
        if (operands.length !== 1)
            return null;
        const op = operands[0].toUpperCase();
        let rp;
        if (op === 'PSW') {
            rp = 3;
        }
        else {
            rp = this.registerPairMap.get(op);
        }
        if (rp === undefined)
            return null;
        const opcode = 0xC5 | (rp << 4);
        return { opcode, size: 1, cycles: 11 };
    }
    // POP instruction
    encodePOP(operands) {
        if (operands.length !== 1)
            return null;
        const op = operands[0].toUpperCase();
        let rp;
        if (op === 'PSW') {
            rp = 3;
        }
        else {
            rp = this.registerPairMap.get(op);
        }
        if (rp === undefined)
            return null;
        const opcode = 0xC1 | (rp << 4);
        return { opcode, size: 1, cycles: 10 };
    }
    // XTHL instruction
    encodeXTHL(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xE3, size: 1, cycles: 18 };
    }
    // SPHL instruction
    encodeSPHL(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xF9, size: 1, cycles: 5 };
    }
    // IN instruction
    encodeIN(operands) {
        if (operands.length !== 1)
            return null;
        const port = this.encodeOperand(operands[0]);
        if (port === null)
            return null;
        return { opcode: 0xDB, operands: [port & 0xFF], size: 2, cycles: 10 };
    }
    // OUT instruction
    encodeOUT(operands) {
        if (operands.length !== 1)
            return null;
        const port = this.encodeOperand(operands[0]);
        if (port === null)
            return null;
        return { opcode: 0xD3, operands: [port & 0xFF], size: 2, cycles: 10 };
    }
    // EI instruction
    encodeEI(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xFB, size: 1, cycles: 4 };
    }
    // DI instruction
    encodeDI(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xF3, size: 1, cycles: 4 };
    }
    // HLT instruction
    encodeHLT(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0x76, size: 1, cycles: 7 };
    }
    // NOP instruction
    encodeNOP(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0x00, size: 1, cycles: 4 };
    }
    // ADC instruction
    encodeADC(operands) {
        if (operands.length !== 1)
            return null;
        const reg = this.registerMap.get(operands[0].toUpperCase());
        if (reg === undefined)
            return null;
        const opcode = 0x88 | reg;
        return { opcode, size: 1, cycles: reg === 6 ? 7 : 4 };
    }
    // ACI instruction
    encodeACI(operands) {
        if (operands.length !== 1)
            return null;
        const data = this.encodeOperand(operands[0]);
        if (data === null)
            return null;
        return { opcode: 0xCE, operands: [data & 0xFF], size: 2, cycles: 7 };
    }
    // SBB instruction
    encodeSBB(operands) {
        if (operands.length !== 1)
            return null;
        const reg = this.registerMap.get(operands[0].toUpperCase());
        if (reg === undefined)
            return null;
        const opcode = 0x98 | reg;
        return { opcode, size: 1, cycles: reg === 6 ? 7 : 4 };
    }
    // SBI instruction
    encodeSBI(operands) {
        if (operands.length !== 1)
            return null;
        const data = this.encodeOperand(operands[0]);
        if (data === null)
            return null;
        return { opcode: 0xDE, operands: [data & 0xFF], size: 2, cycles: 7 };
    }
    // JPE instruction
    encodeJPE(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xEA,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 10
        };
    }
    // JPO instruction
    encodeJPO(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xE2,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 10
        };
    }
    // CPE instruction
    encodeCPE(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xEC,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 17
        };
    }
    // CPO instruction
    encodeCPO(operands) {
        if (operands.length !== 1)
            return null;
        const addr = this.encodeOperand(operands[0]);
        if (addr === null)
            return null;
        return {
            opcode: 0xE4,
            operands: [addr & 0xFF, (addr >> 8) & 0xFF],
            size: 3,
            cycles: 17
        };
    }
    // RPE instruction
    encodeRPE(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xE8, size: 1, cycles: 11 };
    }
    // RPO instruction
    encodeRPO(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0xE0, size: 1, cycles: 11 };
    }
    // SIM instruction
    encodeSIM(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0x30, size: 1, cycles: 4 };
    }
    // RIM instruction
    encodeRIM(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0x20, size: 1, cycles: 4 };
    }
    // RAR instruction
    encodeRAR(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0x1F, size: 1, cycles: 4 };
    }
    // RAL instruction
    encodeRAL(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0x17, size: 1, cycles: 4 };
    }
    // RRC instruction
    encodeRRC(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0x0F, size: 1, cycles: 4 };
    }
    // RLC instruction
    encodeRLC(operands) {
        if (operands.length !== 0)
            return null;
        return { opcode: 0x07, size: 1, cycles: 4 };
    }
}
exports.Assembler8085 = Assembler8085;
