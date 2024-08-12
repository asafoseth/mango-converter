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

            const compressedDataUrl = canvas.toDataURL(`image/${outputFormat}`, compressionLevel / 100);

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
