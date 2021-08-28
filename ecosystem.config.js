module.exports = {
  apps: [
    {
      name: 'convex-management',
      script: './dist/index.js',
      instances: '1',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
