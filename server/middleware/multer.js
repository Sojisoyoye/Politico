import multer from 'multer';
import Datauri from 'datauri';
import path from 'path';
// import { uploader } from '../config/cloudinaryConfig';

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('passporurl');

const dUri = new Datauri();

/**
 * @description A function that converts the buffer to data url
 * @param {object} request containing the field object
 * @param {string} Data url from the string buffer
 */

const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(),
  req.file.buffer);

// class imgHelper {
// static imgUpload(req) {
// let response;
// if (req.file) {
// const file = dataUri(req).content;
// response = uploader.upload(file).then(result => result.secure_url).catch((err) => {
// if (err) {
// return false;
// }
// return response;
// });
// } return false;
// }
// }
const imgUpload = {
  multerUploads,
  dataUri,
};

export default imgUpload;
