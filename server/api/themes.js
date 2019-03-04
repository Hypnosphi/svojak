const axios = require('axios')
const convert = require('xml-js')

const QUESTIONS_COUNT = 5
const THEMES_COUNT = 60

const themeRE = new RegExp(
  `^([\\s\\S]*?)?${Array(QUESTIONS_COUNT)
    .fill()
    .map((_, i) => `(?:\\s+(${i + 1})0?\\.\\s([\\s\\S]*?))?`)
    .join('')}$`,
)

const numberRE = /^[1-5]$/

const parseTheme = raw => {
  if (!raw || !themeRE.test(raw)) {
    return {}
  }

  const matches = raw.match(themeRE).slice(1)

  const result = {}
  let match = matches.shift()
  if (!numberRE.test(match)) {
    result.title = match
    match = matches.shift()
  }

  while (matches.length > 0) {
    if (!numberRE.test(match)) {
      break
    }

    result[match] = matches.shift()
    match = matches.shift()
  }

  return result
}

const processTheme = ({
  QuestionId,
  tournamentTitle,
  tournamentPlayedAt,
  Authors,
  Question,
  Answer,
  Comments,
}) => {
  const parsedQuestions = parseTheme(Question._text)
  const answers = parseTheme(Answer._text)
  const comments = parseTheme(Comments._text)

  let questions = []
  for (let i = 1; i <= QUESTIONS_COUNT; i++) {
    const question = parsedQuestions[i]
    const answer = answers[i]
    const comment = comments[i]
    if (!question || !answer) {
      break
    }
    questions.push({question, answer, comment})
  }

  return {
    id: QuestionId._text,
    questions,
    title: parsedQuestions.title,
    date: tournamentPlayedAt._text,
    tournament: tournamentTitle._text,
    author: Authors._text,
  }
}

module.exports = async (req, res) => {
  const {data} = await axios(
    `https://db.chgk.info/xml/random/types5/limit${THEMES_COUNT}`,
    {
      responseType: 'document',
    },
  )
  const {search} = convert.xml2js(data, {compact: true})
  const themes = search.question
    .map(processTheme)
    .filter(
      ({title, questions}) => title && questions.length === QUESTIONS_COUNT,
    )
  res.end(JSON.stringify(themes))
}
