const arrayFilterMap = require('./index');

describe('arrayFilterMap test suite', () => {
    const testArray = [{
        id: 1,
        value: 'test 1',
    },
    {
        id: 2,
        value: 'test 2',
    },
    {
        id: 3,
        value: 'test 3',
    }];
    const thisTestObj = {
        id: 4,
        value: 'test 4',
    };
    global.console = {
        warn: jest.fn(),
        log: console.log,
    };
    it('should return a new array', () => {
        expect(arrayFilterMap(
            testArray,
            () => true,
            element => element
        )).not.toBe(testArray);
    });
    it('should map each item of the array to its "id" propery', () => {
        expect(arrayFilterMap(
            testArray,
            () => true,
            element => element.id
        )).toEqual([1, 2, 3]);
    });
    it('should filter out all values', () => {
        expect(arrayFilterMap(
            testArray,
            () => false,
            element => element,
        )).toEqual([]);
    });
    it('should warn about index usage in map', () => {
        arrayFilterMap(
            [1, 2],
            (element, index, origArray) => true,
            (element, index, origArray) => element,
        );
        expect(console.warn).toHaveBeenCalledTimes(1);
    });
    it('should use thisArg as "this" when passed as 4th argument', () => {
        expect(arrayFilterMap(
            testArray,
            function () { return true; },
            function (element) { return this.id; },
            thisTestObj
        )).toEqual([4, 4, 4]);
    });
    it('should use the index and origArray parameters as specified for each callback', () => {
        expect(arrayFilterMap(
            testArray,
            (element, index, origArray) => {
                origArray[index].value = `${origArray[index].value} filter`;
                return true;
            },
            (element, index, origArray) => {
                origArray[index].value = `${origArray[index].value} map`;
                return origArray[index].value;
            }
        )).toEqual(['test 1 filter map', 'test 2 filter map', 'test 3 filter map']);
    });
    it('should throw an error for filterCallback not a function', () => {
        expect(() => {
            arrayFilterMap(
                testArray,
                'Dude, this',
                (element) => element.id
            )}
        ).toThrow('Dude, this is not a function');
    });
    it('should throw an error for mapCallback not a function', () => {
        expect(() => {
            arrayFilterMap(
                testArray,
                () => true,
                'Dude, this'
            )}
        ).toThrow('Dude, this is not a function');
    });
    let biggerButNotUnreasonableDataset = [];
    for (let i = 0; i < 1000000; i++) {
        biggerButNotUnreasonableDataset.push({id: i, value: `test ${i}`});
    }
    it('this  --->                  (arrayFilterMap()):', () => {
        arrayFilterMap(
            biggerButNotUnreasonableDataset,
            element => element.id > 300000,
            element => element.value
        );
    });
    it('...should be faster than this (filter().map()):', () => {
        biggerButNotUnreasonableDataset.filter(
            (element) => element.id > 300000
        ).map(
            (element) => element.value
        );
    });
    it('but...       about the same as this (reduce()):', () => {
        biggerButNotUnreasonableDataset.reduce((newArray, currentElement) => {
            if (currentElement.id > 300000) {
                newArray.push(currentElement.value);
            }
            return newArray;
        }, [])
    });
});
