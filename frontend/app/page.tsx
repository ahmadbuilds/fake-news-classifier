"use client";
import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Loader2, Shield, Brain, Zap } from 'lucide-react';

interface PredictionResponse {
  "Logistic Regression Prediction": "Fake" | "Real";
  "Random Forest Prediction": "Fake" | "Real";
  "XGBoost Prediction": "Fake" | "Real";
}

interface ModelResult {
  name: string;
  prediction: "Fake" | "Real";
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface NewsRequest {
  text: string;
}

interface ValidationError {
  field: string;
  message: string;
}

export default function Home() {
  const [newsText, setNewsText] = useState<string>('');
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Validation function
  const validateInput = (text: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    if (!text.trim()) {
      errors.push({ field: 'text', message: 'News text is required' });
    } else if (text.trim().length < 10) {
      errors.push({ field: 'text', message: 'News text must be at least 10 characters long' });
    } else if (text.trim().length > 5000) {
      errors.push({ field: 'text', message: 'News text must be less than 5000 characters' });
    }
    
    return errors;
  };

  const analyzeNews = async (): Promise<void> => {
    const errors = validateInput(newsText);
    setValidationErrors(errors);
    
    if (errors.length > 0) return;

    setLoading(true);
    setError('');
    setPredictions(null);
    setIsAnimating(true);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newsText } as NewsRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PredictionResponse = await response.json();
      
      
      setTimeout(() => {
        setPredictions(data);
        setLoading(false);
        setIsAnimating(false);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze news. Please try again.');
      setLoading(false);
      setIsAnimating(false);
    }
  };

  const getModelResults = (predictions: PredictionResponse): ModelResult[] => {
    return [
      {
        name: 'Logistic Regression',
        prediction: predictions["Logistic Regression Prediction"],
        icon: <Brain className="w-6 h-6" />,
        color: predictions["Logistic Regression Prediction"] === "Real" ? 'text-emerald-600' : 'text-red-600',
        bgColor: predictions["Logistic Regression Prediction"] === "Real" ? 'bg-emerald-50' : 'bg-red-50',
        borderColor: predictions["Logistic Regression Prediction"] === "Real" ? 'border-emerald-200' : 'border-red-200',
      },
      {
        name: 'Random Forest',
        prediction: predictions["Random Forest Prediction"],
        icon: <Shield className="w-6 h-6" />,
        color: predictions["Random Forest Prediction"] === "Real" ? 'text-emerald-600' : 'text-red-600',
        bgColor: predictions["Random Forest Prediction"] === "Real" ? 'bg-emerald-50' : 'bg-red-50',
        borderColor: predictions["Random Forest Prediction"] === "Real" ? 'border-emerald-200' : 'border-red-200',
      },
      {
        name: 'XGBoost',
        prediction: predictions["XGBoost Prediction"],
        icon: <Zap className="w-6 h-6" />,
        color: predictions["XGBoost Prediction"] === "Real" ? 'text-emerald-600' : 'text-red-600',
        bgColor: predictions["XGBoost Prediction"] === "Real" ? 'bg-emerald-50' : 'bg-red-50',
        borderColor: predictions["XGBoost Prediction"] === "Real" ? 'border-emerald-200' : 'border-red-200',
      },
    ];
  };

  const handleClear = (): void => {
    setNewsText('');
    setPredictions(null);
    setError('');
    setValidationErrors([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 animate-pulse">
              Fake News Detector
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 animate-pulse"></div>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Harness the power of advanced machine learning to detect fake news with unprecedented accuracy using three sophisticated AI models.
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-300">
          {/* Input Section */}
          <div className="mb-8">
            <label htmlFor="newsText" className="block text-white text-lg font-semibold mb-4">
              Enter News Article Text
            </label>
            <div className="relative">
              <textarea
                id="newsText"
                value={newsText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewsText(e.target.value)}
                placeholder="Paste or type the news article you want to analyze..."
                className={`w-full h-40 p-4 bg-white/5 border-2 ${
                  validationErrors.length > 0 ? 'border-red-400' : 'border-white/20'
                } rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 resize-none hover:border-white/40`}
                disabled={loading}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {newsText.length}/5000
              </div>
            </div>
            
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mt-3 space-y-1">
                {validationErrors.map((error, index) => (
                  <div key={index} className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error.message}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={analyzeNews}
              disabled={loading || !newsText.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Analyze News
                </>
              )}
            </button>
            
            <button
              onClick={handleClear}
              disabled={loading}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-300">{error}</span>
            </div>
          )}

          {/* Loading Animation */}
          {loading && (
            <div className="mb-8 text-center">
              <div className="inline-block">
                <div className="flex space-x-2 justify-center items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-gray-300 mt-4 animate-pulse">Processing with AI models...</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {predictions && !loading && (
            <div className={`space-y-6 transform transition-all duration-1000 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                AI Analysis Results
              </h2>
              
              <div className="grid gap-6 md:grid-cols-3">
                {getModelResults(predictions).map((result, index) => (
                  <div
                    key={result.name}
                    className={`${result.bgColor} ${result.borderColor} border-2 rounded-xl p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${result.color} flex items-center gap-2`}>
                        {result.icon}
                        <span className="font-semibold text-sm">{result.name}</span>
                      </div>
                      {result.prediction === "Real" ? (
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${result.color} mb-2`}>
                        {result.prediction}
                      </div>
                      <div className={`text-sm opacity-75 ${result.color}`}>
                        {result.prediction === "Real" ? "Legitimate News" : "Potential Fake News"}
                      </div>
                    </div>
                    
                    {/* Progress bar animation */}
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${result.prediction === "Real" ? 'bg-emerald-600' : 'bg-red-600'}`}
                        style={{ width: '100%', animationDelay: `${index * 300}ms` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Overall Consensus */}
              <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3 text-center">Overall Consensus</h3>
                <div className="text-center">
                  {(() => {
                    const results = getModelResults(predictions);
                    const realCount = results.filter(r => r.prediction === "Real").length;
                    const fakeCount = results.filter(r => r.prediction === "Fake").length;
                    
                    if (realCount > fakeCount) {
                      return (
                        <div className="text-emerald-400">
                          <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-xl font-semibold">Likely Legitimate</p>
                          <p className="text-sm opacity-75">{realCount}/3 models predict this is real news</p>
                        </div>
                      );
                    } else if (fakeCount > realCount) {
                      return (
                        <div className="text-red-400">
                          <XCircle className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-xl font-semibold">Likely Fake News</p>
                          <p className="text-sm opacity-75">{fakeCount}/3 models predict this is fake news</p>
                        </div>
                      );
                    } else {
                      return (
                        <div className="text-yellow-400">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-xl font-semibold">Uncertain</p>
                          <p className="text-sm opacity-75">Models are split - verify with additional sources</p>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400">
          <p>Powered by Machine Learning • Logistic Regression • Random Forest • XGBoost</p>
        </div>
      </div>
    </div>
  );
}