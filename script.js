document.addEventListener('DOMContentLoaded', () => {
    const questionNavBtnsContainer = document.getElementById('question-navigation-btns');
    const questionsContainer = document.getElementById('questions-container');
    const currentQuestionNumberSpan = document.getElementById('current-question-number');
    const timerSpan = document.getElementById('timer');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const finishBtn = document.getElementById('finish-btn');
    const candidateNameSpan = document.getElementById('candidate-name');
    // नयाँ popup को elements
    const finalConfirmPopup = document.getElementById('final-confirm-popup');
    const finalConfirmYesBtn = document.getElementById('final-confirm-yes-btn');
    const finalConfirmNoBtn = document.getElementById('final-confirm-no-btn');

    // New confirm popup elements
    const confirmPopup = document.getElementById('confirm-popup');
    const confirmFinishBtn = document.getElementById('confirm-finish-btn');
    const confirmCancelBtn = document.getElementById('confirm-cancel-btn');

    let currentQuestionId = 1;
    let totalQuestions;
    let timerInterval;
    let correctAnswers = {};
    let questionsData = {};

    const teacherName = localStorage.getItem('teacherName');
    if (teacherName) {
        candidateNameSpan.textContent = teacherName;
    }

    const storedQuestions = localStorage.getItem('teacherQuestions');
    if (storedQuestions && Object.keys(JSON.parse(storedQuestions)).length > 0) {
        questionsData = JSON.parse(storedQuestions);
        correctAnswers = questionsData;
    } else {
        questionsData = {
            'q1': { question: 'तलको फोटो कसको हो ?', imageURL: 'https://placehold.co/100x100.png', options: {a: 'विकल्प १', b: 'विकल्प २', c: 'विकल्प ३'}, answer: 'a', score: 5, time: 45, imageHeight: 300, imageWidth: 400 },
            'q2': { question: 'यो दोस्रो प्रश्नको लागि पाठ हो।', options: {a: 'विकल्प १', b: 'विकल्प २', c: 'विकल्प ३'}, answer: 'b', score: 10, time: 45 },
            'q3': { question: 'यो तेस्रो प्रश्नको लागि पाठ हो।', options: {a: 'विकल्प १', b: 'विकल्प २', c: 'विकल्प ३'}, answer: 'c', score: 5, time: 45 },
            'q4': { question: 'यो चौथो प्रश्नको लागि पाठ हो।', options: {a: 'विकल्प १', b: 'विकल्प २', c: 'विकल्प ३'}, answer: 'a', score: 10, time: 45 },
            'q5': { question: 'यो पाँचौं प्रश्नको लागि पाठ हो।', options: {a: 'विकल्प १', b: 'विकल्प २', c: 'विकल्प ३'}, answer: 'b', score: 5, time: 45 },
            'q6': { question: 'यो छैटौं प्रश्नको लागि पाठ हो।', options: {a: 'विकल्प १', b: 'विकल्प २', c: 'विकल्प ३'}, answer: 'c', score: 10, time: 45 },
            'q7': { question: 'यो सातौं प्रश्नको लागि पाठ हो।', options: {a: 'विकल्प १', b: 'विकल्प २', c: 'विकल्प ३'}, answer: 'a', score: 5, time: 45 },
            'q8': { question: 'यो आठौं प्रश्नको लागि पाठ हो।', options: {a: 'विकल्प १', b: 'विकल्प २', c: 'विकल्प ३'}, answer: 'b', score: 10, time: 45 },
            'q9': { question: 'यो नवौं प्रश्नको लागि पाठ हो।', options: {a: 'विकल्प १', b: 'विकल्प २', c: 'विकल्प ३'}, answer: 'c', score: 5, time: 45 },
            'q10': { question: 'यो दशौं प्रश्नको लागि पाठ हो।', options: {a: 'विकल्प १', b: 'विकल्प २', c: 'विकल्प ३'}, answer: 'a', score: 10, time: 45 },
            'q11': { question: 'यो एघारौं प्रश्नको लागि पाठ हो।', options: {a: 'विकल्प १', b: 'विकल्प २', c: 'विकल्प ३'}, answer: 'b', score: 5, time: 45 },
            'q12': { question: 'यो बाह्रौं प्रश्नको लागि पाठ हो।', options: {a: 'विकल्प १', b: 'विकल्प २', c: 'विकल्प ३'}, answer: 'c', score: 10, time: 45 }
        };
        correctAnswers = questionsData;
    }
    totalQuestions = Object.keys(questionsData).length;

    function renderQuestions() {
        let questionHtml = '';
        let navHtml = '';
        Object.keys(questionsData).forEach((qid, index) => {
            const qData = questionsData[qid];
            const qNumber = index + 1;
            
            navHtml += `<button class="question-nav-btn" data-question-id="${qNumber}">${qNumber}.</button>`;
            
            let imageStyle = 'max-width: 100%; height: auto; margin-top: 10px;';
            if (qData.imageHeight && qData.imageWidth) {
                imageStyle = `height: ${qData.imageHeight}px; width: ${qData.imageWidth}px; margin-top: 10px;`;
            } else if (qData.imageHeight) {
                imageStyle = `height: ${qData.imageHeight}px; max-width: 100%; margin-top: 10px;`;
            } else if (qData.imageWidth) {
                imageStyle = `width: ${qData.imageWidth}px; height: auto; margin-top: 10px;`;
            }
            
            const imageHtml = qData.imageURL ? `<img src="${qData.imageURL}" alt="Question Image" style="${imageStyle}">` : '';

            let optionsHtml = '';
            for (const optionKey in qData.options) {
                optionsHtml += `
                    <div class="option-box">
                        <label>
                            <input type="radio" name="${qid}" value="${optionKey}">
                            ${qData.options[optionKey]}
                        </label>
                    </div>`;
            }

            questionHtml += `
                <div class="question-item" id="question-${qNumber}">
                    <div class="passage-box">
                        <p>${qData.question}</p>
                        ${imageHtml}
                    </div>
                    <div class="answer-options">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        });
        questionNavBtnsContainer.innerHTML = navHtml;
        questionsContainer.innerHTML = questionHtml;

        const optionBoxes = document.querySelectorAll('.option-box');
        optionBoxes.forEach(box => {
            box.addEventListener('click', () => {
                const radio = box.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    updateNavButtonStatus();
                }
            });
        });
        
        const questionNavBtns = document.querySelectorAll('.question-nav-btn');
        questionNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const questionId = parseInt(btn.dataset.questionId);
                showQuestion(questionId);
            });
        });
    }

    function updateNavButtonStatus() {
        const questionNavBtns = document.querySelectorAll('.question-nav-btn');
        questionNavBtns.forEach(btn => {
            const questionId = btn.dataset.questionId;
            const qName = `q${questionId}`;
            const isAnswered = document.querySelector(`input[name="${qName}"]:checked`);
            
            if (isAnswered) {
                btn.classList.add('answered');
            } else {
                btn.classList.remove('answered');
            }
        });
    }

    function startTimer(timeLimit) {
        let timeRemaining = timeLimit;

        if (timerInterval) {
            clearInterval(timerInterval);
        }

        timerInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                const hours = Math.floor(timeRemaining / 3600);
                const minutes = Math.floor((timeRemaining % 3600) / 60);
                const seconds = timeRemaining % 60;
                
                const formattedTime = 
                    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                
                timerSpan.innerHTML = `<i class="fas fa-clock"></i> ${formattedTime}`;
            } else {
                clearInterval(timerInterval);
                timerSpan.innerHTML = `<i class="fas fa-clock"></i> 00:00:00`;
                alert("time off");
            }
        }, 1000);
    }

    function calculateScore() {
        let totalScore = 0;
        let possibleScore = 0;
        const userAnswers = {};

        for (const questionId in correctAnswers) {
            const correctAnswer = correctAnswers[questionId].answer;
            const scoreValue = correctAnswers[questionId].score;
            possibleScore += scoreValue;
            
            const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
            if (selectedOption) {
                userAnswers[questionId] = selectedOption.value;
                if (selectedOption.value === correctAnswer) {
                    totalScore += scoreValue;
                }
            } else {
                userAnswers[questionId] = null;
            }
        }
        
        localStorage.setItem('finalScore', totalScore);
        localStorage.setItem('possibleScore', possibleScore);
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
        localStorage.setItem('questionsData', JSON.stringify(questionsData));
        
        window.location.href = 'result.html';
    }

    // नयाँ function जसले header-left को पहिलो span मा text update गर्छ
    function updateSectionLabel(questionId) {
        const headerLeftSpans = document.querySelectorAll('.header-left span');
        if (headerLeftSpans.length > 0) {
            headerLeftSpans[0].innerHTML = `<strong>Question:</strong> ${questionId}`;
        }
    }

    function showQuestion(questionId) {
        const questionItems = document.querySelectorAll('.question-item');
        const questionNavBtns = document.querySelectorAll('.question-nav-btn');
        const qid = `q${questionId}`;
        
        questionItems.forEach(item => {
            item.classList.remove('active');
        });
        document.getElementById(`question-${questionId}`).classList.add('active');
        currentQuestionNumberSpan.textContent = questionId;

        questionNavBtns.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.questionId) === questionId) {
                btn.classList.add('active');
            }
        });

        updateSectionLabel(questionId);

        // Timer reset with question time or default 45
        const questionTime = questionsData[qid]?.time || 45;
        startTimer(questionTime);

        currentQuestionId = questionId;
        updateNavButtonStatus();

        prevBtn.disabled = (currentQuestionId === 1);
        nextBtn.disabled = (currentQuestionId === totalQuestions);
    }

    prevBtn.addEventListener('click', () => {
        if (currentQuestionId > 1) {
            showQuestion(currentQuestionId - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentQuestionId < totalQuestions) {
            showQuestion(currentQuestionId + 1);
        }
    });

    // नयाँ confirm popup use गर्ने finishBtn event listener
    finishBtn.addEventListener('click', () => {
        if (currentQuestionId < totalQuestions) {
            showQuestion(currentQuestionId + 1);
        }
        confirmPopup.classList.remove('hidden');
    });

    // पहिलो popup को Finish बटन थिचेपछि दोस्रो popup देखाउने
    confirmFinishBtn.addEventListener('click', () => {
        confirmPopup.classList.add('hidden'); // पहिलो popup बन्द
        finalConfirmPopup.classList.remove('hidden'); // दोस्रो popup देखाउनु
    });

// दोस्रो popup: "Yes" क्लिक गर्दा actual finish
    finalConfirmYesBtn.addEventListener('click', () => {
        finalConfirmPopup.classList.add('hidden');
        calculateScore(); // अब मात्र result मा जाने
    });

// दोस्रो popup: "No" क्लिक गर्दा popup बन्द
    finalConfirmNoBtn.addEventListener('click', () => {
        finalConfirmPopup.classList.add('hidden');
    });

    confirmCancelBtn.addEventListener('click', () => {
        confirmPopup.classList.add('hidden');
    });

    renderQuestions();
    showQuestion(currentQuestionId);
});


