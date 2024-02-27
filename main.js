const fs = require('fs');

const inputFile = process.argv[2];
const outputFile = process.argv[4];

if (!inputFile) {
    console.error('Error: No input file specified');
    process.exit(1);
}

fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${inputFile}`, err);
        process.exit(1);
    }

    if (!checkForUnmatchedMarkers(data)) {
        console.error('Error: Unmatched markdown markers found');
        process.exit(1);
    }

    const html = convertMarkdownToHtml(data);

    if (outputFile) {
        fs.writeFile(outputFile, html, (err) => {
            if (err) {
                console.error(`Error writing to file: ${outputFile}`, err);
                process.exit(1);
            }
            console.log(`HTML written to ${outputFile}`);
        });
    } else {
        console.log(html);
    }
});

function convertMarkdownToHtml(markdown) {
    let html = ' ';
    const lines = markdown.split('\n');
    let inPreBlock = false;
    let newParagraph = true;

    lines.forEach((line, index) => {
        if (line.startsWith('```')) {
            inPreBlock = !inPreBlock;
            html += inPreBlock ? '<pre>' : '</pre>\n';
            newParagraph = true;
        } else if (inPreBlock) {
            html += `${line}\n`;
        } else {
            if (line.trim() !== '') {
                if (newParagraph && html !== '') {
                    html += '<p>';
                }
                newParagraph = false;

                line = line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                    .replace(/__(.*?)__/g, '<b>$1</b>')
                    .replace(/_(.*?)_/g, '<i>$1</i>')
                    .replace(/`(.*?)`/g, '<code>$1</code>');

                html += line;
                if ((lines[index + 1] && lines[index + 1].trim() === '') || index === lines.length - 1) {
                    html += '</p>\n';
                    newParagraph = true;
                }
            }
        }
    });
    return html;
}

function checkForUnmatchedMarkers(markdown) {
    let isBoldOpen = false;
    let isMonospaceOpen = false;
    let isItalicOpen = false;
    let preformattedCount = 0;

    for (let i = 0; i < markdown.length; i++) {

        if (markdown[i] === '*' && i + 1 < markdown.length && markdown[i + 1] === '*') {
            if (!(i > 0 && markdown[i - 1] === '\\')) {
                isBoldOpen = !isBoldOpen;
                i++;
            }
        }

        if (markdown[i] === '`' && (i < 1 || markdown[i - 1] !== '`')) {
            if (!(i > 0 && markdown[i - 1] === '\\')) {
                isMonospaceOpen = !isMonospaceOpen;
            }
        }

        if (markdown[i] === '_') {
            if (!(i > 0 && markdown[i - 1] === '\\')) {
                let isPartOfWord = (i > 0 && markdown[i - 1].match(/\w/)) && (i < markdown.length - 1 && markdown[i + 1].match(/\w/));
                if (!isPartOfWord) {
                    isItalicOpen = !isItalicOpen;
                }
            }
        }

        if (markdown[i] === '`' && i + 2 < markdown.length && markdown[i + 1] === '`' && markdown[i + 2] === '`') {
            preformattedCount++;
            i += 2;
        }
    }

    if (isBoldOpen || isMonospaceOpen || isItalicOpen || preformattedCount % 2 !== 0) {
        return false;
    }

    return true;
}
