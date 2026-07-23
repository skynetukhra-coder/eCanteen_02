const fs = require("fs");
const path = require("path");

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (file !== "node_modules" && file !== "dist") {
                results = results.concat(walk(filePath));
            }
        } else {
            if (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".tsx")) {
                results.push(filePath);
            }
        }
    });
    return results;
}

function replaceInContent(content) {
    // 1. Backticks
    content = content.replaceAll("`http://localhost:5000/", "`${window.API_BASE_URL}/");
    content = content.replaceAll("`http://localhost:5000", "`${window.API_BASE_URL}");
    
    // 2. Double quotes
    content = content.replaceAll('"http://localhost:5000/', 'window.API_BASE_URL + "/');
    content = content.replaceAll('"http://localhost:5000"', 'window.API_BASE_URL');
    
    // 3. Single quotes
    content = content.replaceAll("'http://localhost:5000/", "window.API_BASE_URL + '/");
    content = content.replaceAll("'http://localhost:5000'", "window.API_BASE_URL");
    
    return content;
}

const srcDir = path.join(__dirname, "src");
const files = walk(srcDir);
let count = 0;

files.forEach(filepath => {
    let content = fs.readFileSync(filepath, "utf8");
    if (content.includes("http://localhost:5000")) {
        const newContent = replaceInContent(content);
        fs.writeFileSync(filepath, newContent, "utf8");
        console.log(`Updated: ${filepath}`);
        count++;
    }
});

console.log(`Finished. Updated ${count} files.`);
