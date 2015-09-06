var commandLineArgs = require('command-line-args'),
    fs = require('fs'),
    md5 = require('md5'),
    path = require('path'),
    yaml = require('js-yaml');

var filePath = path.join(__dirname, 'config/problem_set.yml'),
    problemDoc = null;

var cliConfig = loadCliConfig();
var cli = commandLineArgs(cliConfig.args);
var usage = cli.getUsage(cliConfig.usage);

var options = cli.parse();
if (options.help) {
    console.log(usage);
    process.exit(0);
} else {
    problemDoc = yaml.safeLoad(fs.readFileSync(filePath));
    if (options.init) {
        var problem = problemDoc[options.init - 1];
        var problemPath = path.join(__dirname, 'problem.js');
        fs.writeFileSync(problemPath, generateProblemTemplate(problem));
        console.log('Template for Problem #' + options.init + ' generated in ' + problemPath);
    } else if (options.solve) {
        var num = parseInt(fs.readFileSync('./problem.js', 'utf-8').split('\n')[3].split('#')[1]);
        var solution = solve(options.solve)
        if (solution.answer === problemDoc[num-1].answer) {
            console.log('Success! Your solution is correct.');
        } else {
            console.log('Solution incorrect - try again.');
        }
        console.log('Elapsed Time: ' + solution.elapsed);
    } else if (options.archive) {
        var num = parseInt(fs.readFileSync('./problem.js', 'utf-8').split('\n')[1].split('#')[1]);
        fs.readFile('./problem.js', 'utf-8', function(err, data) {
            if (err) throw err;
            var solutionPath = path.join(__dirname, 'solutions/euler' + num + '.js');
            fs.writeFileSync(solutionPath, data);
            console.log('Solution archived in ' + solutionPath);
        });
    }
}

function loadCliConfig() {
    var cliConfig = JSON.parse(fs.readFileSync('./config/cli.json', 'utf-8'));
    cliConfig.args.forEach(function(arg) {
        if (arg.type === "Boolean") arg.type = Boolean;
        else if (arg.type === "Number") arg.type = Number;
    });
    return cliConfig;
}

function solve(args) {
    var fn = require('./problem.js');
    var before = new Date().getMilliseconds();
    var solution = fn.apply(null, args);
    var after = new Date().getMilliseconds();
    return {
        answer: md5('' + solution),
        elapsed: (after - before) + 'ms'
    }
}

function generateProblemTemplate(problem) {
    var utilPath = path.join(__dirname, 'util.js');
    var text = ['var util = require("' + utilPath + '");\n'];
    text.push('/**');
    text.push('* PROBLEM #' + problem.id);
    text.push('*');
    text.push(problem.description.split('\n').map(function(line) {
        return '* ' + line;
    }).join('\n'));
    text.push('*\n*/\n');
    text.push('module.exports = function() {\n\n}');
    return text.join('\n');
}

function parseAndWrite() {
    fs.readFile(path.join(__dirname, 'config/project_euler.txt'), 'utf-8', function(err, data) {
        if (err) return console.error(err);

        var regexp = new RegExp(/Problem [0-9]{1,}\n([=]{9,})\n\n/g);
        var chunks = data.split(regexp).filter(function(val) {
            return val.substr(0,7) !== '=======';
        }).slice(1).map(function(val, i) {
            var lines = val.split('\n').filter(function(line) {
                return line !== '';
            });
            return {
                id: i+1,
                answer: lines.pop().split('Answer: ')[1],
                description: lines.join('\n')
            }
        });

        fs.writeFileSync(filePath, yaml.safeDump(chunks, { indent: 4 }));
    });
}
