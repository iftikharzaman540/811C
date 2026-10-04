module.exports = {
  apps: [
    {
      name: 'gaming-backend',
      script: 'dist/main.js',
      cwd: './backend',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
    {
      name: 'gaming-frontend',
      script: 'npm',
      args: 'start',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
