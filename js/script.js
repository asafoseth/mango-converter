const dropZone = document.getElementById('dropZone');
const imageInput = document.getElementById('imageInput');
const compressButton = document.getElementById('compressButton');
const compressionSlider = document.getElementById('compressionSlider');
const compressionValue = document.getElementById('compressionValue');

dropZone.addEventListener('click', () => imageInput.click());

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '#e8e8e8';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.backgroundColor = '#fff';
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '#fff';
    imageInput.files = event.dataTransfer.files;
    previewImage(); // Preview the image on drop
});

imageInput.addEventListener('change', previewImage);

compressionSlider.addEventListener('input', () => {
    compressionValue.textContent = compressionSlider.value;
    previewCompressedImage();
});

compressButton.addEventListener('click', compressImage);

function previewImage() {
    const fileInput = imageInput.files[0];
    if (!fileInput) return;

    const reader = new FileReader();
    reader.readAsDataURL(fileInput);

    reader.onload = function (event) {
        document.getElementById('originalImage').src = event.target.result;
        previewCompressedImage();
    };
}

function previewCompressedImage() {
    const fileInput = imageInput.files[0];
    const algorithm = document.getElementById('algorithmSelect').value;
    const compressionLevel = compressionSlider.value;
    const width = document.getElementById('widthInput').value;
    const height = document.getElementById('heightInput').value;

    if (!fileInput) return;

    const reader = new FileReader();
    reader.readAsDataURL(fileInput);

    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = width || img.width;
            canvas.height = height || img.height;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            let compressedDataUrl;
            if (algorithm === 'jpeg') {
                compressedDataUrl = canvas.toDataURL('image/jpeg', compressionLevel / 100);
            } else if (algorithm === 'png') {
                compressedDataUrl = canvas.toDataURL('image/png');
            } else if (algorithm === 'webp') {
                compressedDataUrl = canvas.toDataURL('image/webp', compressionLevel / 100);
            }

            document.getElementById('compressedImage').src = compressedDataUrl;
            document.getElementById('downloadLink').href = compressedDataUrl;
        };
    };
}

function compressImage() {
    previewCompressedImage(); // Re-use the same function for compression
}
