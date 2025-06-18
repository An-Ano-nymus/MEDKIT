import sys
import cv2
import numpy as np
import pyzbar.pyzbar as pyzbar

def resize_if_needed(image, max_dim=800):
    height, width = image.shape[:2]
    if max(height, width) > max_dim:
        scale = max_dim / float(max(height, width))
        new_dim = (int(width * scale), int(height * scale))
        image = cv2.resize(image, new_dim, interpolation=cv2.INTER_AREA)
    return image

def rotate_image(image, angle):
    h, w = image.shape[:2]
    center = (w//2, h//2)
    matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    return cv2.warpAffine(image, matrix, (w, h), flags=cv2.INTER_LINEAR)

def preprocess_for_barcode(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    sharpened = cv2.GaussianBlur(gray, (0, 0), 3)
    sharpened = cv2.addWeighted(gray, 1.5, sharpened, -0.5, 0)
    thresh = cv2.adaptiveThreshold(
        sharpened, 255, cv2.ADAPTIVE_THRESH_MEAN_C,
        cv2.THRESH_BINARY, 15, 10
    )
    return thresh

def detect_qr_and_barcode(image):
    image = resize_if_needed(image)
    found_data = None

    for angle in [0, 90, 180, 270]:
        rotated = rotate_image(image, angle)
        processed = preprocess_for_barcode(rotated)
        decoded_objects = pyzbar.decode(processed)

        for obj in decoded_objects:
            data = obj.data.decode("utf-8")
            if data.startswith("http://") or data.startswith("https://"):
                found_data = data
                return found_data  # Return early for URL

        detector = cv2.QRCodeDetector()
        data, points, _ = detector.detectAndDecode(rotated)
        if points is not None and data:
            if data.startswith("http://") or data.startswith("https://"):
                found_data = data
                return found_data

    return found_data  # could be None

def process_image_file(image_path):
    image = cv2.imread(image_path)
    if image is None:
        print("Could not load image.", flush=True)
        return
    result = detect_qr_and_barcode(image)
    if result:
        print(result, flush=True)
    else:
        print(" No valid QR/Barcode with URL found.", flush=True)

def process_webcam():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print(" Cannot access webcam", flush=True)
        return

    print("📷 Scanning via webcam... Press 'q' to quit", flush=True)
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame", flush=True)
            break

        result = detect_qr_and_barcode(frame)
        if result:
            print(result, flush=True)
            break

        cv2.imshow("Live Scanner", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print(" User exited scanner", flush=True)
            break

    cap.release()
    cv2.destroyAllWindows()

# Entry point for MERN via subprocess
if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg == "camera":
            process_webcam()
        else:
            process_image_file(arg)
    else:
        print(" Please provide an image path or 'camera' as argument", flush=True)
