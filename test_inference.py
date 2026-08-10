from ultralytics import YOLO

model = YOLO("models/best.pt")

results = model("test.png")

for result in results:
    probs = result.probs

    class_id = int(probs.top1)
    confidence = float(probs.top1conf)

    print("Prediction:")
    print(f"Class: {model.names[class_id]}")
    print(f"Confidence: {confidence:.2%}")