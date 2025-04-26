import { diskStorage } from "multer";

// storageConfig: Cấu hình lưu trữ cho multer
export const storageConfig = (folder:string) => diskStorage({
    // Chỉ định thư mục lưu trữ tệp tải lên
    destination: `uploads/${folder}`,
    // Đặt tên tệp tải lên
    filename: (req, file, cb) => {
        // Tạo tên tệp duy nhất bằng cách kết hợp thời gian hiện tại và tên tệp gốc
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})