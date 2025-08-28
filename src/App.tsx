import { useEffect, useState } from 'react';
import './App.css';
import data from './data.json';
import { IQuestion } from './types';

function App() {
  const initialResultState: { [x: string]: number } = {};

  useEffect(() => {
    if (document) {
      document.title = data.title;
    }
    for (const i of data.possible_results) {
      initialResultState[i] = 0;
    }
  });

  const [currentScreen, setCurrentScreen] = useState<'MAIN_SCREEN' | 'QUESTION_SCREEN' | 'RESULT_SCREEN'>('MAIN_SCREEN');
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [resultItem, setResultItem] = useState<string>('');
  const [resultPercent, setResultPercent] = useState('');
  const [results, setResults] = useState<typeof initialResultState>({...initialResultState});

  const startHandler = () => {
    setQuestions([...data.data].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setResults({...initialResultState});
    setCurrentScreen('QUESTION_SCREEN');
  };

  const yesHandler = () => {
    answerHandlerCommon(true);
  }

  const noHandler = () => {
    answerHandlerCommon(false);
  }

  const answerHandlerCommon = (isYes: boolean) => {
    const newResults = { ...results };
    for (const i of Object.keys(newResults)) {
      if (isYes && questions[currentIndex].yes.includes(i)) {
        newResults[i]++;
      } else if (!isYes && !questions[currentIndex].yes.includes(i)) {
        newResults[i]++;
      }
    }
    setResults(newResults);

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    if (newIndex === questions.length) {
      evaluate(newResults);
    }
  }

  const evaluate = (answers: typeof initialResultState) => {
    const finalResults = Object.entries(answers).sort((a, b) => b[1] - a[1])[0];
    setResultItem(finalResults[0]);
    setResultPercent((finalResults[1] / questions.length * 100).toFixed(2));
    setCurrentScreen('RESULT_SCREEN');
  }
  
  const againHandler = () => {
    setCurrentScreen('MAIN_SCREEN');
  }

  return (
    <div className='d-flex flex-column align-items-center justify-content-center vh-100 overflow-hidden'>
      { currentScreen === 'MAIN_SCREEN' ?
        <MainScreen title={data.title} description={data.description} beginButtonText={data.begin} onStart={startHandler}></MainScreen>
      : currentScreen === 'QUESTION_SCREEN' ?
        <Question text={questions[currentIndex].question} yes={data.yes} no={data.no} count={currentIndex + 1} totalCount={questions.length} onNo={noHandler} onYes={yesHandler}></Question>
      : currentScreen === 'RESULT_SCREEN' ?
        <Result resultText={data.result_text} result={resultItem} explaination={data.result_description} percent={resultPercent} again={data.again} onAgain={againHandler}></Result>
      : <></> }
    </div>
  );
}

function MainScreen({title, description, beginButtonText, onStart}: { title: string, description: string, beginButtonText: string, onStart: () => void }) {
  return (
    <>
      <h1>{title}</h1>
      <p>{description}</p>
      <button className='btn btn-primary' onClick={onStart}>{beginButtonText}</button>
    </>
  );
}

function Question({text, yes, no, count, totalCount, onYes, onNo}: { text: string, yes: string, no: string, count: number, totalCount: number, onYes: () => void; onNo: () => void }) {
  return (
    <>
      <h5>{count}/{totalCount}</h5>
      <h1>{text}</h1>
      <div className='d-flex gap-1'>
        <button className='btn btn-success' onClick={onYes}>{yes}</button>
        <button className='btn btn-danger' onClick={onNo}>{no}</button>
      </div>
    </>
  );
}

function Result({resultText, result, explaination, percent, again, onAgain}: { resultText: string, result: string, explaination: string, percent: string, again: string, onAgain: () => void }) {
  return (
    <>
      <h1>{resultText.replace('{result}', result).replace('{percent}', percent)}</h1>
      <p>{explaination.replace('{result}', result).replace('{percent}', percent)}</p>
      <button className='btn btn-primary' onClick={onAgain}>{again}</button>
    </>
  );
}

export default App;
