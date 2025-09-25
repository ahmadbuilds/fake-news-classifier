import pandas as pd
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from fastapi.middleware.cors import CORSMiddleware
import os
import nltk
nltk.data.path.append("./nltk_data")
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
stop_words = set(stopwords.words('english'))
model_path = os.path.join(os.path.dirname(__file__))

LogisticRegressionModel = joblib.load(os.path.join(model_path, '../models/logistic_regression_model.pkl'))
RandomForestModel = joblib.load(os.path.join(model_path, '../models/random_forest_model.pkl'))
XGBoostModel = joblib.load(os.path.join(model_path, '../models/xgboost_model.pkl'))

class NewsItem(BaseModel):
    text: str

def preprocess_text(text):
    text = text.lower()
    porter=nltk.PorterStemmer()
    tokens = word_tokenize(text)
    tokens = [porter.stem(word) for word in tokens if word.isalpha() and word not in stop_words]
    return ' '.join(tokens) if tokens else ' '

@app.post("/predict")
def predict_news(item: NewsItem):
    text = preprocess_text(item.text)
    data = pd.DataFrame([text], columns=['text'])
    
    lr_prediction = LogisticRegressionModel.predict(data)[0]
    rf_prediction = RandomForestModel.predict(data)[0]
    xgb_prediction = XGBoostModel.predict(data)[0]
    
    return {
        "Logistic Regression Prediction": "Fake" if lr_prediction == 0 else "Real",
        "Random Forest Prediction": "Fake" if rf_prediction == 0 else "Real",
        "XGBoost Prediction": "Fake" if xgb_prediction == 0 else "Real"
    }