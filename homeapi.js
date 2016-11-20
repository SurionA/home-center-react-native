const rootEndpoint = 'http://127.0.0.1/api';

export const getHomeHydrometries = () =>
  fetch(`${rootEndpoint}/hydrometries`)
    .then((response) => response.json())
