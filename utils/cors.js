import Cors from "cors";
const _cors = Cors();

function cors(req, res) {
  return new Promise((resolve, reject) => {
    _cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default cors;
