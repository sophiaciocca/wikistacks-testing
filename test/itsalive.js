
console.log("IT IS ALIVEEEEEEEEEEE");

// var expect = require('chai').expect;
// var chai = require('chai');
// var spies = require('chai-spies');
// chai.use(spies);

// describe ("making sure math works", function() {
//     it('2+2 does indeed equal 4', function() {
//         expect(2+2).to.equal(4);
//     });
// });

// //
// describe ("Asynchronous capabilities", function() {
//     it('setTimeout waits for the right amount of time', function(done) {
//         var start = new Date();
//         setTimeout(function() {
//             var duration = new Date() - start;
//             expect(duration).to.be.closeTo(1000, 50);
//             done();
//         }, 1000);
//     });
// });

// //spy
// describe ("Spying on function calls", function() {
//     it('forEach calls the right number of times', function() {

//         var array = [1, 2, 3, 4, 5];
//         var doubledArray = [];

//         function doubleArray(item) {
//             doubledArray.push(item * 2)
//         }

//         //create spy
//         var doubleArray = chai.spy(doubleArray);

//         array.forEach(doubleArray);

//         //expect spy
//         expect(doubleArray).to.have.been.called.exactly(5);

//     });
// });
