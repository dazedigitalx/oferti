// config-overrides.js

module.exports = {
    webpack: (config) => {
        // Add polyfills
        config.resolve.fallback = {
            ...config.resolve.fallback,
            buffer: require.resolve('buffer/'),
            timers: require.resolve('timers-browserify'),
        };

        return config;
    },
};
