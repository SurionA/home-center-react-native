import * as config from './config';

export const getHomeHydrometries = () =>
  fetch(`${config.HYDROMETRIES_API_URL}/hydrometries`)
    .then((response) => response.json())
