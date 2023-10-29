const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let manifest = {
    files: {}
};

function walk(dir) {
	let entries = [];
	let list = fs.readdirSync(dir);
	for(let fileName of list) {
		let file = path.join(dir, fileName);
		let stat = fs.statSync(file);
		if (stat && stat.isDirectory()) {
			if(!['.git', 'mods'].includes(fileName)) entries = entries.concat(walk(file));
		} else if(!['build_manifest.js', 'manifest.json', 'config.json'].includes(fileName)) {
			console.log(`Reading file ${file}...`);
			let data = fs.readFileSync(file);
			manifest.files[file.replace(__dirname, '').replaceAll('\\', '/')] = crypto.createHash('sha256').update(data).digest('hex');
		}
	}
	return entries;
}

walk('.');
fs.writeFileSync("manifest.json", JSON.stringify(manifest, null, 2));