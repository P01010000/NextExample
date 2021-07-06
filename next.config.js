const { NodeModuleFederation } = require("@telenko/node-mf");

module.exports = {
    reactStrictMode: true,
    webpack: (config, options) => {
        const { isServer } = options;
        const { ModuleFederationPlugin } = options.webpack.container;

        const mfConf = {
            name: 'host',
            remotes: {
                example3: isServer
                    ? 'example3@https://chayns.space/77890-17410/example3/node/remoteEntry.js'
                    : 'example3@https://chayns.space/77890-17410/example3/web/remoteEntry.js'
            },
            shared: {
                react: {
                    eager: true,
                    singleton: true,
                    requiredVersion: require('./package.json').dependencies.react,
                },
                "react-dom": {
                    eager: true,
                    singleton: true,
                    requiredVersion: require('./package.json').dependencies['react-dom'],
                },
            },
        };


        config.plugins.push(
            new (isServer ? NodeModuleFederation : ModuleFederationPlugin)(mfConf),
        );

        config.experiments = { topLevelAwait: true };

        return config;
    },
}
