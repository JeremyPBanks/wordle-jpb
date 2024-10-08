import { InformationCircleIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { Alert } from "./components/alerts/Alert";
import { Grid } from "./components/grid/Grid";
import { Keyboard } from "./components/keyboard/Keyboard";
import { AboutModal } from "./components/modals/AboutModal";
import { InfoModal } from "./components/modals/InfoModal";
import { isWordInWordList, isWinningWord, solutionIndex, wordList } from "./lib/words";
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import { loadGameStateFromLocalStorage,saveGameStateToLocalStorage } from './lib/localStorage'

const ALERT_TIME_MS = 2000

function App() {
    const [currentGuess, setCurrentGuess] = useState('')
    const [isGameWon, setIsGameWon] = useState(false)
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
    const [isNotEnoughLetters, setIsNotEnoughLetters] = useState(false)
    const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false)
    const [isGameLost, setIsGameLost] = useState(false)
    const [successAlert, setSuccessAlert] = useState('')
    const [guesses, setGuesses] = useState<string[]>(() => {
        const loaded = loadGameStateFromLocalStorage()
        if (loaded?.solution !== wordList[solutionIndex]) {
            return []
        }
        const gameWasWon = loaded.guesses.includes(wordList[solutionIndex])
        if (gameWasWon) {
            setIsGameWon(true)
        }
        if (loaded.guesses.length === 6 && !gameWasWon) {
            setIsGameLost(true)
        }
        return loaded.guesses
    })

    const [stats, setStats] = useState(() => loadStats())

    useEffect(() => {
        let solution = wordList[solutionIndex];
        saveGameStateToLocalStorage({ guesses, solution })
    }, [guesses])

    useEffect(() => {
        if (isGameWon) {
            setSuccessAlert(
                "You Did it!"
            )
            setTimeout(() => {
                setSuccessAlert('')
            }, ALERT_TIME_MS)
        }
        if (isGameLost) {
            setTimeout(() => {
            }, ALERT_TIME_MS)
        }
    }, [isGameWon, isGameLost])

    const onChar = (value: string) => {
        if (currentGuess.length < 5 && guesses.length < 6 && !isGameWon) {
            setCurrentGuess(`${currentGuess}${value}`)
        }
    }

    const onDelete = () => {
        setCurrentGuess(currentGuess.slice(0, -1))
    }

    const onEnter = () => {
        if (isGameWon || isGameLost) {
            return
        }
        if (!(currentGuess.length === 5)) {
            setIsNotEnoughLetters(true)
            return setTimeout(() => {
                setIsNotEnoughLetters(false)
            }, ALERT_TIME_MS)
        }

        if (!isWordInWordList(currentGuess)) {
            setIsWordNotFoundAlertOpen(true)
            return setTimeout(() => {
                setIsWordNotFoundAlertOpen(false)
            }, ALERT_TIME_MS)
        }

        const winningWord = isWinningWord(currentGuess)

        if (currentGuess.length === 5 && guesses.length < 6 && !isGameWon) {
            setGuesses([...guesses, currentGuess])
            setCurrentGuess('')

            if (winningWord) {
                setStats(addStatsForCompletedGame(stats, guesses.length))
                return setIsGameWon(true)
            }

            if (guesses.length === 5) {
                setStats(addStatsForCompletedGame(stats, guesses.length + 1))
                setIsGameLost(true)
            }
        }
    }

  return (
    <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="flex w-80 mx-auto items-center mb-8">
              <h1 className="text-xl grow font-bold">Wordle - V+J Edition - Puzzle {solutionIndex +1}</h1>
        <InformationCircleIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() => setIsInfoModalOpen(true)}
              />
      </div>
      <Grid guesses={guesses} currentGuess={currentGuess} />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        guesses={guesses}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        handleClose={() => setIsInfoModalOpen(false)}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        handleClose={() => setIsAboutModalOpen(false)}
      />

      <button
        type="button"
        className="mx-auto mt-8 flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsAboutModalOpen(true)}
      >
        About this game
          </button>
          <Alert message="Not enough letters" isOpen={isNotEnoughLetters} />
          <Alert message="Word not found" isOpen={isWordNotFoundAlertOpen} />
          <Alert message={`Sorry - Game Over! Answer: ${wordList[solutionIndex]}`} isOpen={isGameLost} />
          <Alert message={successAlert} isOpen={successAlert !== ''} variant="success" />
    </div>
  );
}

export default App;
