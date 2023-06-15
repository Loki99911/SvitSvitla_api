const multer = require("multer");
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");

const { HttpError, ctrlWrapper } = require("../helpers");

const { AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCESS_KEY } = process.env;

const sharedKeyCredential = new StorageSharedKeyCredential(
  AZURE_STORAGE_ACCOUNT,
  AZURE_STORAGE_ACCESS_KEY
);
const blobServiceClient = new BlobServiceClient(
  `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
  sharedKeyCredential
);

const containerName = "your-container-name";

async function uploadFileToBlobStorage(
  file,
  folder
) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const extension = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${extension}`;

  const blockBlobClient = containerClient.getBlockBlobClient(
    `${folder}/${fileName}`
  );
  const stream = file.stream;

  await blockBlobClient.uploadStream(stream);

  return blockBlobClient.url;
}

const multerConfigCover = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(
        HttpError(
          415,
          "Unsupported image format. Choose a file with extension jpeg or png"
        )
      );
    }
  },
});

const multerConfigPhoto = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(
        HttpError(
          415,
          "Unsupported image format. Choose a file with extension jpeg or png"
        )
      );
    }
  },
});

const multerConfigCatalog = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(
        HttpError(
          415,
          "Unsupported file format. Choose a file with extension pdf"
        )
      );
    }
  },
});

async function uploadAzureCover(req, res, next) {
  try {
    const file = req.file;
    const folder = "covers";

    const url = await uploadFileToBlobStorage(
      file,
      folder
    );

    req.fileUrl = url;
    next();
  } catch (error) {
    next(error);
  }
}

async function uploadAzurePhoto(req, res, next) {
  try {
    const files = req.files;
    const folder = "photos";

    const urls = [];

    for (const file of files) {
      const url = await uploadFileToBlobStorage(
        file,
        folder,
      );
      urls.push(url);
    }

    req.fileUrls = urls;
    next();
  } catch (error) {
    next(error);
  }
}

async function uploadAzureCatalog(req, res, next) {
  try {
    const file = req.file;
    const folder = "catalogs";
    const allowedFormats = ["pdf"];

    const url = await uploadFileToBlobStorage(file, folder, allowedFormats);

    req.fileUrl = url;
    next();
  } catch (error) {
    next(error);
  }
}

const uploadAzureCoverMiddleware = multerConfigCover.single("cover");
const uploadAzurePhotoMiddleware = multerConfigPhoto.array("photos", 12);
const uploadAzureCatalogMiddleware = multerConfigCatalog.single("catalog");

module.exports = {
  uploadAzureCover: ctrlWrapper(uploadAzureCoverMiddleware, uploadAzureCover),
  uploadAzurePhoto: ctrlWrapper(uploadAzurePhotoMiddleware, uploadAzurePhoto),
  uploadAzureCatalog: ctrlWrapper(
    uploadAzureCatalogMiddleware,
    uploadAzureCatalog
  ),
};
