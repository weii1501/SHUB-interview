import express from "express";
import { query } from "express-validator";
import { validationErrorHandler } from "../../middlewares/validationErrorHandler";
import FileController from "../../controllers/file.controller";
import { asyncHandler } from "../../helper/asyncHandler";

const dateFormaterRegex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;

const filesRouter = express.Router();


/**
 * @swagger
 * /v1/api/files/get-data:
 *   get:
 *     summary: Get data from file
 *     tags:
 *       - Files
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *         description: Thời gian bắt đầu
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *         description: Thời gian kết thúc
 *     responses:
 *       '200':
 *         description: Get data successfully
 *       '400':
 *         description: Invalid input
 *       '500':
 *         description: Internal server error
 */
filesRouter.route("/get-data").get(
    query("start")
        .isString()
        .optional()
        .matches(dateFormaterRegex)
        .withMessage('start: thời gian phải có định dạng dd/MM/yyyy HH:mm:ss'),
    query("end")
        .isString()
        .optional()
        .matches(dateFormaterRegex)
        .withMessage('end: thời gian phải có định dạng dd/MM/yyyy HH:mm:ss'),
    validationErrorHandler,
    asyncHandler(FileController.getData_v2)
);


/**
 * @swagger
 * /v1/api/files/upload:
 *   post:
 *     summary: Upload a file
 *     tags:
 *       - Files
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: File uploaded successfully
 *       '400':
 *         description: Invalid input
 *       '500':
 *         description: Internal server error
 */
filesRouter.route("/upload").post(FileController.uploadFile)

export default filesRouter;