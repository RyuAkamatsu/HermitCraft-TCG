import Constants from 'expo-constants';

const DEV_TUNNEL = 'great-knives-accept.loca.lt';

const ENV = {
    local: { apiUrl: `https://${DEV_TUNNEL}/api/app/v1` },
    dev  : { apiUrl: 'https://pose-dev.sc-dev.co.uk/api/app/v1' },
    live : { apiUrl: '' }
};

const getEnvVars = () => {

    // return ENV.dev;

    const env = (Constants && Constants.manifest && Constants.manifest.releaseChannel) || '';

    if (env.indexOf('dev') !== -1) return ENV.dev;
    if (env.indexOf('staging') !== -1) return ENV.live;
    if (env.indexOf('live') !== -1) return ENV.live;

    return ENV.local;
};

export default getEnvVars;
