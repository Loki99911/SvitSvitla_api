const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { HttpError, ctrlWrapper } = require("../helpers");

const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env;
const { v4: uuidv4 } = require("uuid");
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const storageCover = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const extension = file.originalname.split(".").pop();
    const id = uuidv4();
    const coverName = `${id}_cover.${extension}`;
    return {
      folder: "covers",
      allowed_formats: ["png", "jpeg"],
      public_id: coverName,
      transformation: [{ width: 473, crop: "fill" }],
      max_bytes: 100000,
    };
  },
});

const multerConfigPhoto = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    console.log("file",file);
    const id = uuidv4();
    const extension = file.originalname.split(".").pop();
    const photoName = `${id}_photo.${extension}`;
    return {
      folder: "photos",
      allowed_formats: ["png", "jpeg"],
      public_id: photoName,
      transformation: [{ width: 473, crop: "fill" }],
      max_bytes: 100000,
    };
  },
});

const multerConfigCatalog = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const extension = file.originalname.split(".").pop();
    const catalogName = `${req.user._id}_catalog.${extension}`;
    return {
      folder: "catalogs",
      allowed_formats: ["pdf"],
      public_id: catalogName,
    };
  },
});

function photoFilter(req, file, cb) {
  console.log(req);
  console.log(file);
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(
      HttpError(
        415,
        "Unsupported image format. Choose file with extention jpeg or png"
      )
    );
  }
}

function fileFilter(req, file, cb) {
  if (
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(
      HttpError(
        415,
        "Unsupported image format. Choose file with extention pdf"
      )
    );
  }
}

const uploadCloudCover = multer({
  storage: storageCover,
  photoFilter,
});

const uploadCloudPhoto = multer({
  storage: multerConfigPhoto,
  photoFilter,
});

const uploadCloudCatalog = multer({
  storage: multerConfigCatalog,
  fileFilter,
});

module.exports = {
  uploadCloudCover: ctrlWrapper(uploadCloudCover.single("productCoverURL")),
  uploadCloudPhoto: ctrlWrapper(uploadCloudPhoto.array("productPhotoURL", 4)),
  uploadCloudCatalog: ctrlWrapper(uploadCloudCatalog.single("catalog")),
};
