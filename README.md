# Markdown to HTML Converter

This application converts Markdown files into HTML format. It uses Node.js to read Markdown files and generates 
the corresponding HTML, which can then be written to a file or outputted to the console.

## Installation

Ensure that you have [Node.js](https://nodejs.org/) installed for proper functioning.

Clone the repository and install dependencies:
```bash
git clone https://github.com/KobbAsa/mlab1
cd mlab1
npm install
```

## Application Usage
To convert a file, run the command:
```bash
 node main.js input.md --out output.html
```
Here input.md is the path to your Markdown file, and output.html is the path where you wish to save the HTML file.

If you do not specify an output file, the HTML will be outputted to the console.

```bash
node main.js input.md
```

# User Instructions
* The input file must be in Markdown format.
* Ensure that all Markdown markers are correctly opened and closed.
* In case of detection of unclosed markers or nesting errors, the program will output an error and halt the conversion.

Revert commit [here](https://github.com/KobbAsa/mlab1/commit/c762cbeeb2d954649c0c6a0ce2ae3b227c8b4f70).