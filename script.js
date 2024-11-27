const fs = require('fs')
const { JSDOM } = require('jsdom')
const path = require('path')

const HEADER = `Question Text,Question Type,Option 1,Option 2,Option 3,Option 4,Option 5,Correct Answer\n`


//change the path here
let directory = path.join(__dirname, '/materials/folder_name')
let output = path.join(__dirname, '/outcomes/output_name.csv')



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

const questionList = []


function getQuestion(question) {
    let questionResult = ''
    Array.from(question.children).forEach(questChild => {
        questionResult += questChild.innerHTML.replace(/[\n\r\t]/g, '').trim() + '\n'
    })
    return questionResult.replace(/"/g, '""')
}

function createQuestion(question, ans, corrAns) {
    const innerAns = []

    var q, a1, a2, a3, a4, cA
    if (question.children.length != 0) {
        q = `"'${getQuestion(question)}"`
    }
    else {
        q = `"'${question.innerHTML.replace(/[\n\r\t]/g, '').trim().replace(/"/g, '""')}"`
    }

    ans.forEach(answer => {
        innerAns.push(answer.innerHTML.replace(/[\n\r\t]/g, '').trim())
    })
    a1 = `"'${ans[0].innerHTML.replace(/[\n\r\t]/g, '').trim()}"`
    a2 = `"'${ans[1].innerHTML.replace(/[\n\r\t]/g, '').trim()}"`
    a3 = `"'${ans[2].innerHTML.replace(/[\n\r\t]/g, '').trim()}"`
    a4 = `"'${ans[3].innerHTML.replace(/[\n\r\t]/g, '').trim()}"`

    cA = (innerAns.indexOf(corrAns.innerHTML.replace(/[\n\r\t]/g, '').trim()) + 1)

    return new Question(q, a1, a2, a3, a4, cA)
}

fs.appendFileSync(output, HEADER)


try {
    const htmlList = fs.readdirSync(directory).filter(file => path.extname(file).toLowerCase() === '.html')
    htmlList.forEach(htmlFile => {
        try {
            console.log(htmlFile);
            const htmldoc = fs.readFileSync(path.join(directory, htmlFile), 'utf-8')
            const document = new JSDOM(htmldoc).window.document
            document.querySelectorAll('.multiple_choice_question:not(.incorrect)').forEach(questionblock => {
                const question = questionblock.querySelector('.question_text')
                const ans = questionblock.querySelectorAll('.answer_text')
                const corrAns = questionblock.querySelector('.selected_answer .answer_text')
                let newQuestion = createQuestion(question, ans, corrAns)
                if (!questionList.some(question => question.quest === newQuestion.quest)) questionList.push(newQuestion)
            })
        } catch (error) {
            console.log(error)
        }
    })
    questionList.forEach(question => {
        fs.appendFileSync(output, question.toFullQuestion())
    })
} catch (error) {

}



