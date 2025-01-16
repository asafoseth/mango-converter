document.getElementById("compressButton").addEventListener("click", function () {
    const imageUpload = document.getElementById("imageUpload").files[0];
    const compressionLevel = document.getElementById("compressionSlider").value;
    const outputFormat = document.getElementById("imageFormat").value;

    if (!imageUpload) {
        alert("Please upload an image first.");
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(imageUpload);

    reader.onload = function (event) {
        const originalImageSrc = event.target.result;

        const img = new Image();
        img.src = originalImageSrc;

        img.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Perform pixel clustering-based compression
            const compressedDataUrl = compressImageWithClustering(
                canvas,
                outputFormat,
                compressionLevel
            );

            document.getElementById("originalImage").src = originalImageSrc;
            document.getElementById("compressedImage").src = compressedDataUrl;
            document.getElementById("compareImageOriginal").src = originalImageSrc;
            document.getElementById("compareImageCompressed").src = compressedDataUrl;

            document.getElementById("downloadButton").onclick = function () {
                const link = document.createElement("a");
                link.href = compressedDataUrl;
                link.download = `compressed_image.${outputFormat}`;
                link.click();
            };
        };
    };
});

/**
 * Advanced image compression using pixel clustering and quantization.
 * @param {HTMLCanvasElement} canvas - The canvas containing the image.
 * @param {string} outputFormat - Desired output format (e.g., jpeg, png).
 * @param {number} compressionLevel - Compression level (0–100).
 * @returns {string} - Base64 URL of the compressed image.
 */
function compressImageWithClustering(canvas, outputFormat, compressionLevel) {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const clusterSize = Math.floor(10 - (compressionLevel / 10)); // Adjust cluster size based on compression level
    const quantizationFactor = Math.max(2, Math.floor(compressionLevel / 10)); // More aggressive quantization at lower levels

    // Perform pixel clustering
    for (let y = 0; y < canvas.height; y += clusterSize) {
        for (let x = 0; x < canvas.width; x += clusterSize) {
            const clusterPixels = [];
            for (let i = 0; i < clusterSize; i++) {
                for (let j = 0; j < clusterSize; j++) {
                    const pixelIndex = ((y + i) * canvas.width + (x + j)) * 4;
                    if (pixelIndex < data.length) {
                        clusterPixels.push([
                            data[pixelIndex],     // Red
                            data[pixelIndex + 1], // Green
                            data[pixelIndex + 2], // Blue
                        ]);
                    }
                }
            }

            // Calculate cluster average
            const avgPixel = clusterPixels.reduce(
                (sum, pixel) => {
                    sum[0] += pixel[0];
                    sum[1] += pixel[1];
                    sum[2] += pixel[2];
                    return sum;
                },
                [0, 0, 0]
            ).map((value) => Math.floor(value / clusterPixels.length / quantizationFactor) * quantizationFactor);

            // Apply average to the cluster
            for (let i = 0; i < clusterSize; i++) {
                for (let j = 0; j < clusterSize; j++) {
                    const pixelIndex = ((y + i) * canvas.width + (x + j)) * 4;
                    if (pixelIndex < data.length) {
                        data[pixelIndex] = avgPixel[0];     // Red
                        data[pixelIndex + 1] = avgPixel[1]; // Green
                        data[pixelIndex + 2] = avgPixel[2]; // Blue
                    }
                }
            }
        }
    }

    // Update canvas with compressed data
    ctx.putImageData(imageData, 0, 0);

    // Convert canvas to compressed Data URL
    return canvas.toDataURL(`image/${outputFormat}`, compressionLevel / 100);
}
