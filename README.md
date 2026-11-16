# PhishLab 🔍 
## Live Website: https://pallav-biyala.github.io/PhishScope/

---

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
| Features | 55 |
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
3. **Model Evaluation:** Training and evaluating multiple machine learning algorithms on various metrics.
4. **Results & Analysis:** Comparing model performance using classification metrics and confusion matrices.
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

- Majority Classifier
- Logistic Regression
- Ridge Logistic Regression
- Linear Support Vector Machine
- Decision Trees
- Random Forests
- Gradient Boosting
- AdaBoost
- XGBoost

Majority Classifier acts as baseline classifier for comparison.

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

For a more detailed explanation of the results, model comparisons, and error analysis, visit the PhishScope website.

---

## 📁 Repository Structure

```text
phishing_research_website/
│
├── index.html
│
├── css/
│   ├── main.css
│   ├── data.css
│   ├── preprocessing.css
│   ├── methods.css
│   ├── results.css
│   ├── error-analysis.css
│   ├── limitations.css
│   ├── conclusion.css
│   └── reproducibility.css
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

## ⚙️ Installation, Setup & Reproduction

### Requirements

The experiments were developed using:

- Python 3.14.6
- NumPy 2.4.6
- Pandas 3.0.3
- Matplotlib 3.11.0
- Scikit-learn 1.9.0
- XGBoost 3.4.1

The original development environment was Anaconda on Windows.

Follow the steps below to set up the project, reproduce the experiments, and explore the research website locally.

### 1. Clone the Repository

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/Pallav-Biyala/PhishScope.git
cd PhishScope
```

### 2. Install Dependencies

The experiments were developed using Python 3.14.6 and the libraries specified in `requirements.txt`.

Install the required dependencies:

```bash
pip install -r requirements.txt
```

If you do not already have Jupyter Notebook installed, install it using:

```bash
pip install notebook
```

### 3. Reproduce the Experiments

The repository contains seven notebooks covering exploratory analysis, preprocessing, model development, and evaluation.

For reproducing the consolidated experimental results, execute the following notebooks in order:

1. `06_all_models.ipynb` — Trains and evaluates the selected models across the different feature configurations.
2. `07_model_comparison_and_testing_final.ipynb` — Performs the final comparative evaluation and testing.

The earlier notebooks (`01`–`05`) document exploratory work and the development of individual modelling approaches. They are included for reference and do not need to be executed when reproducing the consolidated experiments.

**Important:** The notebooks use relative paths to access project data and save experimental outputs. Open Jupyter Notebook with the `notebooks/` directory as the working directory before executing them.

The experiments generate evaluation metrics, confusion matrices, and other outputs, which are saved in the corresponding directories under `results/`. Individual experiment runs are recorded separately to preserve their results.

Execution time may vary depending on your hardware and configuration.

### 4. Run the Research Website Locally

The repository also contains a static, interactive website that presents the research methodology, experimental findings, error analysis, limitations, and reproducibility instructions.

To launch it, navigate back to the project root directory:

```bash
cd ..
```

Start a local HTTP server:

```bash
python -m http.server 8000
```

Open the following address in your browser:

```text
http://localhost:8000
```

You can now explore the website and interact with its visualisations and research findings.

**Note:** The research website can be explored independently of the experiments. You do not need to execute any notebooks to view the website or inspect the results already included in the repository.

We have also provided code for two additional models: **Lasso Logistic Regression** and **RBF Kernel SVM**. These experiments can take considerably longer to execute. If you are interested in exploring their performance, you can run the corresponding code cells in the notebooks and compare their results with the other models.

**Disclaimer:** These two models are not included in the website's reported results and therefore will not appear in its comparisons.

---

## 🌐 PhishScope Website

The website presents the project as a sequence of research episodes:

- The Problem Statement
- Exploratory Data Analysis
- Data preprocessing
- Methods & Model Evaluation
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

AI tools were used during the development of this project as supplementary assistants for code review, implementation support, debugging, and documentation.

The tools used and their contributions are described below:

- **Claude:** Used to review our code against the project rubric and suggest potential improvements. We evaluated these suggestions and incorporated relevant changes based on our understanding of the requirements.

- **Trae AI:** Used to generate the initial implementation of the interactive explorer in the Results & Analysis section of the website. We subsequently reviewed, modified, and corrected the generated code to meet our requirements.

- **ChatGPT:** Used throughout the project as a learning and development assistant. Its assistance included discussing machine learning concepts and experimental decisions, troubleshooting implementation issues, reviewing code, refining documentation, and improving the research website.

**Our Responsibility:** All AI-assisted outputs were reviewed and evaluated by us before being incorporated into the project. We made the final decisions regarding the methodology, implementation, experimental choices, and presentation of results. We remain responsible for the correctness, integrity, and conclusions of the submitted work.

---

## 📜 Acknowledgements

We sincerely acknowledge the authors of the PhiUSIIL dataset and the UCI Machine Learning Repository for making the dataset available for research.

**Dataset Authors:** Arvind Prasad and Shalini Chandra.

---

## 👨‍💻 Project Author

**Pallav Biyala**  
Undergraduate Student, IIT Gandhinagar  
ES 335 — Machine Learning Project

*PhishScope — Understanding Phishing Through Machine Learning.*
