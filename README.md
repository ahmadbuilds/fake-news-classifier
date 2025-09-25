# Fake News Classifier

## Overview

The Fake News Classifier is a comprehensive project designed to classify news articles as either "Fake" or "True" using machine learning models. This project includes both a backend for data processing and model training, and a frontend for user interaction.

## Project Structure

```
backend/
├── Dockerfile
├── requirements.txt
├── data/
│   ├── processed/
│   │   ├── x_train.csv
│   │   ├── y_train.csv
│   ├── raw/
│       ├── Fake.csv
│       ├── True.csv
├── models/
│   ├── logistic_regression_model.pkl
│   ├── random_forest_model.pkl
│   ├── xgboost_model.pkl
├── notebooks/
│   ├── modeling.ipynb
│   ├── preprocessing.ipynb
├── reports/
│   ├── summary.txt
│   ├── figures/
│       ├── Articles per Subject.png
│       ├── Articles publish over time.png
│       ├── Important Features in Random Forest.png
│       ├── Important features of XGBOOST Model.png
│       ├── output.png
├── src/
│   ├── main.py
frontend/
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
```

## Backend

The backend is responsible for data preprocessing, model training, and serving predictions. It is implemented in Python and includes the following components:

### Key Features

- **Data Preprocessing**: Prepares raw data for training and testing.
- **Model Training**: Trains multiple machine learning models including Logistic Regression, Random Forest, and XGBoost.
- **Model Serving**: Provides predictions using trained models.

### Notebooks

- `preprocessing.ipynb`: Contains data cleaning and preprocessing steps.
- `modeling.ipynb`: Includes model training and evaluation.

### Models

- Logistic Regression
- Random Forest
- XGBoost

### Dependencies

All dependencies are listed in `requirements.txt`.

### How to Run

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the main script:
   ```bash
   fastapi dev src/main.py
   ```

## Frontend

The frontend is built using Next.js and provides a user-friendly interface for interacting with the classifier.

### Key Features

- **Interactive UI**: Allows users to input news articles and view predictions.
- **Visualization**: Displays insights and figures from the backend.

### How to Run

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:3000`.

## Data

The dataset is divided into two categories:

- `Fake.csv`: Contains fake news articles.
- `True.csv`: Contains true news articles.

Processed data is stored in the `data/processed` directory.

## Reports

Reports and visualizations are stored in the `reports` directory. Key figures include:

- Articles per Subject
- Articles Published Over Time
- Important Features in Random Forest
- Important Features in XGBoost

## Docker Support

The backend includes a `Dockerfile` for containerization. To build and run the Docker container:

```bash
docker build -t fake-news-classifier-backend .
docker run -p 5000:5000 fake-news-classifier-backend
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.