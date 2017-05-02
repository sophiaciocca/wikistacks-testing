/*
QUESTIONS

1) difference between "chai.spy" & "chai.spy.on"

2) why var page; outside of beforeEach?

3) Still confused on "done", esp here in testing? (e.g. on 'class methods' section)
ANSWER: We call done to signal to the program when it can move on to the next 'it' block. 
It is passed in as an argument to the callback function, and when invoked, the program'll move on.

4) Review of model names vs database names (what do we call class methods on??? findByTag

5) Using "done" vs. returning promises????
*/

var expect = require('chai').expect;
var chai = require('chai');
var spies = require('chai-spies');
chai.should();
chai.use(require('chai-things'));
chai.use(spies);
const express = require('express');
const models = require('../models');
const { Page, User } = models;


describe('Page Model', function () {

    //sync table before each test
    before(function () {
        return Page.sync({ force: true });
    })

    beforeEach(function () {
        return Page.truncate();
    })

    describe('Virtuals', function () {
        var page;
        beforeEach(function () {
            page = Page.build();
        })

        describe('route', function () {
            it('sets the page route with /wiki/ and the URL title', function () {
                page.urlTitle = 'Harry_Potter';
                page.content = 'Header Here';
                page.status = 'open';
                expect(page.route).to.equal('/wiki/Harry_Potter');
            });
        });
        describe('renderedContent', function () {
            it('converts the markdown formatted content into HTML', function () {
                page.urlTitle = 'Blue Whales';
                page.content = 'Header Here';
                page.status = 'open';
                console.log(page.content);
                console.log("rendered: ", page.renderedContent);
                expect(page.renderedContent).to.equal("<p>Header Here</p>\n");
            });
        });
    });

    describe('Class Methods', function () {

        beforeEach(function () {
            return Promise.all([
                Page.create({
                    title: 'Dr. Seusss Greatest Work',
                    content: 'You know the poem',
                    tags: ['ham', 'green', 'eggs', 'fullstack']
                }),
                Page.create({
                    title: 'Article Dos',
                    content: 'You know the poem',
                    tags: ['blue', 'red', 'cinco']
                })]);
        });

        //we did these ones w the "RETURN" way, not the "DONE" way
        describe('findByTag', function () {
            
            it('gets pages with the search tag', function () {
                return Page.findByTag('eggs')
                    .then((function (eggyPages) {
                        console.log('THESE ARE EGGY PAGES', eggyPages);
                        expect(eggyPages).to.have.lengthOf(1);
                    }))
                    .catch(function (err) {
                        console.log("aha! an error!");
                    });

            });

            it('does not get pages without the search tag', function () {
                return Page.findByTag('elephant')
                    .then((function (elePages) {
                        console.log('not eggy', elePages);
                        expect(elePages).to.have.lengthOf(0);
                    }))
                    .catch(function (err) {
                        console.log("aha! an error!");
                    });

            });
        });


    });

    describe('Instance methods', function () {
        var page1, page2, page3;

         beforeEach(function () {
            return Promise.all([
                Page.create({
                    title: 'Dr. Seusss Greatest Work',
                    content: 'You know the poem',
                    tags: ['ham', 'green', 'eggs', 'fullstack']
                }),
                Page.create({
                    title: 'Article Dos',
                    content: 'You know the poem',
                    tags: ['blue', 'red', 'cinco']
                }),
                page3 = Page.create({
                title: 'THREEE',
                content: 'one more article',
                tags: ['hello']
                })
            ])
            .spread(function(first, sec, third){
                page1 = first;
                page2 = sec;
                page3 = third;
            });
        });



        describe('findSimilar', function () {
            it('never gets itself', function () {
                return page1.findSimilar()
                .then(function(simPages) {
                    simPage.should.not.include(page1);
                });
                
            });
            it('gets other pages with any common tags', function () {
                 return page1
                .then(function(basePage) {
                    return basePage.findSimilar();
                })
                .then(function(simPage) {
                    console.log('this is simPage!!!', simPage);
                    simPage.should.include(page2);
                })
            });

            it('does not get other pages without any common tags');
        });
    });

    // describe('Validations', function () {
    //     it('errors without title');
    //     it('errors without content');
    //     it('errors given an invalid status');
    // });

    // describe('Hooks', function () {
    //     it('it sets urlTitle based on title before validating');
    // });
});