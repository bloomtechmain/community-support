const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { createCommunityTables } = require('./models/communityModel');
const { createKbTables } = require('./models/kbModel');
const communityRoutes = require('./routes/communityRoutes');
const kbRoutes = require('./routes/kbRoutes');

const app = express();
const PORT = process.env.PORT || 5100;

// Fully public app, no auth/cookies involved — reflect any origin rather than
// pinning to a single FRONTEND_URL, since nothing here is credentialed.
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Community Support forum + Knowledge Base — fully public, no auth middleware.
// No login required to post questions/replies; anti-spam/rate-limiting was
// explicitly declined for v1 (carried over from the original website
// implementation) — do not add any here.
app.use('/api/community', communityRoutes);
app.use('/api/kb', kbRoutes);

// In production the frontend is built into ../frontend/dist and served
// straight from this same Express process — one service, one
// subdomain, instead of splitting frontend/backend into two deployments.
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) next();
  });
});

const init = async () => {
  await createCommunityTables();
  await createKbTables();
  app.listen(PORT, () => {
    console.log(`Community Support server is running on port ${PORT}`);
  });
};
init();
