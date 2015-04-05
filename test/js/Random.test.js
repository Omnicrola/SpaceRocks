/**
 * Created by Eric on 4/5/2015.
 */
describe("Random", function () {
    it('should repeat the same integer values with the same seed', function () {
        var random1 = new Random(5);
        var expectedValues = [];
        expectedValues.push(random1.nextInteger());
        expectedValues.push(random1.nextInteger());
        expectedValues.push(random1.nextInteger());
        expectedValues.push(random1.nextInteger());
        expectedValues.push(random1.nextInteger());

        var random2 = new Random(5);
        expect(random2.nextInteger()).to.equal(expectedValues[0]);
        expect(random2.nextInteger()).to.equal(expectedValues[1]);
        expect(random2.nextInteger()).to.equal(expectedValues[2]);
        expect(random2.nextInteger()).to.equal(expectedValues[3]);
        expect(random2.nextInteger()).to.equal(expectedValues[4]);
    });

    it('should not exceed a maximum passed to nextInteger()', function () {
        var random = new Random();
        var maximum = 600;
        for (var i = 0; i < 1000; i++) {
            var nextInteger = random.nextInteger(maximum);
            if (nextInteger > maximum) {
                assert.fail();
            }
        }
    });

    it('should have different integers from two different instances without a seed', function () {
        var random1 = new Random();
        var random2 = new Random();

        for (var i = 0; i < 1000; i++) {
            expect(random1.nextInteger()).to.not.equal(random2.nextInteger());
        }
    });

    it('should have different decimals from two different instances without a seed', function () {
        var random1 = new Random();
        var random2 = new Random();

        for (var i = 0; i < 1000; i++) {
            expect(random1.next()).to.not.equal(random2.next());
        }
    });
});