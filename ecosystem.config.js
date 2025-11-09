module.exports = {
  apps: [
    {
      name: "main",
      script: "npm",
      args: "start",
      cwd: "/home/apps/SK-LYDO-CAPSTONE",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
