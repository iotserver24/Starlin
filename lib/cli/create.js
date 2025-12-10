/**
 * CREATE NEW STARLIN PROJECT
 */

const fs = require('fs-extra');
const path = require('path');

async function createProject(projectName) {
    console.log(`🚀 Creating Starlin project: ${projectName}`);

    const projectPath = path.join(process.cwd(), projectName);
    const templatePath = path.join(__dirname, '../../templates/default');

    try {
        // Copy template to new project
        await fs.copy(templatePath, projectPath);

        console.log('✅ Project created successfully!');
        console.log('\nNext steps:');
        console.log(`  cd ${projectName}`);
        console.log('  npm install');
        console.log('  npm run dev');
    } catch (error) {
        console.error('❌ Error creating project:', error.message);
    }
}

module.exports = createProject;
