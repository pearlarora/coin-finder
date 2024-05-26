import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./client/src/Assets/coinIcons");
    console.log("upload middleware");
    // const uploadPath = path.join(
    //   __dirname,
    //   "../../client/src/Assets/coinIcons"
    // );
    // console.log("Upload Path:", uploadPath);
    // cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({ storage: storage });
export default upload;
