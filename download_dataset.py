import os
import zipfile
import requests
from pathlib import Path


# ============================================================
# CONFIGURATION
# ============================================================

DATASET_URL = (
    "https://data.mendeley.com/"
    "public-api/zip/663j22s43c/download/3"
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent

DATASET_DIR = PROJECT_ROOT / "dataset"

ZIP_PATH = PROJECT_ROOT / "dataset.zip"


# ============================================================
# DOWNLOAD DATASET
# ============================================================

def download_dataset():

    print("=" * 60)
    print("Downloading dataset...")
    print("=" * 60)

    response = requests.get(
        DATASET_URL,
        stream=True
    )

    response.raise_for_status()

    total_size = int(
        response.headers.get("content-length", 0)
    )

    downloaded = 0

    with open(ZIP_PATH, "wb") as file:

        for chunk in response.iter_content(
            chunk_size=1024 * 1024
        ):

            if chunk:

                file.write(chunk)

                downloaded += len(chunk)

                if total_size:

                    percentage = (
                        downloaded / total_size
                    ) * 100

                    print(
                        f"\rProgress: {percentage:.2f}%",
                        end=""
                    )

    print("\n")
    print("Download completed!")


# ============================================================
# EXTRACT DATASET
# ============================================================

def extract_dataset():

    print("=" * 60)
    print("Extracting dataset...")
    print("=" * 60)

    DATASET_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    with zipfile.ZipFile(
        ZIP_PATH,
        "r"
    ) as zip_ref:

        zip_ref.extractall(DATASET_DIR)

    print("Extraction completed!")


# ============================================================
# CLEAN ZIP
# ============================================================

def remove_zip():

    if ZIP_PATH.exists():

        ZIP_PATH.unlink()

        print("Removed temporary ZIP file.")


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    try:

        download_dataset()

        extract_dataset()

        remove_zip()

        print("\n" + "=" * 60)
        print("DATASET READY")
        print("=" * 60)

        print(f"Dataset location:")
        print(DATASET_DIR)

    except Exception as e:

        print("\nDataset download failed.")
        print(f"Error: {e}")