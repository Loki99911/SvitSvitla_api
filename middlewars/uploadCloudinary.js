const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { HttpError} = require("../helpers");

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
    let currentFolder;
    switch (file.fieldname) {
      case "productCoverURL":
        currentFolder = "product/covers";
        break;
      case "productPhotoURL":
        currentFolder = "product/photos";
        break;
      case "catalogCoverURL":
        currentFolder = "catalog/covers";
        break;
      default:
        break;
    }
    const extension = file.originalname.split(".").pop();
    const id = uuidv4();
    const coverName = `${id}.${extension}`;

    return file.fieldname !== "catalogFileURL"
      ? {
          folder: currentFolder,
          allowed_formats: [("png", "jpeg")],
          public_id: coverName,
          transformation: [{ width: 473, crop: "fill" }],
          max_bytes: 100000,
        }
      : {
          folder: "catalog/files",
          allowed_formats: ["pdf"],
          public_id: catalogName,
        };
  },
});

function photoFilter(req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
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
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(
      HttpError(415, "Unsupported image format. Choose file with extention pdf")
    );
  }
}

const uploadCloudProduct = multer({
  storage: storageCover,
  photoFilter,
});

const uploadCloudCatalog = multer({
  storage: storageCover,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      photoFilter(req, file, cb);
    } else {
      fileFilter(req, file, cb);
    }
  },
});

const uploadCloudProductMiddleware = (req, res, next) => {
  uploadCloudProduct.fields([
    { name: "productCoverURL", maxCount: 1 },
    { name: "productPhotoURL", maxCount: 8 },
  ])(req, res, (err) => {
    if (err) {
      return next(err);
    }
    req.files.productCoverURL &&
      (req.body.productCoverURL = req.files.productCoverURL[0].path);
    req.files.productPhotoURL &&
      (req.body.productPhotoURL = req.files.productPhotoURL.map(
        ({ path }) => path
      ));
    next();
  });
};

const uploadCloudCatalogMiddleware = (req, res, next) => {
  uploadCloudCatalog.fields([
    { name: "catalogCoverURL", maxCount: 1 },
    { name: "catalogFileURL", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return next(err);
    }
    req.files.catalogCoverURL &&
      (req.body.catalogCoverURL = req.files.catalogCoverURL[0].path);
    req.files.catalogFileURL &&
      (req.body.catalogFileURL = req.files.catalogFileURL.map(
        ({ path }) => path
      ));
    next();
  });
};

module.exports = {
  uploadCloudProduct: uploadCloudProductMiddleware,
  uploadCloudCatalog: uploadCloudCatalogMiddleware,
};
