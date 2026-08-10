from ultralytics import YOLO

model = YOLO("models/best.pt")

print("Model berhasil di-load!")
print("Model type:", type(model))
print("Class names:", model.names)