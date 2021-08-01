module.exports = {
    reactStrictMode: true,
    poweredByHeader: false,
    webpack: (config, options) => {
        const { ModuleFederationPlugin } = options.webpack.container;

        config.plugins.push(
            new ModuleFederationPlugin({
                name: "host",
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
            })
        );

        config.experiments = {
            topLevelAwait: true,
        };

        return config;
    }
}
