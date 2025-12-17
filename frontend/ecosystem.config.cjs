// =============================================================
// FILE: ecosystem.config.cjs
// Emlak – Frontend (Next.js) PM2 config
// =============================================================

module.exports = {
  apps: [
    {
      name: "emlak-frontend",
      cwd: "/var/www/emlak/frontend",

      // Next CLI (node üzerinden)
      script: "/var/www/emlak/frontend/node_modules/next/dist/bin/next",
      args: "start -p 3015",

      exec_mode: "fork",
      instances: 1,
      watch: false,
      autorestart: true,
      max_memory_restart: "400M",

      env: {
        NODE_ENV: "production",
        PORT: "3015"
      },

      out_file: "/var/log/pm2/emlak-frontend.out.log",
      error_file: "/var/log/pm2/emlak-frontend.err.log",
      combine_logs: true,
      time: true
    }
  ]
};

