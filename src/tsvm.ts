export class VirtualMachine {
    private readonly memory: any[];
    protected sp;
    protected pc;
    protected running;
    protected bytecode;
    protected debug;

    public constructor(bytecode: any[], memorySize: number, debug: boolean) {
        this.memory = new Array(memorySize).fill(0);
        this.bytecode = bytecode;
        this.pc = 0;
        this.sp = -1;
        this.running = false;
        this.debug = debug;
    }

    public getMemoryByIndex(position?: number) {
        if (position !== undefined) return this.memory[position];

        return this.memory;
    }

    private logExecution(message: string, data: any) {
        if (this.debug) {
            console.log(message, data);
        }
    }

    private jump() {
        this.pc = this.bytecode[++this.pc];
    }

    private push(value: number) {
        this.logExecution('Push value: ', value);
        this.memory[++this.sp] = value;
    }

    private pop() {
        this.memory[++this.sp] = this.memory[this.sp--];
    }

    private store(address: number) {
        this.memory[address] = this.memory[this.sp];
        this.sp--;
    }

    private load(address: number) {
        this.logExecution('Loading ', this.memory[address]);
        this.memory[++this.sp] = this.memory[address];
    }

    private jumpIf(address: number, condition: boolean) {
        switch (condition) {
            case true:
                const condTrue = this.memory[this.sp--];
                this.logExecution('Jumping if: ', condTrue);
                if (condTrue) {
                    this.pc = address;
                }
                break;
            case false:
                const condFalse = this.memory[this.sp--];
                this.logExecution('Jumping if: !', condFalse);
                if (!condFalse) {
                    this.pc = address;
                }
                break;
            default:
                throw new Error('Jump if what again?');
        }
    }

    private compareEqual() {
        const a = this.memory[this.sp--];
        const b = this.memory[this.sp--];
        this.logExecution(`Compare equal: ${a} === ${b} = `, a === b);
        this.memory[++this.sp] = a === b ? 1 : 0;
    }

    private add() {
        const a = this.memory[this.sp--];
        const b = this.memory[this.sp--];
        this.logExecution(`Adding: ${a} + ${b} = `, a + b);
        this.memory[++this.sp] = a + b;
    }

    private subtract() {
        const a = this.memory[this.sp--];
        const b = this.memory[this.sp--];
        this.logExecution(`Subtracting: ${b} - ${a} = `, b - a);
        this.memory[++this.sp] = b - a;
    }

    private multiply() {
        const a = this.memory[this.sp--];
        const b = this.memory[this.sp--];
        this.logExecution(`Multiplying: ${a} * ${b} = `, a * b);
        this.memory[++this.sp] = a * b;
    }

    private divide() {
        const divisor = this.memory[this.sp--];
        const dividend = this.memory[this.sp--];
        this.logExecution(
            `Dividing: ${dividend},
            /
            ${divisor} =`,
            Math.floor(dividend / divisor)
        );
        this.memory[++this.sp] = Math.floor(dividend / divisor);
    }

    private drop() {
        this.logExecution('dropping ', this.sp);
        this.sp--;
    }

    private compare(operand: string) {
        const a = this.memory[this.sp--];
        const b = this.memory[this.sp--];
        this.logExecution('Compare values: ', { a, operand, b });
        switch (operand) {
            case '<':
                this.memory[++this.sp] = a < b ? 1 : 0;
                break;
            case '>':
                this.memory[++this.sp] = a > b ? 1 : 0;
                break;
            case '<=':
                this.memory[++this.sp] = a <= b ? 1 : 0;
                break;
            case '>=':
                this.memory[++this.sp] = a >= b ? 1 : 0;
                break;
            default:
                throw new Error('What operand to compare again?');
        }
        this.logExecution('Compare result: ', this.memory[this.sp]);
    }

    public async executeBytecode() {
        this.running = true;
        while (this.running && this.pc < this.bytecode.length) {
            const opcode = this.bytecode[this.pc];
            this.logExecution('Current opcode: ', opcode);
            this.logExecution('Current stack pointer: ', this.sp);
            if (this.memory.includes(NaN) || this.sp < -1) {
                throw new Error(`Stack dead ${this.memory}`);
            }
            switch (opcode) {
                case 0x00:
                    this.jump();
                    break;
                case 0x01:
                    const value = this.bytecode[++this.pc];
                    this.push(value);
                    break;
                case 0x02:
                    this.pop();
                    break;
                case 0x03:
                    const storeAddress = this.bytecode[++this.pc];
                    this.store(storeAddress);
                    break;
                case 0x04:
                    const loadAddress = this.bytecode[++this.pc];
                    this.load(loadAddress);
                    break;
                case 0x05:
                    const trueAddress = this.bytecode[++this.pc];
                    this.jumpIf(trueAddress, true);
                    break;
                case 0x06:
                    const falseAddress = this.bytecode[++this.pc];
                    this.jumpIf(falseAddress, false);
                    break;
                case 0x07:
                    this.compareEqual();
                    break;
                case 0x08:
                    this.add();
                    break;
                case 0x09:
                    this.subtract();
                    break;
                case 0x0a:
                    this.multiply();
                    break;
                case 0x0b:
                    this.divide();
                    break;
                case 0x0c:
                    this.drop();
                    break;
                case 0x0d:
                    this.compare('<');
                    break;
                case 0x0e:
                    this.compare('>');
                    break;
                case 0x0f:
                    this.compare('<=');
                    break;
                case 0x10:
                    this.compare('>=');
                    break;
                default:
                    this.running = false;
                    throw new Error(`Unknown opcode: ${opcode}`);
            }
            this.logExecution('Memory: ', this.memory);
            this.pc++;
            this.logExecution('', {});
        }
    }
}
