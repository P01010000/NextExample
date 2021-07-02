module.exports = {
    reactStrictMode: true,
    webpack: (config, options) => {
        const { ModuleFederationPlugin } = options.webpack.container;

        config.plugins.push(
            new ModuleFederationPlugin({
                name: "host",
                shared: {
                    react: {
                        eager: true,
                        singleton: true,
                    },
                    "react-dom": {
                        eager: true,
                        singleton: true,
                    },
                },
            })
        );

        return config;
    }
}
