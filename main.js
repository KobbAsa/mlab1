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
