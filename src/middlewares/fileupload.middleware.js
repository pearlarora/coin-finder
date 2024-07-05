// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // const destinationPath = path.join(
//     //   __dirname,
//     //   "../../client/src/Assets/coinIcons/"
//     // );
//     // cb(null, destinationPath);
//     // console.log("upload middleware");
//     const uploadPath = "../client/src/Assets/coinIcons";
//     console.log("Uploading path: " + uploadPath);
//     cb(null, uploadPath);
//     // cb(null, "../client/src/Assets/coinIcons");
//     // console.log("upload middleware");
//     // const uploadPath = path.join(
//     //   __dirname,
//     //   "../../client/src/Assets/coinIcons"
//     // );
//     // console.log("Upload Path:", uploadPath);
//     // cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     // cb(null, new Date().toISOString() + file.originalname);
//     const timestamp = new Date().getTime(); // Use timestamp for uniqueness
//     const extension = file.originalname.split(".").pop(); // Extract extension
//     const filename = `${timestamp}.${extension}`; // Combine timestamp and extension
//     cb(null, filename);
//   },
// });

// const upload = multer({ storage: storage });
// export default upload;

import multer from "multer";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import storage from "../Config/firebaseConfig.js";

// Configure Multer storage
const storageConfig = multer.memoryStorage();

const upload = multer({ storage: storageConfig });

// Middleware to handle file uploads
const uploadMiddleware = (req, res, next) => {
  upload.single("logo")(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    if (req.file) {
      const uniqueFilename = `${uuidv4()}-${req.file.originalname}`;
      const storageRef = ref(storage, uniqueFilename);

      try {
        const snapshot = await uploadBytes(storageRef, req.file.buffer);
        const downloadURL = await getDownloadURL(snapshot.ref);
        req.file.firebaseUrl = downloadURL;
        next();
      } catch (uploadError) {
        return res.status(500).send(uploadError.message);
      }
    } else {
      next();
    }
  });
};

export default uploadMiddleware;
