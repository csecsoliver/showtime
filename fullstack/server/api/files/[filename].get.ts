import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

const docup = createStorage({
  driver: fsDriver({ base: "./docup" }),
});

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, "filename");
  
  if (!filename) {
    throw createError({
      statusCode: 400,
      statusMessage: "Filename is required",
    });
  }

  try {
    // Get the stored data (could be Buffer object or raw data)
    const storedData = await docup.getItem(filename);
    const fileMeta = await docup.getMeta(filename);
    
    if (!storedData) {
      throw createError({
        statusCode: 404,
        statusMessage: "File not found",
      });
    }

    // Convert stored data to proper Buffer
    let fileBuffer: Buffer;
    if (storedData && typeof storedData === 'object' && 'type' in storedData && 'data' in storedData) {
      const bufferObj = storedData as { type: string; data: number[] };
      if (bufferObj.type === 'Buffer' && Array.isArray(bufferObj.data)) {
        // Handle Buffer object stored as JSON
        fileBuffer = Buffer.from(bufferObj.data);
      } else {
        throw createError({
          statusCode: 500,
          statusMessage: "Invalid file format",
        });
      }
    } else if (Buffer.isBuffer(storedData)) {
      // Handle direct Buffer
      fileBuffer = storedData;
    } else if (typeof storedData === 'string') {
      // Handle string data
      fileBuffer = Buffer.from(storedData, 'base64');
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: "Unsupported file format",
      });
    }

    // Set appropriate headers for file download
    setHeader(event, "Content-Type", (fileMeta?.mimeType as string) || "application/octet-stream");
    setHeader(event, "Content-Disposition", `attachment; filename="${filename}"`);
    setHeader(event, "Content-Length", fileBuffer.length);
    setHeader(event, "Cache-Control", "no-cache");
    
    // Return the proper buffer
    return fileBuffer;
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Error retrieving file",
    });
  }
});