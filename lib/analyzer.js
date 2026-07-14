"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analyzer8085 = void 0;
class Analyzer8085 {
    static analyze(instructions, labels) {
        const warnings = [];
        const usedLabels = new Set();
        let hasHlt = false;
        let spInitialized = false;
        // Track register states (rudimentary)
        const registerState = {
            A: 'empty', B: 'empty', C: 'empty', D: 'empty', E: 'empty', H: 'empty', L: 'empty'
        };
        let lastMemoryWriteLine = null;
        instructions.forEach((inst, index) => {
            const op = inst.opcode.toUpperCase();
            // Check for HLT
            if (op === 'HLT') {
                hasHlt = true;
            }
            // Check for Infinite Loops (JMP to own line)
            if (op === 'JMP' && inst.args[0]) {
                const target = inst.args[0];
                if (labels[target] === inst.address) {
                    warnings.push({
                        line: inst.lineNumber,
                        message: 'Infinite loop detected (JMP to self).',
                        type: 'infinite_loop'
                    });
                }
            }
            // Track label usage
            if (['JMP', 'JC', 'JNC', 'JZ', 'JNZ', 'JM', 'JP', 'JPE', 'JPO', 'CALL', 'CC', 'CNC', 'CZ', 'CNZ', 'CM', 'CP', 'CPE', 'CPO'].includes(op)) {
                if (inst.args[0])
                    usedLabels.add(inst.args[0]);
            }
            // Stack operations
            if (op === 'LXI' && inst.args[0] === 'SP') {
                spInitialized = true;
            }
            if (op === 'SPHL') {
                spInitialized = true;
            }
            if (['PUSH', 'CALL', 'CC', 'CNC', 'CZ', 'CNZ', 'CM', 'CP', 'CPE', 'CPO'].includes(op)) {
                if (!spInitialized) {
                    warnings.push({
                        line: inst.lineNumber,
                        message: 'Stack pointer might not be initialized before use.',
                        type: 'uninitialized_sp'
                    });
                }
            }
            if (['POP', 'RET', 'RC', 'RNC', 'RZ', 'RNZ', 'RM', 'RP', 'RPE', 'RPO'].includes(op)) {
                if (!spInitialized) {
                    warnings.push({
                        line: inst.lineNumber,
                        message: 'Possible stack underflow: Popping/Returning before SP initialized.',
                        type: 'stack_underflow'
                    });
                }
            }
            // Register overwrite before use
            if (op === 'MVI' || op === 'LXI') {
                const reg = inst.args[0];
                if (registerState[reg] === 'written') {
                    warnings.push({
                        line: inst.lineNumber,
                        message: `Register ${reg} overwritten before its value was used.`,
                        type: 'register_overwrite'
                    });
                }
                if (reg)
                    registerState[reg] = 'written';
                if (reg === 'B')
                    registerState['C'] = 'written'; // LXI B sets B and C
                if (reg === 'D')
                    registerState['E'] = 'written';
                if (reg === 'H')
                    registerState['L'] = 'written';
            }
            // If register read
            if (op === 'MOV') {
                const dest = inst.args[0];
                const src = inst.args[1];
                if (src !== 'M' && registerState[src]) {
                    registerState[src] = 'read';
                }
                if (dest !== 'M') {
                    if (registerState[dest] === 'written') {
                        warnings.push({
                            line: inst.lineNumber,
                            message: `Register ${dest} overwritten before its value was used.`,
                            type: 'register_overwrite'
                        });
                    }
                    registerState[dest] = 'written';
                }
            }
            if (['ADD', 'ADC', 'SUB', 'SBB', 'ANA', 'XRA', 'ORA', 'CMP'].includes(op)) {
                const src = inst.args[0];
                if (src !== 'M' && registerState[src]) {
                    registerState[src] = 'read';
                }
                registerState['A'] = 'written'; // Result goes to A
            }
            // Memory overwrite tracking
            if (op === 'STA' || op === 'SHLD') {
                if (lastMemoryWriteLine !== null && lastMemoryWriteLine === index - 1) {
                    warnings.push({
                        line: inst.lineNumber,
                        message: 'Consecutive memory writes detected. Previous write might be overwritten or redundant.',
                        type: 'memory_overwrite'
                    });
                }
                lastMemoryWriteLine = index;
            }
            else {
                lastMemoryWriteLine = null;
            }
        });
        // Check unused labels
        Object.keys(labels).forEach(label => {
            if (!usedLabels.has(label)) {
                warnings.push({
                    line: 0, // General warning, or we could track label lines
                    message: `Unused label: ${label}`,
                    type: 'unused_label'
                });
            }
        });
        if (!hasHlt && instructions.length > 0) {
            warnings.push({
                line: instructions[instructions.length - 1].lineNumber,
                message: 'Program exits without termination (HLT missing).',
                type: 'missing_hlt'
            });
        }
        return warnings;
    }
}
exports.Analyzer8085 = Analyzer8085;
