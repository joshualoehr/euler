/**
* PROBLEM #1
*
*    If we list all the natural numbers below 10 that are multiples of 3 or 5,
*    we get 3, 5, 6 and 9. The sum of these multiples is 23.
*    Find the sum of all the multiples of 3 or 5 below 1000.
*
*/

module.exports = function(factorList, max) {
    var factors = [];
    factorList.split(',').forEach(function(val) {
        factors.push(parseInt(val));
    });

    var sum = 0;
    for (var i = 1; i < max; i++) {
        for (var j = 0; j < factors.length; j++) {
            if (i % factors[j] == 0) {
                sum += i;
                break;
            }
        }
    }
    return sum;
}
