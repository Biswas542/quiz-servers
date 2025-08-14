document.addEventListener('DOMContentLoaded', () => {
    const finalScoreDisplay = document.getElementById('final-score');
    const resultStatus = document.getElementById('result-status');
    const topperMessage = document.getElementById('topper-message');
    const answerSheetBtn = document.getElementById('answer-sheet-btn');
    const answerSheetContainer = document.getElementById('answer-sheet-container');
    const restartBtn = document.getElementById('restart-btn');
    const logoutBtn = document.getElementById('logout-btn'); // New logout button

    const finalScore = parseInt(localStorage.getItem('finalScore'), 10);
    const possibleScore = parseInt(localStorage.getItem('possibleScore'), 10);
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers'));
    const questionsData = JSON.parse(localStorage.getItem('questionsData'));

    if (!isNaN(finalScore) && !isNaN(possibleScore) && possibleScore > 0) {
        finalScoreDisplay.textContent = `${finalScore} / ${possibleScore}`;
        
        const percentage = (finalScore / possibleScore) * 100;
        
        if (percentage >= 80) {
            resultStatus.textContent = 'Pass';
            resultStatus.classList.add('pass');
            if (percentage === 100) {
                topperMessage.textContent = 'You are Topper!';
            }
        } else {
            resultStatus.textContent = 'Fail';
            resultStatus.classList.add('fail');
        }
    } else {
        finalScoreDisplay.textContent = 'Score not found';
    }

    answerSheetBtn.addEventListener('click', () => {
        if (answerSheetContainer.style.display === 'none') {
            displayAnswerSheet();
            answerSheetContainer.style.display = 'block';
            answerSheetBtn.textContent = 'Hide Answer Sheet';
        } else {
            answerSheetContainer.style.display = 'none';
            answerSheetBtn.textContent = 'Answer Sheet';
        }
    });

    function displayAnswerSheet() {
        let answerSheetHTML = '';
        for (const qid in questionsData) {
            const qData = questionsData[qid];
            const userAnswer = userAnswers[qid] || 'Not Answered';
            const correctAnswer = qData.answer;

            let userAnswerClass = '';
            if (userAnswer !== 'Not Answered') {
                if (userAnswer === correctAnswer) {
                    userAnswerClass = 'correct-answer';
                } else {
                    userAnswerClass = 'user-answer incorrect';
                }
            }

            answerSheetHTML += `
                <div class="answer-item">
                    <h4>Question ${qid.replace('q', '')}.</h4>
                    <p>${qData.question}</p>
                    <p><strong>Correct Answer:</strong> <span class="correct-answer">${correctAnswer}</span></p>
                    <p><strong>Your Answer:</strong> <span class="${userAnswerClass}">${userAnswer}</span></p>
                </div>
            `;
        }
        answerSheetContainer.innerHTML = answerSheetHTML;
    }

    // Event listener for the new logout button
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });

    // Event listener for the restart button (same as before)
    restartBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'quiz.html'; // Redirect to quiz.html for a new test
    });
});