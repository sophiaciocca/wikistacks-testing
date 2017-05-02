module.exports = function (env) {

	//template literals. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    const pageLink = page => `<a href="${page.route}">${page.title}</a>`;

    pageLink.safe = true;

    env.addFilter('pageLink', pageLink);

};