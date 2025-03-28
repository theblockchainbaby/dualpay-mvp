// QR Scanner Component using Instascan
class QRScanner {
    constructor() {
        this.scanner = null;
        this.videoElement = null;
    }

    async init(containerId, onScanCallback) {
        // Create video element
        this.videoElement = document.createElement('video');
        this.videoElement.className = 'w-full rounded-lg';
        document.getElementById(containerId).appendChild(this.videoElement);

        try {
            // Request camera permission
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            this.videoElement.srcObject = stream;
            this.videoElement.play();

            // Process frames for QR code detection
            this.processVideoFrames(onScanCallback);
        } catch (error) {
            console.error('Camera access error:', error);
            document.getElementById(containerId).innerHTML = 
                '<div class="text-red-500">Camera access denied. Please check your permissions.</div>';
        }
    }

    async processVideoFrames(onScanCallback) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const worker = new Worker('/js/qr-worker.js');

        worker.onmessage = (e) => {
            if (e.data) {
                onScanCallback(e.data);
            }
        };

        const processFrame = () => {
            if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
                canvas.width = this.videoElement.videoWidth;
                canvas.height = this.videoElement.videoHeight;
                context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
                
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                worker.postMessage({ imageData });
            }
            requestAnimationFrame(processFrame);
        };

        processFrame();
    }

    stop() {
        if (this.videoElement && this.videoElement.srcObject) {
            const tracks = this.videoElement.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.videoElement.srcObject = null;
        }
    }
}
