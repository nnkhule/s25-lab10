import React, { useState } from 'react';
import './Quiz.css';
import quizData from '../data/quizData';
import QuizQuestion from '../core/QuizQuestion';

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  score: number;
  showResult: boolean;
  userAnswers: string[];
  answerStatus: boolean[]; // Track whether each answer was correct
}

const Quiz: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswer: null,
    score: 0,
    showResult: false,
    userAnswers: Array(quizData.length).fill(null),
    answerStatus: Array(quizData.length).fill(false)
  });

  const handleOptionSelect = (option: string): void => {
    setState((prevState) => ({
      ...prevState,
      selectedAnswer: option,
      userAnswers: prevState.userAnswers.map((answer, idx) => 
        idx === prevState.currentQuestionIndex ? option : answer
      )
    }));
  };

  const handleNextQuestion = (): void => {
    const { selectedAnswer, currentQuestionIndex, score, userAnswers } = state;
    const currentQuestion = quizData[currentQuestionIndex];

    // Check if answer is correct
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const updatedScore = isCorrect ? score + 1 : score;

    // Update answer status
    const updatedAnswerStatus = [...state.answerStatus];
    updatedAnswerStatus[currentQuestionIndex] = isCorrect;

    const isLastQuestion = currentQuestionIndex === quizData.length - 1;

    setState((prevState) => ({
      ...prevState,
      score: updatedScore,
      currentQuestionIndex: isLastQuestion 
        ? prevState.currentQuestionIndex 
        : prevState.currentQuestionIndex + 1,
      selectedAnswer: userAnswers[currentQuestionIndex + 1] || null,
      showResult: isLastQuestion,
      answerStatus: updatedAnswerStatus
    }));
  };

  const handlePreviousQuestion = (): void => {
    if (state.currentQuestionIndex > 0) {
      setState((prevState) => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex - 1,
        selectedAnswer: prevState.userAnswers[prevState.currentQuestionIndex - 1] || null
      }));
    }
  };

  const { currentQuestionIndex, selectedAnswer, score, showResult, userAnswers, answerStatus } = state;
  const currentQuestion = quizData[currentQuestionIndex];

  if (showResult) {
    return (
      <div className="quiz-results">
        <h2>Quiz Results</h2>
        <div className="score-summary">
          <p>Your final score: <span className="score-value">{score} out of {quizData.length}</span></p>
          <p className="score-percentage">{Math.round((score / quizData.length) * 100)}%</p>
        </div>
        
        <div className="detailed-results">
          <h3>Detailed Breakdown:</h3>
          <ul>
            {quizData.map((question, index) => (
              <li key={index} className={`result-item ${answerStatus[index] ? 'correct' : 'incorrect'}`}>
                <div className="question-text">Q{index + 1}: {question.question}</div>
                <div className="user-answer">Your answer: {userAnswers[index] || 'Not answered'}</div>
                {!answerStatus[index] && (
                  <div className="correct-answer">Correct answer: {question.correctAnswer}</div>
                )}
                <div className="answer-status">
                  {answerStatus[index] ? '✓ Correct' : '✗ Incorrect'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        Question {currentQuestionIndex + 1} of {quizData.length}
      </div>
      
      <h2 className="quiz-question">{currentQuestion.question}</h2>

      <ul className="options-list">
        {currentQuestion.options.map((option) => (
          <li
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={`option-item ${selectedAnswer === option ? 'selected' : ''}`}
          >
            {option}
          </li>
        ))}
      </ul>

      <div className="selected-answer">
        <h3>Selected Answer:</h3>
        <p>{selectedAnswer ?? 'No answer selected'}</p>
      </div>

      <div className="navigation-buttons">
        <button 
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="nav-button prev-button"
        >
          Previous Question
        </button>
        <button 
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className="nav-button next-button"
        >
          {currentQuestionIndex === quizData.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>

      <div className="current-score">
        Current Score: {score}
      </div>
    </div>
  );
};

export default Quiz;