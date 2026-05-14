const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, 'uploads');
console.log('Backend root uploads dir:', uploadDir);
if (fs.existsSync(uploadDir)) {
    console.log('Files in backend/uploads:', fs.readdirSync(uploadDir));
} else {
    console.log('backend/uploads does not exist');
}

const middlewareUploadDir = path.join(__dirname, 'middleware', '../uploads');
console.log('Middleware calculated uploads dir:', path.resolve(middlewareUploadDir));
if (fs.existsSync(middlewareUploadDir)) {
    console.log('Files in middleware/../uploads:', fs.readdirSync(middlewareUploadDir));
} else {
    console.log('middleware/../uploads does not exist');
}
