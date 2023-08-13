import Constants from 'expo-constants';

const ENV = {
    local: { apiUrl: 'http://localhost:3090/api/v1/' },
    dev  : { apiUrl: '' },
    live : { apiUrl: '' }
};

const getEnvVars = () => {

    // return 'http://192.168.1.68:21407/api/v1';
    // return ENV.local;

    // let env = Constants.manifest.releaseChannel || '';
    const env = (Constants && Constants.manifest && Constants.manifest.releaseChannel) || '';

    if (env.indexOf('dev') !== -1) return ENV.dev;
    if (env.indexOf('live') !== -1) return ENV.live;
    if (env.indexOf('staging') !== -1) return ENV.live;

    return ENV.local;
};

export default getEnvVars;
