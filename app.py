import os
from flask import Flask, request, jsonify
from ultralytics import YOLO
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
model = YOLO("models/best.pt")
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

@app.route("/health")
def health():
    return {"status": "ok"}


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return {"error": "No image uploaded"}, 400
    
    image = request.files["image"]

    if image.filename == "":
        return {"error": "No file selected"}, 400

    filename = image.filename 
    extension = filename.rsplit(".", 1)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        return{"error": "Invalid image format"}, 400
    
    filepath = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(filepath)

    result = model(filepath)
    result = result[0]
    class_id = int(result.probs.top1)
    confidence = float(result.probs.top1conf)

    prediction = model.names[class_id]
    return jsonify({
        "filename": filename,
        "prediction": {
            "class": prediction,
            "confidence": confidence
        }
})
    

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)