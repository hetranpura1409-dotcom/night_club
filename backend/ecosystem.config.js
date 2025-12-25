module.exports = {
    apps: [{
        name: 'nightclub-backend',
        script: './dist/main.js',
        instances: 1,
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production'
        }
    }]
};
