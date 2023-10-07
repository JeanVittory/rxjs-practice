import { fromEvent, Observer, Subject } from "rxjs"
import WORDS_LIST from "./wordsList.json"

const letterRows = document.getElementsByClassName("letter-row")
const onKeyDown$ = fromEvent<KeyboardEvent>(document, "keydown")
let letterIndex = 0;
let letterIndexRow = 0;
let userAnswer:string[] = [];

const getRandomWord = () => WORDS_LIST[Math.round(Math.random() * WORDS_LIST.length)]
const randomWord = getRandomWord()
console.log("🚀 ~ file: index.ts:12 ~ randomWord:", randomWord)

const userWinOrLoosed$ = new Subject<boolean>()

const insertLetter:Observer<KeyboardEvent> = {
    next: (event) => {
        const pressedKey = event.key
        if(pressedKey.length === 1 && pressedKey.match(/[a-z]/i)){
            let letterBox = Array.from(letterRows)[letterIndexRow].children[letterIndex];
            letterBox.textContent = pressedKey;
            userAnswer.push(pressedKey.toUpperCase())
            letterIndex++;
        }
    },
    complete: () => console.log("Complete!"),
    error: () => console.log("Error!")
}

const checkWord:Observer<KeyboardEvent> = {
    next: (event:KeyboardEvent) => {
        if(event.key === "Enter") {
            if(userAnswer.join("") === randomWord) return userWinOrLoosed$.next(true)
            return userWinOrLoosed$.next(false);
        }
    },
    complete: () => console.log("Complete!"),
    error: (error:any) => console.log(error)
}

onKeyDown$.subscribe(insertLetter)
onKeyDown$.subscribe(checkWord)
userWinOrLoosed$.subscribe(value =>{
    let letterRowsWinned = Array.from(letterRows)[letterIndexRow]
    for (let i = 0; i < 5 ; i++) {
        letterRowsWinned.children[i].classList.add("letter-green");

    }
})
