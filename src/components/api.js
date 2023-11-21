import axios from 'axios';

const ApiKey = '39872924-85aaaf490e1b4ae0c12b933b4';

axios.defaults.baseURL = `https://pixabay.com/api/`;

export const fetchImages = async (query, page) => {
  const response = await axios.get(
    `?q=${query}&page=${page}&key=${ApiKey}&image_type=photo&orientation=horizontal&per_page=12`
  );
  return response.data;
};