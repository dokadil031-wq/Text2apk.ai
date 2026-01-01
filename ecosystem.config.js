module.exports = {
  apps: [{
    name: "text2apk-api",
    script: "./dist/server/index.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3000,
      ANDROID_HOME: "/home/ubuntu/android-sdk",
      GRADLE_USER_HOME: "/home/ubuntu/.gradle"
    },
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    merge_logs: true,
  }]
}