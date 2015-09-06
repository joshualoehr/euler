/**
* PROBLEM #3
*
*    The prime factors of 13195 are 5, 7, 13 and 29.
*    What is the largest prime factor of the number 600851475143 ?
*
*/

// Returns the largest prime factor of num
module.exports = function(num) {
    // return alternate(num);
    for (var i = 2; i < num; i++) {
        if (num % i === 0) console.log(i);
        if (num % i === 0 && prime(num / i)) {
            console.log(num / i);
            return num / i;
        }
    }
}

// Returns the factors of n as an array
function factor(n) {
    var factors = [];
    for (var f = 2; f < n/2; f++) {
        if (n % f == 0) {
            factors.push(f);
        }
    }
    return factors;
}

// Returns boolean representing if n is prime
function prime(n) {
    return factor(n).length === 0;
}

// A better implementation that I didn't think of originally
function alternate(num) {
    var a = num, b = 2, c = 0;
    while (a > 1) {
        if (a % b === 0) {
            a = a / b;
            c = Math.max(b, c);
            b = 2;
        } else {
            b++;
        }
    }
    return c;
}
