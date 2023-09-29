import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import he from "he";
import Question from "./components/Question";

function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false)
  const [questions, setQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  function startGame() {
    setGameStarted(true);
  }

  const handleAnswerCheck = (isCorrect, questionId, answerId) => {
    setShuffledQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            selectedAnswerId: answerId,
          };
        }
        return question;
      })
    );

    if (isCorrect) {
      setCorrectAnswers((prevCount) => prevCount + 1);
    }

    console.log("Is it correct?", isCorrect);
    console.log(answerId);
  };

  function fetchAnswers() {
    fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.results.map((question) => ({ ...question, id: nanoid() })));
      });
  }

  useEffect(() => {
    fetchAnswers()  
  }, []);

  useEffect(() => {
    const totalCorrect = shuffledQuestions.filter((question) =>
      question.answers.find((answer) => answer.id === question.selectedAnswerId && answer.isCorrect)
    ).length;
  
    setCorrectAnswers(totalCorrect);
  }, [shuffledQuestions]);  

  useEffect(() => {
    if (questions.length > 0) {
      const shuffledQuestionsArray = questions.map((question) => {
        const shuffledAnswers = shuffleArray([
          ...question.incorrect_answers.map((answer) => ({
            answer: answer,
            isCorrect: false,
            id: nanoid(),
          })),
          { answer: question.correct_answer, isCorrect: true, id: nanoid() },
        ]);
        return { ...question, answers: shuffledAnswers, selectedAnswerId: null };
      });
      setShuffledQuestions(shuffledQuestionsArray);
    }
  }, [questions]);

  function checkAnswers() {
    console.log(correctAnswers)
    if(gameEnded === false) {
      setGameEnded(true)
    } else {
      fetchAnswers()
      setGameEnded(false)
    }
    
  }

  return (
    <div className={`${!gameStarted ? "h-screen" : "h-auto py-8"} bg-[#F5F7FB] font-karla flex items-center justify-center`}>
      {!gameStarted ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-transparent text-5xl md:text-7xl bg-clip-text bg-gradient-to-r from-[#68D391] to-[#F87171] mb-7">Quizzical</h1>
          <h3 className="w-[380px] sm:w-[600px] text-md md:text-[22px] font-[500] mb-[24px] text-center">
            Test your skills and knowledge with our fun quiz. <hr className="opacity-0"/> Select the correct answers and show that you are a master of general knowledge!
          </h3>
          <button
            onClick={startGame}
            className="bg-[#4D5B9E] text-white h-[52px] w-[193px] rounded-[15px] hover:shadow-xl duration-200"
          >
            Start quiz
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-start w-[400px] sm:w-[768px] md:w-[1024px] lg:w-[1200px] items-center">
          {shuffledQuestions.map((question, index) => (
            <Question
              key={index}
              question={he.decode(question.question)}
              answers={question.answers}
              selectedAnswerId={question.selectedAnswerId}
              correctAnswerId={question.answers.find((answer) => answer.isCorrect)?.id}
              gameEnded={gameEnded}
              onAnswerCheck={(isCorrect, answerId) =>
                handleAnswerCheck(isCorrect, question.id, answerId)
              }
            />
          ))}

          <div className="flex flex-row w-[400px] justify-center items-center text-center">
            {gameEnded ? <h2 className="text-2xl mr-4 mt-[32px]">You scored {correctAnswers}/5 correct answers</h2> : ""}
            <button
              className="mt-[32px] px-4 py-2 bg-[#4D5B9E] border-none text-white text-xl rounded-lg hover:shadow-xl duration-200"
              onClick={checkAnswers}
            >
              {gameEnded ? "New quiz" : "Check answers"}
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default App;
