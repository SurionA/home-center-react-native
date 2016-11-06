const rootEndpoint = 'http://home.suriona.com/home-monitor/api';

export const getHomeHydrometries = () =>
  fetch(`${rootEndpoint}/hydrometries`)
    .then((response) => response.json())
