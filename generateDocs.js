import fs from 'fs';
import path from 'path';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

const IGNORE_DIRS = ['node_modules', '.git', 'dist'];
const IGNORE_EXTS = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.webm', '.pdf', '.docx'];
const IGNORE_FILES = ['package-lock.json', 'generateDocs.js'];

function walk(dir, prefix = '') {
    let results = [];
    let treeStr = '';
    const files = fs.readdirSync(dir).filter(file => !IGNORE_DIRS.includes(file) && !IGNORE_FILES.includes(file));
    
    files.forEach((file, index) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        const isLast = index === files.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        treeStr += prefix + connector + file + '\n';
        
        if (stat.isDirectory()) {
            const nested = walk(filePath, prefix + (isLast ? '    ' : '│   '));
            results = results.concat(nested.results);
            treeStr += nested.treeStr;
        } else {
            const ext = path.extname(file).toLowerCase();
            if (!IGNORE_EXTS.includes(ext)) {
                results.push({
                    path: filePath,
                    relPath: path.relative(process.cwd(), filePath)
                });
            }
        }
    });
    
    return { results, treeStr };
}

async function generateDoc() {
    console.log('Walking directory...');
    const { results, treeStr } = walk(process.cwd());
    
    const children = [];
    
    children.push(new Paragraph({
        text: 'Project Documentation',
        heading: HeadingLevel.TITLE,
    }));
    
    children.push(new Paragraph({
        text: 'File Structure',
        heading: HeadingLevel.HEADING_1,
    }));
    
    const treeLines = treeStr.split('\n');
    treeLines.forEach(line => {
        if (line) {
            children.push(new Paragraph({
                children: [new TextRun({ text: line, font: "Courier New", size: 20 })]
            }));
        }
    });
    
    children.push(new Paragraph({
        text: 'File Contents',
        heading: HeadingLevel.HEADING_1,
    }));
    
    for (const file of results) {
        children.push(new Paragraph({
            text: file.relPath,
            heading: HeadingLevel.HEADING_2,
        }));
        
        try {
            const content = fs.readFileSync(file.path, 'utf8');
            const lines = content.split('\n');
            const contentRuns = lines.map(line => new Paragraph({
                children: [new TextRun({ text: line.replace(/\r/g, ''), font: "Courier New", size: 18 })]
            }));
            
            children.push(...contentRuns);
        } catch (e) {
            children.push(new Paragraph({
                text: '[Error reading file content]'
            }));
        }
    }
    
    const doc = new Document({
        sections: [{
            properties: {},
            children: children
        }]
    });
    
    console.log('Generating docx...');
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync('project_documentation.docx', buffer);
    console.log('Saved to project_documentation.docx');
}

generateDoc().catch(console.error);
