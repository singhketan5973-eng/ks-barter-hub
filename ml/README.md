# Machine learning workspace

This folder holds the experiments and training code for Barter Hub's AI features. Everything here uses free, open source tools.

## Setup

From this folder:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Then open a notebook in VS Code and choose the `.venv` kernel.

## Contents

| Path | What it is |
| --- | --- |
| `data/listings.csv` | A small hand-written dataset: 10 example listings for each of the 16 categories |
| `notebooks/01-first-classifier.ipynb` | ML-1: a first text classifier with word counts |
| `notebooks/02-pretrained-embeddings.ipynb` | ML-2: a pretrained sentence model, zero-shot classification, and similar-listing search |
| `notebooks/03-threshold-and-export.ipynb` | ML-3A: top-3 accuracy, a confidence threshold, and exporting the model |
| `models/category-model.json` | The exported model that the API reads (created by notebook 03) |
| `models/fixtures.json` | Test examples with expected answers, for checking the API against Python |
| `requirements.txt` | Python packages |

The example listings are invented for learning. They are not real user data.

## Models used

| Model | Licence | Used in |
| --- | --- | --- |
| `all-MiniLM-L6-v2` | Apache 2.0 | ML-2, ML-3 |
