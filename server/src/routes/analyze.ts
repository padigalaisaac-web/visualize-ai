import { Router, Request, Response } from 'express';
import multer from 'multer';
import { analyzeClaimAndEvidence, ImageInput } from '../services/gemma.js';

export const analyzeRouter = Router();

// Multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per image
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/svg+xml'
    ];

    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error(`UNSUPPORTED_FILE_TYPE: Only PNG, JPG, JPEG, WEBP, and SVG are supported. Received ${file.mimetype}`));
    }
  },
});

const cpUpload = upload.fields([
  { name: 'claimImage', maxCount: 1 },
  { name: 'evidenceImage', maxCount: 1 },
]);

analyzeRouter.post('/analyze', (req: Request, res: Response): void => {
  cpUpload(req, res, async (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            success: false,
            error: 'File size exceeds maximum limit of 10MB per image.',
            code: 'FILE_TOO_LARGE'
          });
          return;
        }
      }
      res.status(400).json({
        success: false,
        error: err.message || 'File upload error',
        code: 'UPLOAD_ERROR'
      });
      return;
    }

    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      if (!files || !files.claimImage || files.claimImage.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Missing claim image. Please upload an image containing the claim.',
          code: 'MISSING_CLAIM_IMAGE'
        });
        return;
      }

      if (!files.evidenceImage || files.evidenceImage.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Missing evidence image. Please upload an image containing the evidence.',
          code: 'MISSING_EVIDENCE_IMAGE'
        });
        return;
      }

      const claimFile = files.claimImage[0];
      const evidenceFile = files.evidenceImage[0];

      const claimInput: ImageInput = {
        buffer: claimFile.buffer,
        mimetype: claimFile.mimetype === 'image/svg+xml' ? 'image/png' : claimFile.mimetype,
        originalname: claimFile.originalname,
      };

      const evidenceInput: ImageInput = {
        buffer: evidenceFile.buffer,
        mimetype: evidenceFile.mimetype === 'image/svg+xml' ? 'image/png' : evidenceFile.mimetype,
        originalname: evidenceFile.originalname,
      };

      const { result, modelUsed } = await analyzeClaimAndEvidence(claimInput, evidenceInput);

      res.status(200).json({
        success: true,
        result: {
          ...result,
          model_used: modelUsed,
          analyzed_at: new Date().toISOString(),
          is_demo: false,
        }
      });
    } catch (analysisErr: any) {
      if (analysisErr.message === 'MISSING_API_KEY') {
        console.warn('Analysis request: GEMINI_API_KEY is not configured. Returning 503.');
        res.status(503).json({
          success: false,
          error: 'GEMINI_API_KEY is not configured on the server. Please add your key to server/.env or test with pre-seeded demo examples in Demo Mode.',
          code: 'MISSING_API_KEY'
        });
        return;
      }

      console.error('Error during multimodal analysis:', analysisErr);

      if (analysisErr.message === 'INVALID_JSON_FROM_MODEL') {
        res.status(502).json({
          success: false,
          error: 'Gemma 4 response could not be parsed into the required structured format. Please retry.',
          code: 'INVALID_AI_RESPONSE'
        });
        return;
      }

      // Handle typical Gemini API status errors
      const status = analysisErr.status || 500;
      const message = analysisErr.message || 'Multimodal analysis failed';

      res.status(status >= 400 && status < 600 ? status : 500).json({
        success: false,
        error: `Gemma couldn't analyze these images right now: ${message}. Try again or test with one of the pre-seeded demo examples.`,
        code: 'GEMINI_API_ERROR'
      });
    }
  });
});
