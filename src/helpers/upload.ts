import formidable from "formidable";
import fs from "fs";

const extenstions = [".png", ".jpg", ".jpeg"];

export default function upload(pathName: string) {
  const uploadHandler = formidable({
    multiples: true,
    uploadDir: `./uploads/${pathName}`,
    maxFileSize: 1.5 * 1024 * 1024,
    maxFields: 4,
    keepExtensions: true,
  });

  if (!fs.existsSync(`./uploads/${pathName}`))
    fs.mkdirSync(`./uploads/${pathName}`, { recursive: true });

  return uploadHandler;
}
