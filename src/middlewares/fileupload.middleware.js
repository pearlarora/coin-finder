import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // const destinationPath = path.join(
    //   __dirname,
    //   "../../client/src/Assets/coinIcons/"
    // );
    // cb(null, destinationPath);
    // console.log("upload middleware");
    fs.mkdir("../../client/src/Assets/coinIcons/", (err) => {
      cb(null, "../../client/src/Assets/coinIcons/");
    });
    // cb(null, "../client/src/Assets/coinIcons");
    // console.log("upload middleware");
    // const uploadPath = path.join(
    //   __dirname,
    //   "../../client/src/Assets/coinIcons"
    // );
    // console.log("Upload Path:", uploadPath);
    // cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // cb(null, new Date().toISOString() + file.originalname);
    const timestamp = new Date().getTime(); // Use timestamp for uniqueness
    const extension = file.originalname.split(".").pop(); // Extract extension
    const filename = `${timestamp}.${extension}`; // Combine timestamp and extension
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });
export default upload;
