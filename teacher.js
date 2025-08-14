document.addEventListener('DOMContentLoaded', () => {
    const questionForm = document.getElementById('question-form');
    const questionsList = document.getElementById('questions-list');
    const backBtn = document.getElementById('back-btn');
    const saveBtn = document.getElementById('save-btn');
    const editQuestionIdInput = document.getElementById('edit-question-id');
    const logoutTeacherBtn = document.getElementById('logout-teacher-btn');

    let teacherQuestions = JSON.parse(localStorage.getItem('teacherQuestions')) || {};

    function renderQuestionsList() {
        questionsList.innerHTML = '';
        if (Object.keys(teacherQuestions).length === 0) {
            questionsList.innerHTML = '<p>No questions added yet.</p>';
            return;
        }
        Object.keys(teacherQuestions).forEach(qid => {
            const qData = teacherQuestions[qid];
            const questionEl = document.createElement('div');
            questionEl.classList.add('question-item');
            
            const imageStyle = qData.imageHeight && qData.imageWidth 
                ? `height: ${qData.imageHeight}px; width: ${qData.imageWidth}px;`
                : 'max-width:100px; height:auto;';

            const imageHtml = qData.imageURL ? `<img src="${qData.imageURL}" alt="Question Image" style="${imageStyle} margin-top: 5px;">` : '';
            
            questionEl.innerHTML = `
                <div>
                    <h4>Q${qid.replace('q', '')}. ${qData.question}</h4>
                    ${imageHtml}
                    <p><strong>Options:</strong> A) ${qData.options.a}, B) ${qData.options.b}, C) ${qData.options.c}</p>
                    <p><strong>Correct:</strong> ${qData.answer.toUpperCase()}, <strong>Score:</strong> ${qData.score}, <strong>Time:</strong> ${qData.time}s</p>
                </div>
                <div class="question-actions">
                    <button class="edit-btn" data-id="${qid}">Edit</button>
                    <button class="delete-btn" data-id="${qid}">Delete</button>
                </div>
            `;
            questionsList.appendChild(questionEl);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editQuestion);
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteQuestion);
        });
    }

    function editQuestion(e) {
        const qid = e.target.dataset.id;
        const qData = teacherQuestions[qid];
        
        document.getElementById('question-text').value = qData.question;
        document.getElementById('image-url').value = qData.imageURL || '';
        document.getElementById('image-height').value = qData.imageHeight || '';
        document.getElementById('image-width').value = qData.imageWidth || '';
        document.getElementById('option-a').value = qData.options.a;
        document.getElementById('option-b').value = qData.options.b;
        document.getElementById('option-c').value = qData.options.c;
        document.getElementById('correct-answer').value = qData.answer;
        document.getElementById('question-score').value = qData.score;
        document.getElementById('question-time').value = qData.time;
        
        editQuestionIdInput.value = qid;
        saveBtn.textContent = 'Save Changes';
    }

    function deleteQuestion(e) {
        if (confirm('Are you sure you want to delete this question?')) {
            const qid = e.target.dataset.id;
            delete teacherQuestions[qid];
            
            const newQuestions = {};
            Object.values(teacherQuestions).forEach((q, index) => {
                newQuestions[`q${index + 1}`] = q;
            });
            teacherQuestions = newQuestions;
            
            localStorage.setItem('teacherQuestions', JSON.stringify(teacherQuestions));
            renderQuestionsList();
        }
    }

    questionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const qid = editQuestionIdInput.value;
        const imageUrl = document.getElementById('image-url').value;
        const imageHeight = document.getElementById('image-height').value;
        const imageWidth = document.getElementById('image-width').value;
        
        const newQuestionData = {
            question: document.getElementById('question-text').value,
            imageURL: imageUrl || null,
            imageHeight: imageHeight ? parseInt(imageHeight, 10) : null,
            imageWidth: imageWidth ? parseInt(imageWidth, 10) : null,
            options: {
                a: document.getElementById('option-a').value,
                b: document.getElementById('option-b').value,
                c: document.getElementById('option-c').value
            },
            answer: document.getElementById('correct-answer').value,
            score: parseInt(document.getElementById('question-score').value, 10),
            time: parseInt(document.getElementById('question-time').value, 10)
        };
        
        if (qid) {
            teacherQuestions[qid] = newQuestionData;
            alert('Question updated successfully!');
            saveBtn.textContent = 'Add Question';
            editQuestionIdInput.value = '';
        } else {
            const newQuestionId = `q${Object.keys(teacherQuestions).length + 1}`;
            teacherQuestions[newQuestionId] = newQuestionData;
            alert('Question added successfully!');
        }
        
        localStorage.setItem('teacherQuestions', JSON.stringify(teacherQuestions));
        questionForm.reset();
        renderQuestionsList();
    });

    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    logoutTeacherBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    renderQuestionsList();
});