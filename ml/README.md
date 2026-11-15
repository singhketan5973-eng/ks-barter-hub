# Machine learning workspace

This folder holds the experiments and training code for Barter Hub's AI features. Everything here uses free, open source tools.

## Setup

From this folder:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Then open a notebook in VS Code and choose the `.venv` kernel.

## Contents

| Path | What it is |
| --- | --- |
| `data/listings.csv` | A small hand-written dataset: 10 example listings for each of the 16 categories |
| `notebooks/01-first-classifier.ipynb` | ML-1: a first text classifier |
| `requirements.txt` | Python packages |

The example listings are invented for learning. They are not real user data.
