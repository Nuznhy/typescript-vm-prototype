import { VirtualMachine } from './tsvm';
import { bytecodeTests } from './tests';

bytecodeTests.forEach((test) => {
    const vm = new VirtualMachine(test.testData, 4, false);
    vm.executeBytecode()
        .then(() => {
            console.log('Test #', test.testId, '# start');
            console.log(vm.getMemoryByIndex(0));
            console.log('Test #', test.testId, '# end');
            console.log();
        })
        .catch((err: any) => {
            console.error(err);
        });
});
