import * as config from './config';

export const getHomeHydrometries = () =>
  fetch(`${config.API_URL}/hydrometries`)
    .then((response) => response.json())
