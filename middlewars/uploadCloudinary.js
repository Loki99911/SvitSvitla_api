const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { HttpError } = require("../helpers");

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
      case "catalogFileURL":
        currentFolder = "catalog/files";
        break;
      default:
        break;
    }
    const extension = file.originalname.split(".").pop();
    const id = uuidv4();
    const coverName = `${id}.${extension}`;
    const catalogName = `${id}.${extension}`;

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
    console.log("++++",file);
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
    // console.log("PATHS");
    // console.log("Photo", req.body.productPhotoURL);
    // console.log("oldPhoto", JSON.parse(req.body.productPhotoUrlOld));
    const PhotoURL = req.body.productPhotoURL || [];
    const PhotoUrlOld = req.body.productPhotoUrlOld
      ? JSON.parse(req.body.productPhotoUrlOld)
      : [];
    req.body.productPhotoURL = [...PhotoURL, ...PhotoUrlOld];
    delete req.body.productPhotoUrlOld;
    console.log("CLOUD END");
    next();
  });
};

const uploadCloudCatalogMiddleware = (req, res, next) => {
  uploadCloudCatalog.fields([
    { name: "catalogCoverURL", maxCount: 1 },
    { name: "catalogFileURL", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      console.log("ALARM",err);
      return next(err);
    }
    req.files.catalogCoverURL &&
      (req.body.catalogCoverURL = req.files.catalogCoverURL[0].path);
    req.files.catalogFileURL &&
      (req.body.catalogFileURL = req.files.catalogFileURL[0].path);
console.log(">>>uploadCloudCatalog", req.body);
    next();
  });
};

module.exports = {
  uploadCloudProduct: uploadCloudProductMiddleware,
  uploadCloudCatalog: uploadCloudCatalogMiddleware,
};
