const Admin = require("../models/Admin");
const { sanitizeText } = require("./validation");

async function syncAdminCredentials() {
  const username = sanitizeText(process.env.ADMIN_USERNAME || "").toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "").trim();

  if (!username || !password) {
    console.warn("Admin credential sync skipped: ADMIN_USERNAME or ADMIN_PASSWORD is missing.");
    return;
  }

  const existingAdmin = await Admin.findOne({ username });

  if (existingAdmin) {
    existingAdmin.password = password;
    await existingAdmin.save();
    console.log(`Admin credentials synced for ${username}.`);
    return;
  }

  await Admin.create({ username, password });
  console.log(`Admin account created for ${username}.`);
}

module.exports = syncAdminCredentials;
