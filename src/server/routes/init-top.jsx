import reducer from "../../client/reducers";

export default function initTop() {
  return {
    reducer,
    initialState: {
     productStore: {}
    }
  };
}