import React, { useState } from 'react';
import he from "he"

const Question = ({ question, answers, selectedAnswerId, correctAnswerId, gameEnded, onAnswerCheck }) => {
  return (
    <div className='flex flex-col justify-start w-[300px] sm:w-[520px] md:w-[680px] lg:w-[1000px] my-2'>
      <h1 className="font-bold text-lg sm:text-2xl">{question}</h1>
      <div className='flex justify-start w-[200px] sm:w-[300px] mt-2'>
        {answers.map((answer, index) => (
          <button
            onClick={() => {
              onAnswerCheck(answer.isCorrect, answer.id);
            }}
            key={index}
            className={`my-2 mx-1 sm:mx-4 rounded-lg border-[#4D589E] border px-2 py-1 text-sm sm:text-lg font-[10px] ${
              gameEnded
                ? answer.id === correctAnswerId
                  ? "bg-[#68D391] border-[#68D391]"
                  : answer.id === selectedAnswerId
                  ? "bg-[#F87171] border-[#F87171]"
                  : ""
                : answer.id === selectedAnswerId
                ? "bg-[#D6DBF5] border-[#D6DBF5]"
                : "hover:bg-[#D6DBF5] hover:border-[#D6DBF5]"
            } duration-200`}
          >
            {he.decode(answer.answer)}
          </button>
        ))}
      </div>
      <hr className="my-6 bg-[#DBDEF0]" />
    </div>
  );
};

export default Question;
