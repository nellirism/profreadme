// Global
const fs = require('fs');
const inquirer = require('inquirer');
const util = require('util');

// Internal NPMs
const api = require('./utils/api');
const generateMarkdown = require('./utils/generateMarkdown');

// Array of questions for user
const questions = [
    // GitHub Username
    {
        type: 'input',
        name: 'username',
        message: 'Enter your GitHub username.',
        // We need to validate that user entered at least one word
        // https://stackoverflow.com/questions/57321266/how-to-test-inquirer-validation
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("You must enter a GitHub username.");
            }
            return true;
        }
    },
    // GitHub Repository
    {
        type: 'input',
        name: 'repository',
        message: 'Enter the name of your repository on GitHub.',
        // We need to validate that user entered at least one word
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("You must enter the name of your GitHub repository.");
            }
            return true;
        } 
    },
    // Title of Project
    {
        type: 'input',
        name: 'title',
        message: 'Enter the title of your project.',
        // We need to validate that user entered at least one word
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("You must enter the title of your project.");
            }
            return true;
        }
    },
    // Project Description
    {
        type: 'input',
        name: 'description',
        message: 'Enter a description of your project.',
        // We need to validate that user entered at least one word
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("You must enter a description for your project.");
            }
            return true;
        }
    },
    // Project Installation
    {
        type: 'input',
        name: 'installation',
        message: 'Explain how user would install (if necessary) for Installation Section.',
        // Validation not required if question is optional
    },
    // Usage of project
    {
        type: 'input',
        name: 'usage',
        message: 'Enter your project instructions and examples of it in use for Usage Section.',
    },
    // Select license
    {
        type: 'list',
        name: 'license',
        message: 'Choose your license for your project.',
        // https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/licensing-a-repository
        choices: ['none', 'afl_3.0', 'apache_2.0', 'artistic_2.0', 'bsl_1.0', 'bsd_2_clause', 'bsd_3_clause', 'bsd_3_clause_clear', 'cc', 'cc0_1.0', 'cc_by_4.0', 'cc_by_sa_4.0', 'wtfpl', 'ecl_2.0', 'epl_1.0', 'epl_2.0', 'eupl_1.1', 'agpl_3.0', 'gpl', 'gpl_2.0', 'gpl_3.0', 'lgpl', 'lgpl_2.1', 'lgpl_3.0', 'isc', 'lppl_1.3c', 'ms_pl', 'mit', 'mpl_2.0', 'osl_3.0', 'postgresql', 'ofl_1.1', 'ncsa', 'unlicense', 'zlib']
    },
    // Contributing to project
    {
        type: 'input',
        name: 'contributing',
        message: 'Explain how users can contribute to your project (if necessary).',
        // Validation not required if question is optional
    },
    // Test for project
    {
        type: 'input',
        name: 'tests',
        message: 'Provide tests for project, and explain how to test (if necessary).',
        // Validation not required if question is optional
    },
];

// function to write README file
function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, err => {
        if (err) {
            return console.log(err);
        }
        console.log('Your markdown file has been created.')
    });
}

// Reference: https://www.npmjs.com/package/util.promisify
const writeFileAsync = util.promisify(writeToFile);

// function to initialize program
async function init() {
    // https://www.w3schools.com/js/js_errors.asp
    try {
        // Reference inquirer array with prompts
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
        // https://www.digitalocean.com/community/tutorials/nodejs-interactive-command-line-prompts
        const userResponses = await inquirer.prompt(questions);
        console.log("Your responses: ", userResponses);
        console.log("Your responses have been logged. Calling to GitHub...");

        // Referencing API.js
        const userInfo = await api.getUser(userResponses);
        console.log("Your GitHub user info: ", userInfo);

        // Pass inquirer data and api data to markdown
        console.log("Generating your markdown")
        const markdown = generateMarkdown(userResponses, userInfo);
        console.log(markdown);

        // Write markdown
        await writeFileAsync('GeneratedREADME.md', markdown);

    } catch (error) {
        console.log(error);
    }
};

// function call to initialize program
init();
