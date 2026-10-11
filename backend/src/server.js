import { app } from './app.js';
import { migrate } from './db/migrate.js';

const PORT = process.env.PORT || 3000;

try {
  await migrate();
} catch (err) {
  console.error('Could not set up the database:', err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`KWeb backend listening on port ${PORT}`);
});
