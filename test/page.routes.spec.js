describe('http requests', function() {
    before(function() {
        return User.sync({force : true})
                    .then(function() {
                        return Page.sync
                    })
    })
})


//SEE DAN'S SOLUTION CODE (couldn't type fast enough)