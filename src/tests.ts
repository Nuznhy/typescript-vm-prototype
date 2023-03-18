// prettier-ignore
export const bytecodeTests = [
    {
        'testId': '5+7',
        'testData': [
            0x01, 5, // push 5
            0x01, 7, // push 7
            0x08, // add (save on top of the stack)
            0x00 // end program and return result
        ]
    },
    {
        'testId': '7-5',
        'testData': [
            0x01, 7, // push 7
            0x01, 5, // push 5
            0x09, // subtract 7-5
            0x00 // end
        ]
    },
    {
        'testId': '7*5',
        'testData': [
            0x01, 5, // push 5
            0x01, 7, // push 7
            0x0a, //  multiply 7*5
            0x00 // end
        ]
    },
    {
        'testId': '14/2',
        'testData': [
            0x01, 14, // push 14
            0x01, 2, // push 2
            0x0b, //  divide 14/2
            0x00 // end
        ]
    },
    {
        'testId': 'string + 2',                 // yes in this VM you can do that
        'testData': [
            0x01, 2, // push 2
            0x01, 'string ', // push 14
            0x08, //   add 'string' + 2
            0x00 // end
        ]
    },
    {
        'testId': 'string * 2',
        'testData': [
            0x01, 2, // push 2
            0x01, 'string', // push 14
            0x0a, //   multiply 'string' * 2 (NaN - should cause exception)
            0x00 // end
        ]
    },
    {
        'testId': '5 equal to 5',
        testData: [
            0x01, 5, // push 5
            0x01, 5, // push 5
            0x07, //   checkEqual
            0x00 // end
        ]
    },
    {
        'testId': '5 equal to 15',
        testData: [
            0x01, 5, // push 5
            0x01, 15, // push 5
            0x07, //   checkEqual
            0x00 // end
        ]
    },
    {
        'testId': '10 > 5',
        testData: [
            0x01, 5, // push 5
            0x01, 10, // push 10
            0x0e, //
            0x00 // end
        ]
    },
    {
        'testId': 'While loop until result more than 100',
        'testData': [
            0x01, 5, // push 5
            0x01, 7, // push 7
            0x08, // add 5 + 7
            0x03, 0x03, // store 12
            0x01, 100, // push 100
            0x04, 0x03, // load 12
            0x0e, // compare 12 > 100
            0x05, 27, // jump if true to end
            0x01, 24, // push 24
            0x04, 0x03, // load stored value (firstly 12)
            0x08, // add 24 + stored value
            0x03, 0x03, // store new value
            0x01, 100, // push 100
            0x04, 0x03, // load new value
            0x0e, // compare newValue > 100
            0x06, 13, // go back if still less
            0x04, 0x03, // load final number to top
            0x00 // exit
        ]
    }

];
