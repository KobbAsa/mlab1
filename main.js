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
