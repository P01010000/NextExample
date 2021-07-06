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
                    //This is a hack (I cannot run successfully MF in client-side with NextJS and React, maybe doing smth wrong)
                    : {
                        external: `external new Promise((r, j) => {
                            window['example3'].init({
                                react: {
                                "${require('./package.json').dependencies.react}": {
                                    get: () => Promise.resolve().then(() => () => globalThis.React),
                                }
                                }
                            });
                            r({
                                get: (request) => window['example3'].get(request),
                                init: (args) => {}
                            });
                        })`
                    }
                // : 'example3@http://localhost:3000/example3/web/remoteEntry.js'
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
