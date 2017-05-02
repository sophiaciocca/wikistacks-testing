const Sequelize = require('sequelize');
const marked = require('marked');

const db = new Sequelize('postgres://localhost:5432/wikistack', { 
    logging: false 
});

const User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        isEmail: true,
        allowNull: false
    }
});

const Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        //since we are searching, editing, deleting by urlTitle, these need to be unique
        unique: true 
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed'),
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        set: function (tags = []) {
            //ternary operator. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
            tags = typeof tags !== 'string' ? tags : tags.split(',').map(str => str.trim())

            this.setDataValue('tags', tags);

        }
    }
}, {
    getterMethods: {
        route: function () {
            return '/wiki/' + this.urlTitle;
        },
        renderedContent: function () {
            return marked(this.content);
        }
    },
    classMethods: {
        findByTag: function (tag) {
            return this.findAll({
                where: {
                    tags: {
                        $contains: [tag]
                    }
                }
            });
        }
    },
    instanceMethods: {
        findSimilar: function () {
            return Page.findAll({
                where: {
                    id: {
                        $ne: this.id
                    },
                    tags: {
                        $overlap: this.tags
                    }
                }
            });
        }
    },
    //this is something that will happen on every query to this table
    defaultScope: {
        //include means to populate the foreignKey with the information associated to it from another table (e.g. populate authorId with the entire author object)
        include: [{model: User, as: 'author'}]
    }
});

Page.hook('beforeValidate', function (page) {
    page.urlTitle = page.title ? page.title.replace(/\s/g, '_').replace(/\W/g, '') : Math.random().toString(36).substring(2, 7);
});

//This adds methods to 'Page', such as '.setAuthor'. It also creates a foreign key attribute on the Page table pointing ot the User table
Page.belongsTo(User, {
    as: 'author'
});

//shorthand property names in es6. See `property definitions` -- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
module.exports = {
    Page,
    User
};
