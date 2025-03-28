// QR Code processing worker
importScripts('https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js');

self.onmessage = function(e) {
    const { imageData } = e.data;
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    
    if (code) {
        try {
            // Validate QR code data format
            const data = JSON.parse(code.data);
            if (data.address && data.amount) {
                self.postMessage(data);
            }
        } catch (error) {
            // Invalid QR code format
            console.error('Invalid QR code format:', error);
        }
    }
};
