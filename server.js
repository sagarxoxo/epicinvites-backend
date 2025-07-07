// server.js
require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`� Health Check: http://localhost:${PORT}/api/health`);
  console.log(`� Users API: http://localhost:${PORT}/api/users`);
});
