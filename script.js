const fs = require('fs')
const { JSDOM } = require('jsdom')
const path = require('path')

let directory = path.join(__dirname, 'lecture1')
let output = path.join(__dirname, 'test.txt')
class Question {
    quest; ansA; ansB; ansC; ansD; correctAns;
    constructor(quest, ansA, ansB, ansC, ansD, correctAns) {
        this.quest = quest
        this.ansA = ansA
        this.ansB = ansB
        this.ansC = ansC
        this.ansD = ansD
        this.correctAns = correctAns
    }


    toFullQuestion() {
        return `${this.quest}` + ',Multiple Choice,' + `${this.ansA}` + ',' + `${this.ansB}` + ',' + `${this.ansC}` + ',' + `${this.ansD}` + ',,' + `${this.correctAns}` + '\n'
    }

}
// replace(/[\n\r\t]/g, '').trim()

const questionList = []


function getQuestion(question) {
    let questionResult = ''
    Array.from(question.children).forEach(questChild => {
        questionResult += questChild.innerHTML.replace(/[\n\r\t]/g, '').trim() + '\n'
    })
    return questionResult
}

function createQuestion(question, ans, corrAns) {
    const innerAns = []

    var q, a1, a2, a3, a4, cA
    if (question.children.length != 0) {
        q = `"'${getQuestion(question)}"`
    }
    else {
        q = `"'${question.innerHTML.replace(/[\n\r\t]/g, '').trim()}"`
    }

    ans.forEach(answer => {
        innerAns.push(answer.innerHTML.replace(/[\n\r\t]/g, '').trim())
    })
    // console.log(ans);
    a1 = `"'${ans[0].innerHTML.replace(/[\n\r\t]/g, '').trim()}"`
    a2 = `"'${ans[1].innerHTML.replace(/[\n\r\t]/g, '').trim()}"`
    a3 = `"'${ans[2].innerHTML.replace(/[\n\r\t]/g, '').trim()}"`
    // a4 = `"'${ans[3].innerHTML.replace(/[\n\r\t]/g, '').trim()}"`

    cA = (innerAns.indexOf(corrAns.innerHTML.replace(/[\n\r\t]/g, '').trim()) + 1)

    return new Question(q, a1, a2, a3, a4, cA)
}

try {
    const htmlList = fs.readdirSync(directory).filter(file => path.extname(file).toLowerCase() === '.html')
    htmlList.forEach(htmlFile => {
        try {

            const htmldoc = fs.readFileSync(path.join(directory, htmlFile), 'utf-8')
            const document = new JSDOM(htmldoc).window.document
            document.querySelectorAll('.multiple_choice_question').forEach(questionblock => {
                if (!questionblock.classList.contains('incorrect')) {
                    const question = questionblock.querySelector('.question_text')
                    const ans = questionblock.querySelectorAll('.answer_text')
                    const corrAns = questionblock.querySelector('.selected_answer .answer_text')
                    console.log(ans.length);
                    let newQuestion = createQuestion(question, ans, corrAns)
                    if (!questionList.some(question => question.quest === newQuestion.quest)) questionList.push(newQuestion)
                }
            })
        } catch (error) {
            console.log(error);
        }
    })
    questionList.forEach(question => {
        // console.log(question.toFullQuestion());
        // fs.appendFileSync(output, question.toFullQuestion())
    })
} catch (error) {

}



