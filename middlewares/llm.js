import { getGenerativeModel } from '@google/generative-ai'


async function answerFromPDF(query, base64PDF) {
    try {
        getGenerativeModel({
            apiKey: process.env.GEMINI_API_KEY,
        })

        const prompt = `
      [INSTRUCCIONES]: Eres un asistente de IA que responde preguntas sobre documentos PDF. Solo responde con el contenido que haya en el PDF, no te inventes nada ni extraigas información de otros lugares. Responde un json key-value donde el key sea el de cada pregunta y el value tu respuesta. Si no sabes la respuesta responde un null.
      Aquí está el contenido del PDF en formato Base64:
      ${base64PDF}

      Pregunta: ${query}
    `

        const response = await getGenerativeModel('gemini-pro').generateText({
            prompt,
        })

        return response[0].text
    } catch (error) {
        console.error('Error al consultar el modelo:', error)
    }
}

// Testing
const query = '¿Cuál es el tema principal del documento? (key: "tema")'
const base64PDF = 'JVBERi0xLj...' // Replace with Base64 content from PDF

answerFromPDF(query, base64PDF)
    .then(answer => console.log('Respuesta:', answer))
    .catch(error => console.error(error))
