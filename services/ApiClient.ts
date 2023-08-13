import axios from 'axios';

import getEnvVars from '../ENV';

const apiClient = axios.create({ baseURL: getEnvVars().apiUrl });

apiClient.defaults.headers.post['Content-Type'] = 'application/json';

export default apiClient;
