import axios from "axios";

const customAxiosInstance = axios.create({
  timeout: 0,
});
export default customAxiosInstance;
