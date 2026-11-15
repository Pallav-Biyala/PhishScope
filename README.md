# PhishLab 🔍
### Understanding Phishing URL Detection Through Machine Learning

PhishLab is a machine learning research project that investigates how effectively different machine learning algorithms can distinguish phishing URLs from legitimate URLs.

The project explores URL-based features, preprocessing strategies, model comparisons, evaluation results, and the limitations of automated phishing detection.

The accompanying website presents the research as an interactive walkthrough, making the methodology and findings accessible without requiring readers to inspect the notebooks.

---

## 🎯 Research Question

**How effectively can machine learning models distinguish phishing URLs from legitimate URLs using URL-related features, and how does the choice of feature representation affect their performance?**

The project investigates:
- Which URL characteristics help distinguish phishing from legitimate websites?
- How do different feature groups influence classification performance?
- How do linear models compare with tree-based and boosting algorithms?
- What kinds of errors do the models make?
- What limitations and potential dataset artifacts affect the reliability of the results?

---

## 📊 Dataset

This project uses the **PhiUSIIL Phishing URL (Website) Dataset**, obtained from the UCI Machine Learning Repository.

| Property | Details |
|---|---|
| Dataset | PhiUSIIL Phishing URL (Website) |
| Source | UCI Machine Learning Repository |
| Original instances | 235,795 |
| Features | 54 |
| Instances used in this project | 235,370 |
| Classification task | Binary classification |
| Labels | Phishing (0), Legitimate (1) |

The project applies data preparation and cleaning before model development. The resulting dataset contains 235,370 observations.

**Original dataset:**
https://archive.ics.uci.edu/dataset/967/phiusiil+phishing+url+dataset

**Dataset citation:**

Prasad, A., & Chandra, S. (2024). *PhiUSIIL Phishing URL (Website)*. UCI Machine Learning Repository. https://doi.org/10.1016/j.cose.2023.103545.

The dataset is distributed under the Creative Commons Attribution 4.0 International (CC BY 4.0) license. Please retain appropriate attribution when redistributing it.

---

## 🧪 Methodology

The project follows a structured machine learning workflow:

1. **Exploratory Data Analysis:** Investigating feature distributions, class characteristics, relationships, and potential dataset issues.
2. **Preprocessing:** Preparing the dataset and constructing different feature representations.
3. **Model Development:** Training and comparing multiple machine learning algorithms.
4. **Evaluation:** Comparing model performance using classification metrics and confusion matrices.
5. **Error Analysis:** Investigating model behavior and understanding classification errors.
6. **Limitations:** Examining potential sources of bias, dataset artifacts, and generalization challenges.

### Feature Configurations

Five feature configurations were explored:

| Configuration | Description | Number of Features |
|---|---|---:|
| M1 | Lexical Features | 17 |
| M2 | Derived Features | 20 |
| M3 | URL Features | 21 |
| M4 | Page-aware Features | 49 |
| M5 | All Numeric Features | 50 |

These configurations allow comparisons across different feature representations.

### Models Compared

The experiments include:

- Ridge Logistic Regression
- Linear Support Vector Machine
- Decision Trees
- Random Forests
- Gradient Boosting
- AdaBoost
- XGBoost

A baseline classifier is also included for comparison.

---

## 📈 Results and Analysis

The repository contains the experimental outputs, including:

- Model evaluation results.
- Confusion matrices.
- Final testing results.
- Summary tables.

The final testing outputs are available under:

`results/Final_Tests/`

Key files:

| File | Description |
|---|---|
| `final_45_test_results.json` | Final testing results |
| `final_45_test_confusion_matrices.json` | Confusion matrices |
| `final_45_test_summary.csv` | Tabular summary of final tests |

For a more detailed explanation of the results, model comparisons, and error analysis, visit the PhishLab website.

---

## 📁 Repository Structure

```text
phishing_research_website/
│
├── index.html
│
├── css/
│   ├── main.css
│   ├── style.css
│   ├── data.css
│   ├── preprocessing.css
│   ├── methods.css
│   ├── results.css
│   ├── error-analysis.css
│   ├── limitations.css
│   └── conclusion.css
│
├── js/
│   ├── script.js
│   └── results.js
│
├── images/
│
├── data/
│   ├── PhiUSIIL_Phishing_URL_Dataset.csv
│   └── Dataset Documentation.pdf
│
├── notebooks/
│   ├── 01_EDA.ipynb
│   ├── 02_preprocessing.ipynb
│   ├── 03_logistic_regression.ipynb
│   ├── 04_support_vector_machines.ipynb
│   ├── 05_DecisionTrees_Bagging_Boosting.ipynb
│   ├── 06_all_models.ipynb
│   └── 07_model_comparison_and_testing_final.ipynb
│
├── results/
│   ├── Baseline Models/
│   ├── Ridge Logistic Regression/
│   ├── Linear SVM/
│   ├── Decision Trees/
│   ├── Random Forests/
│   ├── Gradient Boosting/
│   ├── Ada Boosting/
│   ├── XG Boosting/
│   └── Final_Tests/
│
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation and Setup

### Requirements

The experiments were developed using:

- Python 3.14.6
- NumPy 2.4.6
- Pandas 3.0.3
- Matplotlib 3.11.0
- Scikit-learn 1.9.0
- XGBoost 3.4.1

The original development environment was Anaconda on Windows.

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_NAME>
```

### 2. Create and activate an environment

Using Anaconda:

```bash
conda create -n phishlab python=3.14.6
conda activate phishlab
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Launch Jupyter Notebook

```bash
jupyter notebook
```

Open the notebooks in the `notebooks/` directory.

**Important:** The notebooks use relative paths to access project data. Run them with the `notebooks/` directory as the working directory unless a notebook specifies otherwise.

Execute the notebooks as instructed in the webiste's Epilogue.

---

## 🌐 PhishLab Website

The website presents the project as a sequence of research episodes:

- Dataset exploration
- Data preprocessing
- Model development
- Results and analysis
- Model and error analysis
- Limitations
- Conclusion
- Reproducibility

It also includes interactive elements to help readers explore model behavior and understand the experimental findings.

**Live Website:** `https://pallav-biyala.github.io/PhishScope/`

---

## ⚠️ Limitations

Machine learning-based phishing detection has important limitations.

Some considerations explored in this project include:

- Dataset-specific patterns may influence model predictions.
- Certain features may act as strong indicators because of how the dataset was constructed.
- Random train-test splits may not fully represent real-world deployment conditions.
- Performance on a particular dataset does not guarantee generalization to unseen phishing campaigns.
- Dataset labels and feature definitions may introduce limitations that cannot be resolved through model selection alone.

These limitations are important when interpreting model performance and considering practical deployment.

---

## 🔬 Reproducibility

The repository provides the resources required to inspect and reproduce the experiments:

- Jupyter notebooks containing the analysis and model development.
- The dataset and its documentation.
- Dependency specifications.
- Saved model evaluation results.
- Confusion matrices and final testing summaries.

The notebooks provide the implementation details, while the website communicates the research decisions and findings.

---

## 🤖 AI Use Disclosure

<!-- Add an accurate disclosure describing any AI tools used,
the tasks they assisted with, and which parts were independently
implemented, tested, and verified. -->

---

## 📜 Acknowledgements

We acknowledge the authors of the PhiUSIIL dataset and the UCI Machine Learning Repository for making the dataset available for research.

**Dataset authors:** Arvind Prasad and Shalini Chandra.

---
